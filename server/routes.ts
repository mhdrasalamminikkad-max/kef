import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertMembershipSchema, insertBootcampSchema, adminLoginSchema, insertProgramSchema, updateProgramSchema, insertPartnerSchema, updatePartnerSchema, updatePopupSettingsSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { sendBootcampRegistrationEmail, sendMembershipApplicationEmail, sendContactFormEmail } from "./email";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const uploadsDir = path.resolve(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage_config = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage: storage_config,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed!"));
  },
});

declare module 'express-session' {
  interface SessionData {
    adminId?: string;
    adminUsername?: string;
    codeVerified?: boolean;
  }
}

const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.adminId) {
    return res.status(401).json({ error: "Unauthorized - Admin login required" });
  }
  next();
};

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post("/api/admin/verify-code", async (req, res) => {
    try {
      const { code } = req.body;
      
      if (!code || code !== "786786") {
        return res.status(401).json({ error: "Invalid secret code" });
      }
      
      req.session.codeVerified = true;
      
      res.json({ 
        success: true,
        message: "Code verified successfully"
      });
    } catch (error) {
      console.error("Error verifying secret code:", error);
      res.status(500).json({ error: "Verification failed" });
    }
  });
  
  app.post("/api/admin/login", async (req, res) => {
    try {
      if (!req.session?.codeVerified) {
        return res.status(403).json({ error: "Secret code verification required first" });
      }
      
      const result = adminLoginSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ 
          error: "Validation failed", 
          details: validationError.message 
        });
      }
      
      const { username, password } = result.data;
      const admin = await storage.verifyAdminPassword(username, password);
      
      if (!admin) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      req.session.adminId = admin.id;
      req.session.adminUsername = admin.username;
      req.session.codeVerified = false;
      
      res.json({ 
        success: true, 
        admin: { 
          id: admin.id, 
          username: admin.username 
        } 
      });
    } catch (error) {
      console.error("Error during admin login:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/admin/session", (req, res) => {
    if (req.session?.adminId) {
      res.json({ 
        authenticated: true, 
        admin: { 
          id: req.session.adminId, 
          username: req.session.adminUsername 
        } 
      });
    } else {
      res.json({ authenticated: false });
    }
  });

  // File upload endpoint for admin
  app.post("/api/admin/upload", requireAdmin, upload.single("image"), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      
      // Return the URL path to the uploaded file
      const fileUrl = `/uploads/${req.file.filename}`;
      res.json({ 
        success: true, 
        url: fileUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  });

  // Handle multer errors
  app.use((err: any, req: any, res: any, next: any) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ error: "File size too large. Maximum 10MB allowed." });
      }
      return res.status(400).json({ error: err.message });
    }
    if (err.message === "Only image files are allowed!") {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  });

  app.get("/api/admin/dashboard", requireAdmin, async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  app.get("/api/admin/bootcamp", requireAdmin, async (req, res) => {
    try {
      const registrations = await storage.getBootcampRegistrations();
      res.json(registrations);
    } catch (error) {
      console.error("Error fetching bootcamp registrations:", error);
      res.status(500).json({ error: "Failed to fetch bootcamp registrations" });
    }
  });

  app.patch("/api/admin/bootcamp/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status || !["pending", "approved", "rejected"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      
      const updated = await storage.updateBootcampStatus(id, status);
      
      if (!updated) {
        return res.status(404).json({ error: "Bootcamp registration not found" });
      }
      
      res.json(updated);
    } catch (error) {
      console.error("Error updating bootcamp status:", error);
      res.status(500).json({ error: "Failed to update bootcamp status" });
    }
  });

  app.delete("/api/admin/bootcamp/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteBootcamp(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Bootcamp registration not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting bootcamp registration:", error);
      res.status(500).json({ error: "Failed to delete bootcamp registration" });
    }
  });

  app.get("/api/admin/membership", requireAdmin, async (req, res) => {
    try {
      const applications = await storage.getMembershipApplications();
      res.json(applications);
    } catch (error) {
      console.error("Error fetching membership applications:", error);
      res.status(500).json({ error: "Failed to fetch membership applications" });
    }
  });

  app.patch("/api/admin/membership/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status || !["pending", "approved", "rejected"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      
      const updated = await storage.updateMembershipStatus(id, status);
      
      if (!updated) {
        return res.status(404).json({ error: "Membership application not found" });
      }
      
      res.json(updated);
    } catch (error) {
      console.error("Error updating membership status:", error);
      res.status(500).json({ error: "Failed to update membership status" });
    }
  });

  app.delete("/api/admin/membership/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteMembership(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Membership application not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting membership application:", error);
      res.status(500).json({ error: "Failed to delete membership application" });
    }
  });

  app.get("/api/admin/contact", requireAdmin, async (req, res) => {
    try {
      const contacts = await storage.getContactSubmissions();
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
      res.status(500).json({ error: "Failed to fetch contact submissions" });
    }
  });

  app.delete("/api/admin/contact/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteContact(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Contact submission not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting contact submission:", error);
      res.status(500).json({ error: "Failed to delete contact submission" });
    }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const result = insertContactSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ 
          error: "Validation failed", 
          details: validationError.message 
        });
      }
      
      const contact = await storage.createContactSubmission(result.data);
      
      // Send email notification to admin
      sendContactFormEmail({
        name: contact.name,
        email: contact.email,
        phone: contact.phone || undefined,
        subject: contact.subject,
        message: contact.message,
        createdAt: contact.createdAt,
      }).catch(err => console.error("Failed to send contact email:", err));
      
      res.status(201).json(contact);
    } catch (error) {
      console.error("Error creating contact submission:", error);
      res.status(500).json({ error: "Failed to submit contact form" });
    }
  });

  app.get("/api/contact", async (req, res) => {
    try {
      const contacts = await storage.getContactSubmissions();
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
      res.status(500).json({ error: "Failed to fetch contact submissions" });
    }
  });

  app.post("/api/membership", async (req, res) => {
    try {
      const result = insertMembershipSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ 
          error: "Validation failed", 
          details: validationError.message 
        });
      }
      
      const membership = await storage.createMembershipApplication(result.data);
      
      // Send email notification to admin
      sendMembershipApplicationEmail({
        fullName: membership.fullName,
        email: membership.email,
        phone: membership.phone,
        organization: membership.organization || undefined,
        designation: membership.designation || undefined,
        membershipType: membership.membershipType,
        interests: membership.interests,
        createdAt: membership.createdAt,
      }).catch(err => console.error("Failed to send membership email:", err));
      
      res.status(201).json(membership);
    } catch (error) {
      console.error("Error creating membership application:", error);
      res.status(500).json({ error: "Failed to submit membership application" });
    }
  });

  app.get("/api/membership", async (req, res) => {
    try {
      const applications = await storage.getMembershipApplications();
      res.json(applications);
    } catch (error) {
      console.error("Error fetching membership applications:", error);
      res.status(500).json({ error: "Failed to fetch membership applications" });
    }
  });

  app.patch("/api/membership/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status || !["pending", "approved", "rejected"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      
      const updated = await storage.updateMembershipStatus(id, status);
      
      if (!updated) {
        return res.status(404).json({ error: "Membership application not found" });
      }
      
      res.json(updated);
    } catch (error) {
      console.error("Error updating membership status:", error);
      res.status(500).json({ error: "Failed to update membership status" });
    }
  });

  app.post("/api/bootcamp", async (req, res) => {
    try {
      const result = insertBootcampSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ 
          error: "Validation failed", 
          details: validationError.message 
        });
      }
      
      const bootcamp = await storage.createBootcampRegistration(result.data);
      
      // Send email notification to admin
      sendBootcampRegistrationEmail({
        fullName: bootcamp.fullName,
        email: bootcamp.email,
        phone: bootcamp.phone,
        age: bootcamp.age,
        organization: bootcamp.organization,
        paymentProof: bootcamp.paymentProof,
        district: bootcamp.district,
        experience: bootcamp.experience,
        expectations: bootcamp.expectations,
        createdAt: bootcamp.createdAt,
      }).catch(err => console.error("Failed to send bootcamp email:", err));
      
      res.status(201).json(bootcamp);
    } catch (error) {
      console.error("Error creating bootcamp registration:", error);
      res.status(500).json({ error: "Failed to submit bootcamp registration" });
    }
  });

  app.get("/api/bootcamp", async (req, res) => {
    try {
      const registrations = await storage.getBootcampRegistrations();
      res.json(registrations);
    } catch (error) {
      console.error("Error fetching bootcamp registrations:", error);
      res.status(500).json({ error: "Failed to fetch bootcamp registrations" });
    }
  });

  app.get("/api/bootcamp/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const registration = await storage.getBootcampById(id);
      
      if (!registration) {
        return res.status(404).json({ error: "Registration not found" });
      }
      
      res.json(registration);
    } catch (error) {
      console.error("Error fetching bootcamp registration:", error);
      res.status(500).json({ error: "Failed to fetch bootcamp registration" });
    }
  });

  // Programs API routes (public)
  app.get("/api/programs", async (req, res) => {
    try {
      const allPrograms = await storage.getActivePrograms();
      res.json(allPrograms);
    } catch (error) {
      console.error("Error fetching programs:", error);
      res.status(500).json({ error: "Failed to fetch programs" });
    }
  });

  // Admin Programs API routes
  app.get("/api/admin/programs", requireAdmin, async (req, res) => {
    try {
      const allPrograms = await storage.getPrograms();
      res.json(allPrograms);
    } catch (error) {
      console.error("Error fetching programs:", error);
      res.status(500).json({ error: "Failed to fetch programs" });
    }
  });

  app.post("/api/admin/programs", requireAdmin, async (req, res) => {
    try {
      const result = insertProgramSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ 
          error: "Validation failed", 
          details: validationError.message 
        });
      }
      
      const program = await storage.createProgram(result.data);
      res.status(201).json(program);
    } catch (error) {
      console.error("Error creating program:", error);
      res.status(500).json({ error: "Failed to create program" });
    }
  });

  app.patch("/api/admin/programs/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const result = updateProgramSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ 
          error: "Validation failed", 
          details: validationError.message 
        });
      }
      
      const updated = await storage.updateProgram(id, result.data);
      
      if (!updated) {
        return res.status(404).json({ error: "Program not found" });
      }
      
      res.json(updated);
    } catch (error) {
      console.error("Error updating program:", error);
      res.status(500).json({ error: "Failed to update program" });
    }
  });

  app.delete("/api/admin/programs/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteProgram(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Program not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting program:", error);
      res.status(500).json({ error: "Failed to delete program" });
    }
  });

  // Get single program by ID (public)
  app.get("/api/programs/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const program = await storage.getProgramById(id);
      
      if (!program) {
        return res.status(404).json({ error: "Program not found" });
      }
      
      res.json(program);
    } catch (error) {
      console.error("Error fetching program:", error);
      res.status(500).json({ error: "Failed to fetch program" });
    }
  });

  // Partners API routes (public)
  app.get("/api/partners", async (req, res) => {
    try {
      const allPartners = await storage.getActivePartners();
      res.json(allPartners);
    } catch (error) {
      console.error("Error fetching partners:", error);
      res.status(500).json({ error: "Failed to fetch partners" });
    }
  });

  // Admin Partners API routes
  app.get("/api/admin/partners", requireAdmin, async (req, res) => {
    try {
      const allPartners = await storage.getPartners();
      res.json(allPartners);
    } catch (error) {
      console.error("Error fetching partners:", error);
      res.status(500).json({ error: "Failed to fetch partners" });
    }
  });

  app.post("/api/admin/partners", requireAdmin, async (req, res) => {
    try {
      const result = insertPartnerSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ 
          error: "Validation failed", 
          details: validationError.message 
        });
      }
      
      const partner = await storage.createPartner(result.data);
      res.status(201).json(partner);
    } catch (error) {
      console.error("Error creating partner:", error);
      res.status(500).json({ error: "Failed to create partner" });
    }
  });

  app.patch("/api/admin/partners/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const result = updatePartnerSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ 
          error: "Validation failed", 
          details: validationError.message 
        });
      }
      
      const updated = await storage.updatePartner(id, result.data);
      
      if (!updated) {
        return res.status(404).json({ error: "Partner not found" });
      }
      
      res.json(updated);
    } catch (error) {
      console.error("Error updating partner:", error);
      res.status(500).json({ error: "Failed to update partner" });
    }
  });

  app.delete("/api/admin/partners/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deletePartner(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Partner not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting partner:", error);
      res.status(500).json({ error: "Failed to delete partner" });
    }
  });

  // Popup Settings API routes (public - for the frontend to fetch)
  app.get("/api/popup-settings", async (req, res) => {
    try {
      const settings = await storage.getPopupSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error fetching popup settings:", error);
      res.status(500).json({ error: "Failed to fetch popup settings" });
    }
  });

  // Admin Popup Settings API routes
  app.get("/api/admin/popup-settings", requireAdmin, async (req, res) => {
    try {
      const settings = await storage.getPopupSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error fetching popup settings:", error);
      res.status(500).json({ error: "Failed to fetch popup settings" });
    }
  });

  app.patch("/api/admin/popup-settings", requireAdmin, async (req, res) => {
    try {
      const result = updatePopupSettingsSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ 
          error: "Validation failed", 
          details: validationError.message 
        });
      }
      
      const updated = await storage.updatePopupSettings(result.data);
      res.json(updated);
    } catch (error) {
      console.error("Error updating popup settings:", error);
      res.status(500).json({ error: "Failed to update popup settings" });
    }
  });

  return httpServer;
}
