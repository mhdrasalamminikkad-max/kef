import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertMembershipSchema, insertBootcampSchema, adminLoginSchema, insertProgramSchema, updateProgramSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

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

  return httpServer;
}
