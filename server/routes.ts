import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertMembershipSchema, insertBootcampSchema, adminLoginSchema, insertProgramSchema, updateProgramSchema, insertPartnerSchema, updatePartnerSchema, updatePopupSettingsSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { sendBootcampRegistrationEmail, sendMembershipApplicationEmail, sendContactFormEmail } from "./email";
import multer from "multer";
import path from "path";
import fs from "fs";
import PDFDocument from "pdfkit";
import axios from "axios";
import crypto from "crypto";

// PhonePe Configuration
const PHONEPE_UAT_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox";
const PHONEPE_PROD_URL = "https://api.phonepe.com/apis/hermes";

function getPhonePeConfig() {
  const merchantId = process.env.PHONEPE_MERCHANT_ID;
  const saltKey = process.env.PHONEPE_SALT_KEY;
  const saltIndex = process.env.PHONEPE_SALT_INDEX || "1";
  const isProduction = process.env.PHONEPE_PRODUCTION === "true";
  
  if (!merchantId || !saltKey) {
    return null;
  }
  
  return {
    merchantId,
    saltKey,
    saltIndex,
    baseUrl: isProduction ? PHONEPE_PROD_URL : PHONEPE_UAT_URL,
  };
}

function generatePhonePeChecksum(payload: string, endpoint: string, saltKey: string, saltIndex: string): string {
  const stringToHash = payload + endpoint + saltKey;
  const sha256 = crypto.createHash("sha256").update(stringToHash).digest("hex");
  return `${sha256}###${saltIndex}`;
}

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
    // Removed SVG to prevent XSS attacks - only allow raster images
    const allowedExtensions = /jpeg|jpg|png|gif|webp/;
    const allowedMimes = /image\/(jpeg|jpg|png|gif|webp)/;
    const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedMimes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed (JPG, PNG, GIF, WebP)!"));
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
  
  // Health check endpoint to verify database connection
  app.get("/api/health", async (_req, res) => {
    try {
      // Try to get dashboard stats to verify database connection
      const stats = await storage.getDashboardStats();
      res.json({ 
        status: "healthy", 
        database: "connected",
        stats: {
          bootcampRegistrations: stats.totalBootcampRegistrations,
          membershipApplications: stats.totalMembershipApplications,
          contactSubmissions: stats.totalContactSubmissions
        }
      });
    } catch (error: any) {
      console.error("Health check failed:", error);
      res.status(503).json({ 
        status: "unhealthy", 
        database: "disconnected",
        error: error?.message || "Database connection failed"
      });
    }
  });

  // PhonePe: Initiate Payment
  app.post("/api/phonepe/initiate-payment", async (req, res) => {
    try {
      const { amount, name, email, phone, redirectUrl } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({ 
          success: false, 
          error: "Valid amount is required" 
        });
      }

      const config = getPhonePeConfig();
      if (!config) {
        return res.status(500).json({ 
          success: false, 
          error: "PhonePe is not configured. Please contact support." 
        });
      }

      const merchantTransactionId = `T${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
      const merchantUserId = phone ? `MUID_${phone}` : `MUID_${Date.now()}`;
      
      // Get the base URL from environment or construct from request
      const baseUrl = process.env.REPLIT_DEV_DOMAIN 
        ? `https://${process.env.REPLIT_DEV_DOMAIN}` 
        : `${req.protocol}://${req.get('host')}`;
      
      const callbackUrl = `${baseUrl}/api/phonepe/callback/${merchantTransactionId}`;
      
      const payload = {
        merchantId: config.merchantId,
        merchantTransactionId: merchantTransactionId,
        merchantUserId: merchantUserId,
        amount: Math.round(amount * 100), // Convert to paise
        redirectUrl: redirectUrl || `${baseUrl}/payment-status/${merchantTransactionId}`,
        redirectMode: "POST",
        callbackUrl: callbackUrl,
        mobileNumber: phone || "",
        paymentInstrument: {
          type: "PAY_PAGE"
        }
      };

      const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString("base64");
      const checksum = generatePhonePeChecksum(payloadBase64, "/pg/v1/pay", config.saltKey, config.saltIndex);

      const response = await axios.post(
        `${config.baseUrl}/pg/v1/pay`,
        { request: payloadBase64 },
        {
          headers: {
            "Content-Type": "application/json",
            "X-VERIFY": checksum,
          },
        }
      );

      if (response.data.success && response.data.data?.instrumentResponse?.redirectInfo?.url) {
        res.json({
          success: true,
          paymentUrl: response.data.data.instrumentResponse.redirectInfo.url,
          merchantTransactionId: merchantTransactionId,
        });
      } else {
        console.error("PhonePe initiation failed:", response.data);
        res.status(400).json({
          success: false,
          error: response.data.message || "Failed to initiate payment",
        });
      }
    } catch (error: any) {
      console.error("PhonePe payment initiation error:", error.response?.data || error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to initiate payment" 
      });
    }
  });

  // PhonePe: Callback handler (POST from PhonePe after payment)
  app.post("/api/phonepe/callback/:merchantTransactionId", async (req, res) => {
    try {
      const { merchantTransactionId } = req.params;
      
      const config = getPhonePeConfig();
      if (!config) {
        return res.redirect(`/payment-status/${merchantTransactionId}?status=error&message=Configuration+error`);
      }

      // Check payment status
      const statusEndpoint = `/pg/v1/status/${config.merchantId}/${merchantTransactionId}`;
      const stringToHash = statusEndpoint + config.saltKey;
      const sha256 = crypto.createHash("sha256").update(stringToHash).digest("hex");
      const checksum = `${sha256}###${config.saltIndex}`;

      const statusUrl = `${config.baseUrl}${statusEndpoint}`;

      const response = await axios.get(statusUrl, {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
          "X-MERCHANT-ID": config.merchantId,
        },
      });

      if (response.data.code === "PAYMENT_SUCCESS") {
        res.redirect(`/payment-status/${merchantTransactionId}?status=success`);
      } else {
        res.redirect(`/payment-status/${merchantTransactionId}?status=failed&code=${response.data.code}`);
      }
    } catch (error: any) {
      console.error("PhonePe callback error:", error.response?.data || error);
      const { merchantTransactionId } = req.params;
      res.redirect(`/payment-status/${merchantTransactionId}?status=error`);
    }
  });

  // PhonePe: Check Payment Status
  app.get("/api/phonepe/status/:merchantTransactionId", async (req, res) => {
    try {
      const { merchantTransactionId } = req.params;

      const config = getPhonePeConfig();
      if (!config) {
        return res.status(500).json({ 
          success: false, 
          error: "PhonePe is not configured" 
        });
      }

      const statusEndpoint = `/pg/v1/status/${config.merchantId}/${merchantTransactionId}`;
      const stringToHash = statusEndpoint + config.saltKey;
      const sha256 = crypto.createHash("sha256").update(stringToHash).digest("hex");
      const checksum = `${sha256}###${config.saltIndex}`;

      const statusUrl = `${config.baseUrl}${statusEndpoint}`;

      const response = await axios.get(statusUrl, {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
          "X-MERCHANT-ID": config.merchantId,
        },
      });

      const isSuccess = response.data.code === "PAYMENT_SUCCESS";
      
      res.json({
        success: isSuccess,
        code: response.data.code,
        message: response.data.message,
        transactionId: merchantTransactionId,
        data: response.data.data,
      });
    } catch (error: any) {
      console.error("PhonePe status check error:", error.response?.data || error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to check payment status" 
      });
    }
  });

  // PhonePe: Get configuration status
  app.get("/api/phonepe/config", (_req, res) => {
    const config = getPhonePeConfig();
    res.json({
      configured: !!config,
    });
  });

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

  // PDF Export for Bootcamp Registrations
  app.get("/api/admin/bootcamp/export-pdf", requireAdmin, async (req, res) => {
    try {
      const registrations = await storage.getBootcampRegistrations();
      
      const doc = new PDFDocument({ 
        margin: 40,
        size: 'A4',
        bufferPages: true
      });
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="bootcamp-registrations.pdf"');
      
      doc.pipe(res);
      
      // Header
      doc.fontSize(24).font('Helvetica-Bold').fillColor('#1a365d')
         .text('STARTUP BOOT CAMP', { align: 'center' });
      doc.fontSize(14).font('Helvetica').fillColor('#4a5568')
         .text('Registration Details Report', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(10).fillColor('#718096')
         .text(`Generated on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`, { align: 'center' });
      doc.fontSize(10)
         .text(`Total Registrations: ${registrations.length}`, { align: 'center' });
      doc.moveDown(1);
      
      // Horizontal line
      doc.strokeColor('#e2e8f0').lineWidth(1)
         .moveTo(40, doc.y).lineTo(555, doc.y).stroke();
      doc.moveDown(1);
      
      if (registrations.length === 0) {
        doc.fontSize(14).fillColor('#a0aec0')
           .text('No registrations found.', { align: 'center' });
      } else {
        registrations.forEach((reg, index) => {
          // Check if we need a new page (leave room for content)
          if (doc.y > 650) {
            doc.addPage();
          }
          
          // Registration number header
          doc.fontSize(14).font('Helvetica-Bold').fillColor('#2d3748')
             .text(`Registration #${index + 1}`, { underline: true });
          doc.moveDown(0.3);
          
          // Status badge
          const statusColor = reg.status === 'approved' ? '#38a169' : 
                             reg.status === 'rejected' ? '#e53e3e' : '#dd6b20';
          doc.fontSize(10).font('Helvetica-Bold').fillColor(statusColor)
             .text(`Status: ${reg.status?.toUpperCase() || 'PENDING'}`);
          doc.moveDown(0.5);
          
          // Helper function for field display
          const addField = (label: string, value: string | null | undefined) => {
            if (doc.y > 750) {
              doc.addPage();
            }
            doc.fontSize(10).font('Helvetica-Bold').fillColor('#4a5568')
               .text(`${label}: `, { continued: true });
            doc.font('Helvetica').fillColor('#1a202c')
               .text(value || 'N/A');
          };
          
          // Personal Details Section
          doc.fontSize(11).font('Helvetica-Bold').fillColor('#2b6cb0')
             .text('Personal Details');
          doc.moveDown(0.3);
          
          addField('Full Name', reg.fullName);
          addField('Email', reg.email);
          addField('Phone', reg.phone);
          addField('Age', reg.age);
          addField('District', reg.district);
          addField('Place', reg.place);
          addField('Address', reg.address);
          doc.moveDown(0.5);
          
          // Organization Details
          doc.fontSize(11).font('Helvetica-Bold').fillColor('#2b6cb0')
             .text('Organization Details');
          doc.moveDown(0.3);
          
          addField('Organization/Institution', reg.organization);
          doc.moveDown(0.5);
          
          // Experience & Expectations
          doc.fontSize(11).font('Helvetica-Bold').fillColor('#2b6cb0')
             .text('Experience & Expectations');
          doc.moveDown(0.3);
          
          doc.fontSize(10).font('Helvetica-Bold').fillColor('#4a5568')
             .text('Prior Experience:');
          doc.font('Helvetica').fillColor('#1a202c')
             .text(reg.experience || 'N/A', { width: 500 });
          doc.moveDown(0.3);
          
          doc.fontSize(10).font('Helvetica-Bold').fillColor('#4a5568')
             .text('Expectations:');
          doc.font('Helvetica').fillColor('#1a202c')
             .text(reg.expectations || 'N/A', { width: 500 });
          doc.moveDown(0.5);
          
          // Registration Date
          doc.fontSize(10).font('Helvetica-Bold').fillColor('#4a5568')
             .text('Registered On: ', { continued: true });
          doc.font('Helvetica').fillColor('#1a202c')
             .text(reg.createdAt ? new Date(reg.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'N/A');
          
          // Separator between registrations
          if (index < registrations.length - 1) {
            doc.moveDown(0.8);
            doc.strokeColor('#cbd5e0').lineWidth(0.5)
               .moveTo(40, doc.y).lineTo(555, doc.y).stroke();
            doc.moveDown(0.8);
          }
        });
      }
      
      // Footer on each page
      const pages = doc.bufferedPageRange();
      for (let i = 0; i < pages.count; i++) {
        doc.switchToPage(i);
        doc.fontSize(8).fillColor('#a0aec0')
           .text(
             `Page ${i + 1} of ${pages.count} | Kerala Economic Forum - Startup Boot Camp`,
             40, 780,
             { align: 'center', width: 515 }
           );
      }
      
      doc.end();
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).json({ error: "Failed to generate PDF" });
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
      
      // Send email notification to admin (non-blocking)
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
      
      // Return only essential fields for fast response (no large base64 blobs)
      res.status(201).json({
        id: bootcamp.id,
        fullName: bootcamp.fullName,
        email: bootcamp.email,
        phone: bootcamp.phone,
        status: bootcamp.status,
        createdAt: bootcamp.createdAt,
      });
    } catch (error: any) {
      console.error("Error creating bootcamp registration:", error);
      const errorMessage = error?.message || "Unknown database error";
      const errorCode = error?.code || "UNKNOWN";
      res.status(500).json({ 
        error: "Failed to submit bootcamp registration",
        details: process.env.NODE_ENV === 'development' ? errorMessage : "Database connection issue. Please try again.",
        code: errorCode
      });
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

  // Slim invitation endpoint - returns only essential fields (no large base64 blobs)
  // This is much faster for the invitation page
  app.get("/api/invitation/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const registration = await storage.getBootcampById(id);
      
      if (!registration) {
        return res.status(404).json({ error: "Registration not found" });
      }
      
      // Return only the fields needed for the invitation page
      // Excludes photo and paymentProof (large base64 strings)
      res.json({
        id: registration.id,
        fullName: registration.fullName,
        email: registration.email,
        phone: registration.phone,
        status: registration.status,
        createdAt: registration.createdAt,
      });
    } catch (error) {
      console.error("Error fetching invitation:", error);
      res.status(500).json({ error: "Failed to fetch invitation" });
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
