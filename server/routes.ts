import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertMembershipSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
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

  return httpServer;
}
