import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const adminUsers = pgTable("admin_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAdminSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
}).extend({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const adminLoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type Admin = typeof adminUsers.$inferSelect;
export type AdminLogin = z.infer<typeof adminLoginSchema>;

export const contactSubmissions = pgTable("contact_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const membershipApplications = pgTable("membership_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  organization: text("organization"),
  designation: text("designation"),
  membershipType: text("membership_type").notNull(),
  interests: text("interests").notNull(),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  status: text("status").default("pending").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertContactSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  createdAt: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const insertMembershipSchema = createInsertSchema(membershipApplications).omit({
  id: true,
  createdAt: true,
  status: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  membershipType: z.enum(["individual", "student", "corporate", "institutional"]),
  interests: z.string().min(3, "Please select or describe your interests"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contactSubmissions.$inferSelect;

export type InsertMembership = z.infer<typeof insertMembershipSchema>;
export type Membership = typeof membershipApplications.$inferSelect;

// Startup Boot Camp Registration
export const bootcampRegistrations = pgTable("bootcamp_registrations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  age: text("age").notNull(),
  organization: text("organization").notNull(),
  paymentProof: text("payment_proof").notNull(),
  district: text("district").notNull(),
  experience: text("experience").notNull(),
  expectations: text("expectations"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  status: text("status").default("approved").notNull(),
});

export const insertBootcampSchema = createInsertSchema(bootcampRegistrations).omit({
  id: true,
  createdAt: true,
  status: true,
  district: true,
  experience: true,
  expectations: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  age: z.string().min(1, "Please enter your age"),
  organization: z.string().min(2, "Institution name is required"),
  paymentProof: z.string().min(1, "Payment proof is required"),
});

export type InsertBootcamp = z.infer<typeof insertBootcampSchema>;
export type Bootcamp = typeof bootcampRegistrations.$inferSelect;

// Programs management
export const programs = pgTable("programs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  features: text("features").array(),
  gradient: text("gradient").default("purple").notNull(),
  bannerImage: text("banner_image"),
  isActive: boolean("is_active").default(true).notNull(),
  order: text("order").default("0").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertProgramSchema = createInsertSchema(programs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  icon: z.string().min(1, "Icon is required"),
  features: z.array(z.string()).optional(),
  gradient: z.enum(["purple", "blue", "teal", "orange"]).default("purple"),
  bannerImage: z.string().optional(),
  isActive: z.boolean().default(true),
  order: z.string().default("0"),
});

export const updateProgramSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").optional(),
  description: z.string().min(10, "Description must be at least 10 characters").optional(),
  icon: z.string().min(1, "Icon is required").optional(),
  features: z.array(z.string()).optional(),
  gradient: z.enum(["purple", "blue", "teal", "orange"]).optional(),
  bannerImage: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  order: z.string().optional(),
});

export type InsertProgram = z.infer<typeof insertProgramSchema>;
export type UpdateProgram = z.infer<typeof updateProgramSchema>;
export type Program = typeof programs.$inferSelect;

// Partners management
export const partners = pgTable("partners", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  logo: text("logo").notNull(),
  description: text("description"),
  website: text("website"),
  category: text("category").default("partner").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  order: text("order").default("0").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPartnerSchema = createInsertSchema(partners).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  name: z.string().min(2, "Partner name must be at least 2 characters"),
  logo: z.string().min(1, "Logo image is required"),
  description: z.string().optional(),
  website: z.string().url("Please enter a valid website URL").optional().or(z.literal("")),
  category: z.string().default("partner"),
  isActive: z.boolean().default(true),
  order: z.string().default("0"),
});

export const updatePartnerSchema = z.object({
  name: z.string().min(2, "Partner name must be at least 2 characters").optional(),
  logo: z.string().min(1, "Logo image is required").optional(),
  description: z.string().optional(),
  website: z.string().url("Please enter a valid website URL").optional().or(z.literal("")),
  category: z.string().optional(),
  isActive: z.boolean().optional(),
  order: z.string().optional(),
});

export type InsertPartner = z.infer<typeof insertPartnerSchema>;
export type UpdatePartner = z.infer<typeof updatePartnerSchema>;
export type Partner = typeof partners.$inferSelect;

// Popup Banner Settings
export const popupSettings = pgTable("popup_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  isEnabled: boolean("is_enabled").default(true).notNull(),
  title: text("title").default("Startup Boot Camp").notNull(),
  bannerImage: text("banner_image").notNull(),
  buttonText: text("button_text").default("Register Now").notNull(),
  buttonLink: text("button_link").default("/register").notNull(),
  delaySeconds: text("delay_seconds").default("1").notNull(),
  showOnce: boolean("show_once").default(false).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const updatePopupSettingsSchema = z.object({
  isEnabled: z.boolean().optional(),
  title: z.string().min(1, "Title is required").optional(),
  bannerImage: z.string().min(1, "Banner image URL is required").optional(),
  buttonText: z.string().min(1, "Button text is required").optional(),
  buttonLink: z.string().min(1, "Button link is required").optional(),
  delaySeconds: z.string().optional(),
  showOnce: z.boolean().optional(),
});

export type UpdatePopupSettings = z.infer<typeof updatePopupSettingsSchema>;
export type PopupSettings = typeof popupSettings.$inferSelect;
