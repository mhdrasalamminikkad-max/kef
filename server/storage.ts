import {
  type User,
  type InsertUser,
  type Contact,
  type InsertContact,
  type Membership,
  type InsertMembership,
  type Bootcamp,
  type InsertBootcamp,
  type Admin,
  type InsertAdmin,
  type Program,
  type InsertProgram,
  type UpdateProgram,
  type Partner,
  type InsertPartner,
  type UpdatePartner,
  type PopupSettings,
  type UpdatePopupSettings,
  type ProgramRegistration,
  type InsertProgramRegistration,
  users,
  contactSubmissions,
  membershipApplications,
  bootcampRegistrations,
  adminUsers,
  programs,
  partners,
  popupSettings,
  programRegistrations
} from "@shared/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  createContactSubmission(contact: InsertContact): Promise<Contact>;
  getContactSubmissions(): Promise<Contact[]>;
  getContactById(id: string): Promise<Contact | undefined>;
  deleteContact(id: string): Promise<boolean>;

  createMembershipApplication(membership: InsertMembership): Promise<Membership>;
  getMembershipApplications(): Promise<Membership[]>;
  getMembershipById(id: string): Promise<Membership | undefined>;
  updateMembershipStatus(id: string, status: string): Promise<Membership | undefined>;
  deleteMembership(id: string): Promise<boolean>;

  createBootcampRegistration(bootcamp: InsertBootcamp): Promise<Bootcamp>;
  getBootcampRegistrations(): Promise<Bootcamp[]>;
  getBootcampById(id: string): Promise<Bootcamp | undefined>;
  updateBootcampStatus(id: string, status: string): Promise<Bootcamp | undefined>;
  deleteBootcamp(id: string): Promise<boolean>;

  getAdminByUsername(username: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
  getAdmins(): Promise<Admin[]>;
  verifyAdminPassword(username: string, password: string): Promise<Admin | null>;

  getDashboardStats(): Promise<{
    totalBootcampRegistrations: number;
    totalMembershipApplications: number;
    totalContactSubmissions: number;
    pendingBootcamp: number;
    pendingMembership: number;
  }>;

  getPrograms(): Promise<Program[]>;
  getActivePrograms(): Promise<Program[]>;
  getProgramById(id: string): Promise<Program | undefined>;
  createProgram(program: InsertProgram): Promise<Program>;
  updateProgram(id: string, program: UpdateProgram): Promise<Program | undefined>;
  deleteProgram(id: string): Promise<boolean>;

  getPartners(): Promise<Partner[]>;
  getActivePartners(): Promise<Partner[]>;
  getPartnerById(id: string): Promise<Partner | undefined>;
  createPartner(partner: InsertPartner): Promise<Partner>;
  updatePartner(id: string, partner: UpdatePartner): Promise<Partner | undefined>;
  deletePartner(id: string): Promise<boolean>;

  getPopupSettings(): Promise<PopupSettings | null>;
  updatePopupSettings(settings: UpdatePopupSettings): Promise<PopupSettings>;

  getProgramRegistrations(programId: string): Promise<ProgramRegistration[]>;
  createProgramRegistration(registration: InsertProgramRegistration): Promise<ProgramRegistration>;
  deleteProgramRegistration(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private contacts: Map<string, Contact>;
  private memberships: Map<string, Membership>;
  private bootcamps: Map<string, Bootcamp>;
  private admins: Map<string, Admin>;
  private programsMap: Map<string, Program>;
  private partnersMap: Map<string, Partner>;
  private popupSettingsData: PopupSettings | null = null;
  private programRegistrationsMap: Map<string, ProgramRegistration>;

  constructor() {
    this.users = new Map();
    this.contacts = new Map();
    this.memberships = new Map();
    this.bootcamps = new Map();
    this.admins = new Map();
    this.programsMap = new Map();
    this.partnersMap = new Map();
    this.programRegistrationsMap = new Map();

    this.initDefaultAdmin();
    this.initDefaultPrograms();
    this.initDefaultPopupSettings();
  }

  private async initDefaultAdmin() {
    const finalUsername = "user";
    const finalPassword = "caliph786786";

    const existingAdmin = await this.getAdminByUsername(finalUsername);
    if (existingAdmin) {
      this.admins.delete(existingAdmin.id);
    }

    await this.createAdmin({
      username: finalUsername,
      password: finalPassword
    });
  }

  private async initDefaultPrograms() {
    const defaultPrograms = [
      { title: "Startup Boot Camp", description: "Residential camps with workshops, business model creation, and pitching sessions.", icon: "Rocket", gradient: "orange" as const, programStatus: "live" as const },
      { title: "Business Conclaves", description: "Large-scale gatherings connecting founders, investors, and thought leaders.", icon: "Building2", gradient: "blue" as const, programStatus: "upcoming" as const },
      { title: "Founder Circle", description: "Exclusive networking dinners for honest entrepreneur conversations.", icon: "Users", gradient: "purple" as const, programStatus: "upcoming" as const },
      { title: "Advisory Clinics", description: "One-on-one mentoring in finance, branding, legal, and marketing.", icon: "Briefcase", gradient: "teal" as const, programStatus: "upcoming" as const },
      { title: "Campus Labs", description: "Innovation cells and student incubators in colleges across Kerala.", icon: "GraduationCap", gradient: "blue" as const, programStatus: "upcoming" as const },
    ];

    for (let i = 0; i < defaultPrograms.length; i++) {
      // Always initialize in-memory programs first
      await this.createProgramInMemory({
        ...defaultPrograms[i],
        order: String(i),
        isActive: true,
      });
    }
  }

  private async initDefaultPopupSettings() {
    this.popupSettingsData = {
      id: randomUUID(),
      isEnabled: false,
      title: "KEF Leadership Lab – Talk Series | Episode 1.1 - Understanding GenZ At Work",
      bannerImage: "/uploads/kef-leadership-lab-banner.jpg",
      buttonText: "BOOK YOUR SPOT NOW!",
      buttonLink: "https://keralaeconomicforum.com/programs/33f0ed49-6f1a-41be-bd7d-a45e89125a6c/register",
      delaySeconds: "2",
      showOnce: false,
      updatedAt: new Date(),
    };
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createContactSubmission(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = {
      ...insertContact,
      id,
      phone: insertContact.phone ?? null,
      createdAt: new Date(),
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async getContactSubmissions(): Promise<Contact[]> {
    return Array.from(this.contacts.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getContactById(id: string): Promise<Contact | undefined> {
    return this.contacts.get(id);
  }

  async deleteContact(id: string): Promise<boolean> {
    return this.contacts.delete(id);
  }

  async createMembershipApplication(insertMembership: InsertMembership): Promise<Membership> {
    const id = randomUUID();
    const membership: Membership = {
      ...insertMembership,
      id,
      organization: insertMembership.organization ?? null,
      designation: insertMembership.designation ?? null,
      message: insertMembership.message ?? null,
      paymentAmount: insertMembership.paymentAmount ?? null,
      paymentScreenshot: insertMembership.paymentScreenshot ?? null,
      createdAt: new Date(),
      status: "pending",
    };
    this.memberships.set(id, membership);
    return membership;
  }

  async getMembershipApplications(): Promise<Membership[]> {
    return Array.from(this.memberships.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getMembershipById(id: string): Promise<Membership | undefined> {
    return this.memberships.get(id);
  }

  async updateMembershipStatus(id: string, status: string): Promise<Membership | undefined> {
    const membership = this.memberships.get(id);
    if (membership) {
      membership.status = status;
      this.memberships.set(id, membership);
      return membership;
    }
    return undefined;
  }

  async deleteMembership(id: string): Promise<boolean> {
    return this.memberships.delete(id);
  }

  async createBootcampRegistration(insertBootcamp: InsertBootcamp): Promise<Bootcamp> {
    const id = randomUUID();
    const bootcamp: Bootcamp = {
      id,
      fullName: insertBootcamp.fullName,
      email: insertBootcamp.email,
      phone: insertBootcamp.phone,
      age: insertBootcamp.age,
      organization: insertBootcamp.organization,
      paymentProof: insertBootcamp.paymentProof,
      district: "",
      place: null,
      address: null,
      photo: null,
      experience: "",
      expectations: null,
      createdAt: new Date(),
      status: "approved",
    };
    this.bootcamps.set(id, bootcamp);
    return bootcamp;
  }

  async getBootcampRegistrations(): Promise<Bootcamp[]> {
    return Array.from(this.bootcamps.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getBootcampById(id: string): Promise<Bootcamp | undefined> {
    return this.bootcamps.get(id);
  }

  async updateBootcampStatus(id: string, status: string): Promise<Bootcamp | undefined> {
    const bootcamp = this.bootcamps.get(id);
    if (bootcamp) {
      bootcamp.status = status;
      this.bootcamps.set(id, bootcamp);
      return bootcamp;
    }
    return undefined;
  }

  async deleteBootcamp(id: string): Promise<boolean> {
    return this.bootcamps.delete(id);
  }

  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    return Array.from(this.admins.values()).find(
      (admin) => admin.username === username
    );
  }

  async createAdmin(insertAdmin: InsertAdmin): Promise<Admin> {
    const id = randomUUID();
    const hashedPassword = await bcrypt.hash(insertAdmin.password, 10);
    const admin: Admin = {
      ...insertAdmin,
      id,
      password: hashedPassword,
      createdAt: new Date(),
    };
    this.admins.set(id, admin);
    return admin;
  }

  async getAdmins(): Promise<Admin[]> {
    return Array.from(this.admins.values());
  }

  async verifyAdminPassword(username: string, password: string): Promise<Admin | null> {
    const admin = await this.getAdminByUsername(username);
    if (!admin) {
      return null;
    }
    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return null;
    }
    return admin;
  }

  async getDashboardStats(): Promise<{
    totalBootcampRegistrations: number;
    totalMembershipApplications: number;
    totalContactSubmissions: number;
    pendingBootcamp: number;
    pendingMembership: number;
  }> {
    const bootcamps = await this.getBootcampRegistrations();
    const memberships = await this.getMembershipApplications();
    const contacts = await this.getContactSubmissions();

    return {
      totalBootcampRegistrations: bootcamps.length,
      totalMembershipApplications: memberships.length,
      totalContactSubmissions: contacts.length,
      pendingBootcamp: bootcamps.filter(b => b.status === "pending").length,
      pendingMembership: memberships.filter(m => m.status === "pending").length,
    };
  }

  async getPrograms(): Promise<Program[]> {
    return Array.from(this.programsMap.values()).sort(
      (a, b) => parseInt(a.order) - parseInt(b.order)
    );
  }

  async getActivePrograms(): Promise<Program[]> {
    return (await this.getPrograms()).filter(p => p.isActive);
  }

  async getProgramById(id: string): Promise<Program | undefined> {
    return this.programsMap.get(id);
  }

  async createProgramInMemory(insertProgram: InsertProgram): Promise<Program> {
    const id = randomUUID();
    const program: Program = {
      id,
      title: insertProgram.title,
      description: insertProgram.description,
      icon: insertProgram.icon,
      features: insertProgram.features ?? null,
      gradient: insertProgram.gradient ?? "purple",
      bannerImage: insertProgram.bannerImage ?? null,
      isActive: insertProgram.isActive ?? true,
      programStatus: insertProgram.programStatus ?? "upcoming",
      order: insertProgram.order ?? "0",
      eventDate: insertProgram.eventDate ?? null,
      venue: insertProgram.venue ?? null,
      feeLabel: insertProgram.feeLabel ?? null,
      feeAmount: insertProgram.feeAmount ?? null,
      earlyBirdOffer: insertProgram.earlyBirdOffer ?? null,
      registerUrl: insertProgram.registerUrl ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.programsMap.set(id, program);
    return program;
  }

  async updateProgramInMemory(id: string, updateData: UpdateProgram): Promise<Program | undefined> {
    const program = this.programsMap.get(id);
    if (!program) return undefined;

    const updated: Program = {
      ...program,
      ...updateData,
      updatedAt: new Date(),
    };
    this.programsMap.set(id, updated);
    return updated;
  }

  // Implement IStorage interface methods
  async createProgram(insertProgram: InsertProgram): Promise<Program> {
    return this.createProgramInMemory(insertProgram);
  }

  async updateProgram(id: string, updateData: UpdateProgram): Promise<Program | undefined> {
    return this.updateProgramInMemory(id, updateData);
  }

  async deleteProgram(id: string): Promise<boolean> {
    return this.programsMap.delete(id);
  }

  async getPartners(): Promise<Partner[]> {
    return Array.from(this.partnersMap.values()).sort(
      (a, b) => parseInt(a.order) - parseInt(b.order)
    );
  }

  async getActivePartners(): Promise<Partner[]> {
    return (await this.getPartners()).filter(p => p.isActive);
  }

  async getPartnerById(id: string): Promise<Partner | undefined> {
    return this.partnersMap.get(id);
  }

  async createPartner(insertPartner: InsertPartner): Promise<Partner> {
    const id = randomUUID();
    const partner: Partner = {
      id,
      name: insertPartner.name,
      logo: insertPartner.logo,
      description: insertPartner.description ?? null,
      website: insertPartner.website ?? null,
      category: insertPartner.category ?? "partner",
      isActive: insertPartner.isActive ?? true,
      order: insertPartner.order ?? "0",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.partnersMap.set(id, partner);
    return partner;
  }

  async updatePartner(id: string, updateData: UpdatePartner): Promise<Partner | undefined> {
    const partner = this.partnersMap.get(id);
    if (!partner) return undefined;

    const updated: Partner = {
      ...partner,
      ...updateData,
      updatedAt: new Date(),
    };
    this.partnersMap.set(id, updated);
    return updated;
  }

  async deletePartner(id: string): Promise<boolean> {
    return this.partnersMap.delete(id);
  }

  async getPopupSettings(): Promise<PopupSettings | null> {
    // Return in-memory cache for performance
    return this.popupSettingsData;
  }

  async updatePopupSettings(settings: UpdatePopupSettings): Promise<PopupSettings> {
    if (!this.popupSettingsData) {
      await this.initDefaultPopupSettings();
    }
    
    const updated: PopupSettings = {
      ...this.popupSettingsData!,
      ...settings,
      updatedAt: new Date(),
    };
    
    // Update in-memory cache
    this.popupSettingsData = updated;
    
    // Store the selected fields that matter (since we don't have a persistent DB for settings in this in-memory storage)
    // In production with a real DB, you would: await db.update(popupSettings).set(updated).where(...)
    console.log('Popup settings updated:', updated);
    
    return updated;
  }

  async getProgramRegistrations(programId: string): Promise<ProgramRegistration[]> {
    return Array.from(this.programRegistrationsMap.values()).filter(
      (reg) => reg.programId === programId
    );
  }

  async createProgramRegistration(registration: InsertProgramRegistration): Promise<ProgramRegistration> {
    const id = randomUUID();
    const newRegistration = {
      ...registration,
      id,
      expectations: registration.expectations ?? null,
      company: registration.company ?? null,
      createdAt: new Date(),
    } as ProgramRegistration;
    this.programRegistrationsMap.set(id, newRegistration);
    return newRegistration;
  }

  async deleteProgramRegistration(id: string): Promise<boolean> {
    return this.programRegistrationsMap.delete(id);
  }
}

export class DatabaseStorage implements IStorage {
  private programsMap: Map<string, Program>;
  private initialized = false;

  constructor() {
    this.programsMap = new Map();
    console.log("[STORAGE] Initializing DatabaseStorage with PostgreSQL backend");
  }

  async initialize() {
    if (this.initialized) return;
    console.log("[STORAGE] Starting DatabaseStorage initialization...");
    try {
      await this.initDefaultAdmin();
      console.log("[STORAGE] ✓ Admin initialization complete");
      await this.initDefaultPrograms();
      console.log("[STORAGE] ✓ Programs initialization complete");
      this.initialized = true;
      console.log("[STORAGE] ✓ DatabaseStorage fully initialized");
    } catch (error) {
      console.error("[STORAGE] ✗ Initialization error:", error);
      this.initialized = true; // Mark as initialized to prevent retry loop
    }
  }

  private async initDefaultAdmin() {
    const finalUsername = "user";
    const finalPassword = "caliph786786";

    const existingAdmin = await this.getAdminByUsername(finalUsername);
    if (!existingAdmin) {
      await this.createAdmin({
        username: finalUsername,
        password: finalPassword
      });
      console.log(`Admin user "${finalUsername}" created successfully.`);
    }
  }

  private async createProgramInMemory(insertProgram: InsertProgram): Promise<Program> {
    const id = randomUUID();
    const program: Program = {
      id,
      title: insertProgram.title,
      description: insertProgram.description,
      icon: insertProgram.icon,
      features: insertProgram.features ?? null,
      gradient: insertProgram.gradient ?? "purple",
      bannerImage: insertProgram.bannerImage ?? null,
      isActive: insertProgram.isActive ?? true,
      programStatus: insertProgram.programStatus ?? "upcoming",
      order: insertProgram.order ?? "0",
      eventDate: insertProgram.eventDate ?? null,
      venue: insertProgram.venue ?? null,
      feeLabel: insertProgram.feeLabel ?? null,
      feeAmount: insertProgram.feeAmount ?? null,
      earlyBirdOffer: insertProgram.earlyBirdOffer ?? null,
      registerUrl: insertProgram.registerUrl ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.programsMap.set(id, program);
    return program;
  }

  private async updateProgramInMemory(id: string, updateData: UpdateProgram): Promise<Program | undefined> {
    const program = this.programsMap.get(id);
    if (!program) return undefined;

    const updated: Program = {
      ...program,
      ...updateData,
      updatedAt: new Date(),
    };
    this.programsMap.set(id, updated);
    return updated;
  }

  async initDefaultPrograms() {
    try {
      const existing = await this.getPrograms();

      // Define default programs first
      const defaultPrograms = [
        {
          title: "Startup Boot Camp",
          description: "Both residential and Day camps where participants learn to think like entrepreneurs. The camp includes powerful workshops, business model creation, idea validation, field assignments, pitching sessions, and mentor interactions.",
          icon: "Rocket",
          gradient: "orange" as const,
          isActive: true,
          programStatus: "upcoming" as const,
          order: "0"
        },
        {
          title: "Business Conclaves",
          description: "Large-scale gatherings where founders, investors, mentors, thought leaders, and students connect and collaborate.",
          icon: "Building2",
          gradient: "blue" as const,
          isActive: true,
          programStatus: "upcoming" as const,
          order: "1"
        },
        {
          title: "Founder Circles",
          description: "Exclusive curated networking dinners and tea sessions bringing entrepreneurs and experts for honest conversations and opportunities.",
          icon: "Users",
          gradient: "purple" as const,
          isActive: true,
          programStatus: "upcoming" as const,
          order: "2"
        },
        {
          title: "Advisory Clinics",
          description: "One-on-one mentoring and business advisory sessions in finance, branding, HR, legal, marketing, and operations.",
          icon: "Briefcase",
          gradient: "teal" as const,
          isActive: true,
          programStatus: "upcoming" as const,
          order: "3"
        },
        {
          title: "Campus Innovation Labs",
          description: "Building entrepreneurship clubs, innovation cells, startup labs, and student incubators in colleges across Kerala.",
          icon: "Lightbulb",
          gradient: "blue" as const,
          isActive: true,
          programStatus: "upcoming" as const,
          order: "4"
        },
        {
          title: "KEF Student Entrepreneurs Forum",
          description: "Vibrant club of student entrepreneurs and entrepreneurship aspirants.",
          icon: "GraduationCap",
          gradient: "orange" as const,
          isActive: true,
          programStatus: "upcoming" as const,
          order: "5"
        },
        {
          title: "Head Talks 1.3",
          description: "Inspiring conversations with successful entrepreneurs and industry leaders sharing their journey, challenges, and insights.",
          icon: "Users",
          gradient: "purple" as const,
          isActive: true,
          programStatus: "live" as const,
          order: "6"
        },
        {
          title: "Head Talk 1.2",
          description: "Previous edition of Head Talks featuring inspiring entrepreneurial stories and insights.",
          icon: "Users",
          gradient: "purple" as const,
          isActive: true,
          programStatus: "past" as const,
          order: "7"
        },
        {
          title: "Head Talk 1.1",
          description: "The first edition of Head Talks series featuring entrepreneur conversations.",
          icon: "Users",
          gradient: "purple" as const,
          isActive: true,
          programStatus: "past" as const,
          order: "8"
        },
        {
          title: "Kerala Startup Fest",
          description: "Two-day festival with 1000+ entrepreneurs, investors, and workshops showcasing Kerala's vibrant startup ecosystem.",
          icon: "Rocket",
          gradient: "orange" as const,
          isActive: true,
          programStatus: "past" as const,
          order: "9"
        },
        {
          title: "📘 Understanding Gen Z at Work - KEF Leadership Lab",
          description: "Kerala Economic Forum, in association with Mendora, presents an insightful evening introductory session on understanding the mindset, expectations, and working style of Gen Z employees, and how leaders can effectively engage and manage them.\n\n🎙 Speaker: Raheemudheen PK, Clinical Psychologist, Department of Health Services, Government of Kerala\n\n👥 Who Should Attend: Founders, business owners, managers, HR professionals, and team leaders working with or leading Gen Z teams.\n\n💳 Registration Fees:\n• KEF Members: ₹299\n• Non-Members: ₹399\n(Special pricing applicable to registered KEF members only)\n\n📞 For registration: +91 9562444470\n🎟 Limited seats available – book your spot now!",
          icon: "Users",
          gradient: "blue" as const,
          isActive: true,
          programStatus: "live" as const,
          order: "10",
          eventDate: "2026-02-13",
          venue: "LPone, Thondayad, Calicut",
          feeLabel: "Registration Fees",
          feeAmount: "₹299 (Members) / ₹399 (Non-Members)"
        },
      ];

      if (existing.length === 0) {
        // If empty, create all
        for (const prog of defaultPrograms) {
          try {
            await this.createProgram(prog);
          } catch (err: any) {
            // Log error but continue - database may not have latest schema yet
            if (err?.code === '42703') {
              console.log(`Database insert failed, falling back to in-memory storage: ${err.message}`);
            } else {
              console.error(`Failed to create program "${prog.title}":`, err?.message);
            }
          }
        }
        console.log("Default programs initialization completed");
      } else {
        // Check for missing programs (like newly added defaults) and insert them
        for (const prog of defaultPrograms) {
          const found = existing.find(p => p.title === prog.title);
          if (!found) {
            console.log(`Program "${prog.title}" not found in database, inserting...`);
            try {
              await this.createProgram(prog);
            } catch (err: any) {
              // Log error but continue - database may not have latest schema yet
              if (err?.code === '42703') {
                console.log(`Database insert failed, falling back to in-memory storage: ${err.message}`);
              } else {
                console.error(`Failed to create program "${prog.title}":`, err?.message);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error seeding default programs:", error);
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async createContactSubmission(insertContact: InsertContact): Promise<Contact> {
    const result = await db.insert(contactSubmissions).values(insertContact).returning();
    return result[0];
  }

  async getContactSubmissions(): Promise<Contact[]> {
    return await db.select().from(contactSubmissions).orderBy(contactSubmissions.createdAt);
  }

  async getContactById(id: string): Promise<Contact | undefined> {
    const result = await db.select().from(contactSubmissions).where(eq(contactSubmissions.id, id));
    return result[0];
  }

  async deleteContact(id: string): Promise<boolean> {
    const result = await db.delete(contactSubmissions).where(eq(contactSubmissions.id, id)).returning();
    return result.length > 0;
  }

  async createMembershipApplication(insertMembership: InsertMembership): Promise<Membership> {
    const result = await db.insert(membershipApplications).values(insertMembership).returning();
    return result[0];
  }

  async getMembershipApplications(): Promise<Membership[]> {
    return await db.select().from(membershipApplications).orderBy(membershipApplications.createdAt);
  }

  async getMembershipById(id: string): Promise<Membership | undefined> {
    const result = await db.select().from(membershipApplications).where(eq(membershipApplications.id, id));
    return result[0];
  }

  async updateMembershipStatus(id: string, status: string): Promise<Membership | undefined> {
    const result = await db.update(membershipApplications)
      .set({ status })
      .where(eq(membershipApplications.id, id))
      .returning();
    return result[0];
  }

  async deleteMembership(id: string): Promise<boolean> {
    const result = await db.delete(membershipApplications).where(eq(membershipApplications.id, id)).returning();
    return result.length > 0;
  }

  async createBootcampRegistration(insertBootcamp: InsertBootcamp): Promise<Bootcamp> {
    const result = await db.insert(bootcampRegistrations).values({
      ...insertBootcamp,
      district: "",
      experience: "",
    }).returning();
    return result[0];
  }

  async getBootcampRegistrations(): Promise<Bootcamp[]> {
    return await db.select().from(bootcampRegistrations).orderBy(bootcampRegistrations.createdAt);
  }

  async getBootcampById(id: string): Promise<Bootcamp | undefined> {
    const result = await db.select().from(bootcampRegistrations).where(eq(bootcampRegistrations.id, id));
    return result[0];
  }

  async updateBootcampStatus(id: string, status: string): Promise<Bootcamp | undefined> {
    const result = await db.update(bootcampRegistrations)
      .set({ status })
      .where(eq(bootcampRegistrations.id, id))
      .returning();
    return result[0];
  }

  async deleteBootcamp(id: string): Promise<boolean> {
    const result = await db.delete(bootcampRegistrations).where(eq(bootcampRegistrations.id, id)).returning();
    return result.length > 0;
  }

  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    const result = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
    return result[0];
  }

  async createAdmin(insertAdmin: InsertAdmin): Promise<Admin> {
    const hashedPassword = await bcrypt.hash(insertAdmin.password, 10);
    const result = await db.insert(adminUsers).values({
      ...insertAdmin,
      password: hashedPassword
    }).returning();
    return result[0];
  }

  async getAdmins(): Promise<Admin[]> {
    return await db.select().from(adminUsers);
  }

  async verifyAdminPassword(username: string, password: string): Promise<Admin | null> {
    const admin = await this.getAdminByUsername(username);
    if (!admin) {
      return null;
    }
    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return null;
    }
    return admin;
  }

  async getDashboardStats(): Promise<{
    totalBootcampRegistrations: number;
    totalMembershipApplications: number;
    totalContactSubmissions: number;
    pendingBootcamp: number;
    pendingMembership: number;
  }> {
    const bootcamps = await this.getBootcampRegistrations();
    const memberships = await this.getMembershipApplications();
    const contacts = await this.getContactSubmissions();

    return {
      totalBootcampRegistrations: bootcamps.length,
      totalMembershipApplications: memberships.length,
      totalContactSubmissions: contacts.length,
      pendingBootcamp: bootcamps.filter(b => b.status === "pending").length,
      pendingMembership: memberships.filter(m => m.status === "pending").length,
    };
  }

  async getPrograms(): Promise<Program[]> {
    try {
      console.log("[DB READ] Querying all programs from DATABASE...");
      
      // Use Drizzle's proper query builder with explicit column selection
      // We exclude 'register_url' because it's missing in the current DB schema and causes crashes
      const result = await db.select({
        id: programs.id,
        title: programs.title,
        description: programs.description,
        icon: programs.icon,
        features: programs.features,
        gradient: programs.gradient,
        bannerImage: programs.bannerImage,
        isActive: programs.isActive,
        programStatus: programs.programStatus,
        order: programs.order,
        eventDate: programs.eventDate,
        venue: programs.venue,
        feeLabel: programs.feeLabel,
        feeAmount: programs.feeAmount,
        earlyBirdOffer: programs.earlyBirdOffer,
        // registerUrl: programs.registerUrl, // Excluded due to DB schema mismatch
        createdAt: programs.createdAt,
        updatedAt: programs.updatedAt,
      }).from(programs).orderBy(sql`CAST(${programs.order} AS INTEGER)`);

      console.log(`[DB READ] ✓ Found ${result.length} programs in DATABASE`);

      // Convert the result to Program type with defaults
      let programList: Program[] = result.map((row) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        icon: row.icon,
        features: row.features,
        gradient: row.gradient || 'purple',
        bannerImage: row.bannerImage,
        isActive: row.isActive ?? true,
        programStatus: row.programStatus || 'upcoming',
        order: row.order || '0',
        eventDate: row.eventDate,
        venue: row.venue,
        feeLabel: row.feeLabel,
        feeAmount: row.feeAmount,
        earlyBirdOffer: row.earlyBirdOffer,
        registerUrl: null, // Default to null since it's not in DB
        createdAt: row.createdAt ? new Date(row.createdAt) : new Date(),
        updatedAt: row.updatedAt ? new Date(row.updatedAt) : new Date(),
      }));

      // Merge with in-memory programs (programs created but not yet in DB)
      const memoryPrograms = Array.from(this.programsMap.values());
      const dbIds = new Set(programList.map(p => p.id));
      const unsyncedMemoryPrograms = memoryPrograms.filter(p => !dbIds.has(p.id));
      
      if (unsyncedMemoryPrograms.length > 0) {
        console.log(`[DB READ] ⚠️  Found ${unsyncedMemoryPrograms.length} programs IN MEMORY only (not yet in DB)`);
        programList = [...programList, ...unsyncedMemoryPrograms];
      }

      // Sort by order
      programList.sort((a, b) => parseInt(a.order) - parseInt(b.order));

      if (programList.length === 0) {
        console.warn("[DB READ] No programs found in database or memory");
        return [];
      }

      console.log(`[DB READ] ✓ Returning ${programList.length} total programs`);
      return programList;
    } catch (error) {
      console.warn("[DB READ] ✗ Database query failed, falling back to in-memory storage:", error);
      const inMemoryPrograms = Array.from(this.programsMap.values()).sort(
        (a, b) => parseInt(a.order) - parseInt(b.order)
      );
      console.log(`[MEMORY] Returning ${inMemoryPrograms.length} in-memory programs (fallback)`);
      return inMemoryPrograms;
    }
  }

  async getActivePrograms(): Promise<Program[]> {
    try {
      // Use Drizzle's proper query builder with explicit column selection
      const result = await db.select({
        id: programs.id,
        title: programs.title,
        description: programs.description,
        icon: programs.icon,
        features: programs.features,
        gradient: programs.gradient,
        bannerImage: programs.bannerImage,
        isActive: programs.isActive,
        programStatus: programs.programStatus,
        order: programs.order,
        eventDate: programs.eventDate,
        venue: programs.venue,
        feeLabel: programs.feeLabel,
        feeAmount: programs.feeAmount,
        earlyBirdOffer: programs.earlyBirdOffer,
        // registerUrl: programs.registerUrl, // Excluded
        createdAt: programs.createdAt,
        updatedAt: programs.updatedAt,
      }).from(programs)
        .where(eq(programs.isActive, true))
        .orderBy(sql`CAST(${programs.order} AS INTEGER)`);

      let programList: Program[] = result.map((row) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        icon: row.icon,
        features: row.features,
        gradient: row.gradient || 'purple',
        bannerImage: row.bannerImage,
        isActive: row.isActive ?? true,
        programStatus: row.programStatus || 'upcoming',
        order: row.order || '0',
        eventDate: row.eventDate,
        venue: row.venue,
        feeLabel: row.feeLabel,
        feeAmount: row.feeAmount,
        earlyBirdOffer: row.earlyBirdOffer,
        registerUrl: null, // Default to null
        createdAt: row.createdAt ? new Date(row.createdAt) : new Date(),
        updatedAt: row.updatedAt ? new Date(row.updatedAt) : new Date(),
      }));

      // Merge with in-memory active programs
      const memoryPrograms = Array.from(this.programsMap.values()).filter(p => p.isActive);
      const dbIds = new Set(programList.map(p => p.id));
      const unsyncedMemoryPrograms = memoryPrograms.filter(p => !dbIds.has(p.id));
      
      if (unsyncedMemoryPrograms.length > 0) {
        console.log(`[DB] Merging ${unsyncedMemoryPrograms.length} unsynced in-memory active programs`);
        programList = [...programList, ...unsyncedMemoryPrograms];
      }

      // Sort by order
      programList.sort((a, b) => parseInt(a.order) - parseInt(b.order));

      if (programList.length === 0) {
        console.warn("[DB] No active programs found in database or memory");
        return [];
      }

      return programList;
    } catch (error) {
      console.warn("[DB] Database query failed, falling back to in-memory storage:", error);
      const inMemoryPrograms = Array.from(this.programsMap.values())
        .filter(p => p.isActive)
        .sort((a, b) => parseInt(a.order) - parseInt(b.order));
      console.log(`[MEMORY] Returning ${inMemoryPrograms.length} in-memory active programs (fallback)`);
      return inMemoryPrograms;
    }
  }

  async getProgramById(id: string): Promise<Program | undefined> {
    try {
      const result = await db.select({
        id: programs.id,
        title: programs.title,
        description: programs.description,
        icon: programs.icon,
        features: programs.features,
        gradient: programs.gradient,
        bannerImage: programs.bannerImage,
        isActive: programs.isActive,
        programStatus: programs.programStatus,
        order: programs.order,
        eventDate: programs.eventDate,
        venue: programs.venue,
        feeLabel: programs.feeLabel,
        feeAmount: programs.feeAmount,
        earlyBirdOffer: programs.earlyBirdOffer,
        // registerUrl: programs.registerUrl, // Excluded
        createdAt: programs.createdAt,
        updatedAt: programs.updatedAt,
      }).from(programs).where(eq(programs.id, id));

      if (result.length === 0) {
        console.warn("Program not found in database, checking in-memory storage");
        return this.programsMap.get(id);
      }

      const row = result[0];
      const program: Program = {
        id: row.id,
        title: row.title,
        description: row.description,
        icon: row.icon,
        features: row.features,
        gradient: row.gradient || 'purple',
        bannerImage: row.bannerImage,
        isActive: row.isActive ?? true,
        programStatus: row.programStatus || 'upcoming',
        order: row.order || '0',
        eventDate: row.eventDate,
        venue: row.venue,
        feeLabel: row.feeLabel,
        feeAmount: row.feeAmount,
        earlyBirdOffer: row.earlyBirdOffer,
        registerUrl: null, // Default
        createdAt: row.createdAt ? new Date(row.createdAt) : new Date(),
        updatedAt: row.updatedAt ? new Date(row.updatedAt) : new Date(),
      };

      // Sync with in-memory storage
      this.programsMap.set(program.id, program);

      return program;
    } catch (error) {
      console.warn("Database query failed, falling back to in-memory storage:", error);
      return this.programsMap.get(id);
    }
  }

  async createProgram(insertProgram: InsertProgram): Promise<Program> {
    try {
      console.log(`[DB CREATE] Starting database insert for: "${insertProgram.title}"`);
      
      const result = await db.insert(programs).values({
        title: insertProgram.title,
        description: insertProgram.description,
        icon: insertProgram.icon,
        features: insertProgram.features,
        gradient: insertProgram.gradient || 'purple',
        bannerImage: insertProgram.bannerImage,
        isActive: insertProgram.isActive ?? true,
        programStatus: insertProgram.programStatus || 'upcoming',
        order: insertProgram.order || '0',
        eventDate: insertProgram.eventDate,
        venue: insertProgram.venue,
        feeLabel: insertProgram.feeLabel,
        feeAmount: insertProgram.feeAmount,
        earlyBirdOffer: insertProgram.earlyBirdOffer,
        // registerUrl: insertProgram.registerUrl, // Excluded
      }).returning({
        id: programs.id,
        title: programs.title,
        description: programs.description,
        icon: programs.icon,
        features: programs.features,
        gradient: programs.gradient,
        bannerImage: programs.bannerImage,
        isActive: programs.isActive,
        programStatus: programs.programStatus,
        order: programs.order,
        eventDate: programs.eventDate,
        venue: programs.venue,
        feeLabel: programs.feeLabel,
        feeAmount: programs.feeAmount,
        earlyBirdOffer: programs.earlyBirdOffer,
        createdAt: programs.createdAt,
        updatedAt: programs.updatedAt,
      });

      const row = result[0];
      if (!row) {
        throw new Error("Database insert returned no rows");
      }

      const program: Program = {
        id: row.id,
        title: row.title,
        description: row.description,
        icon: row.icon,
        features: row.features,
        gradient: row.gradient || 'purple',
        bannerImage: row.bannerImage,
        isActive: row.isActive ?? true,
        programStatus: row.programStatus || 'upcoming',
        order: row.order || '0',
        eventDate: row.eventDate,
        venue: row.venue,
        feeLabel: row.feeLabel,
        feeAmount: row.feeAmount,
        earlyBirdOffer: row.earlyBirdOffer,
        registerUrl: null, // Default
        createdAt: row.createdAt ? new Date(row.createdAt) : new Date(),
        updatedAt: row.updatedAt ? new Date(row.updatedAt) : new Date(),
      };

      // Sync with in-memory storage
      this.programsMap.set(program.id, program);
      
      console.log(`[DB CREATE] ✓✓✓ Program SUCCESSFULLY CREATED IN DATABASE: "${program.title}" (ID: ${program.id})`);
      return program;
    } catch (error: any) {
      console.error(`[DB CREATE] ✗✗✗ DATABASE INSERT FAILED:`, error?.message || error);
      console.error(`[DB CREATE] Program "${insertProgram.title}" will be created IN MEMORY ONLY (NOT in database)`);
      console.warn("[DB CREATE] Falling back to in-memory storage");
      return this.createProgramInMemory(insertProgram);
    }
  }

  async updateProgram(id: string, updateData: UpdateProgram): Promise<Program | undefined> {
    try {
      // Use Drizzle's proper update query builder
      const { registerUrl, ...safeUpdateData } = updateData;
      const result = await db.update(programs)
        .set({
          ...safeUpdateData,
          updatedAt: new Date()
        })
        .where(eq(programs.id, id))
        .returning({
          id: programs.id,
          title: programs.title,
          description: programs.description,
          icon: programs.icon,
          features: programs.features,
          gradient: programs.gradient,
          bannerImage: programs.bannerImage,
          isActive: programs.isActive,
          programStatus: programs.programStatus,
          order: programs.order,
          eventDate: programs.eventDate,
          venue: programs.venue,
          feeLabel: programs.feeLabel,
          feeAmount: programs.feeAmount,
          earlyBirdOffer: programs.earlyBirdOffer,
          // registerUrl: programs.registerUrl, // Excluded
          createdAt: programs.createdAt,
          updatedAt: programs.updatedAt,
        });

      if (result.length === 0) return undefined;

      const row = result[0];
      const program: Program = {
        id: row.id,
        title: row.title,
        description: row.description,
        icon: row.icon,
        features: row.features,
        gradient: row.gradient || 'purple',
        bannerImage: row.bannerImage,
        isActive: row.isActive ?? true,
        programStatus: row.programStatus || 'upcoming',
        order: row.order || '0',
        eventDate: row.eventDate,
        venue: row.venue,
        feeLabel: row.feeLabel,
        feeAmount: row.feeAmount,
        earlyBirdOffer: row.earlyBirdOffer,
        registerUrl: null, // Default
        createdAt: row.createdAt ? new Date(row.createdAt) : new Date(),
        updatedAt: row.updatedAt ? new Date(row.updatedAt) : new Date(),
      };

      // Sync with in-memory storage
      this.programsMap.set(program.id, program);

      return program;
    } catch (error) {
      console.warn("Database update failed, falling back to in-memory storage:", error);
      return this.updateProgramInMemory(id, updateData);
    }
  }

  async deleteProgram(id: string): Promise<boolean> {
    try {
      console.log(`[DELETE] Starting deletion for program: ${id}`);

      // Step 1: Delete from database if it exists there
      let dbDeleted = false;
      try {
        // First delete registrations
        await db
          .delete(programRegistrations)
          .where(eq(programRegistrations.programId, id));
        console.log(`[DELETE] Cleaned up registrations for program ${id}`);

        // Then delete program
        const result = await db
          .delete(programs)
          .where(eq(programs.id, id));
        
        dbDeleted = (result as any) > 0;
        if (dbDeleted) {
          console.log(`[DELETE] Deleted from database: ${id}`);
        }
      } catch (dbError) {
        console.warn(`[DELETE] Database deletion failed:`, (dbError as any)?.message);
      }

      // Step 2: Delete from memory storage
      const memoryDeleted = this.programsMap.delete(id);
      if (memoryDeleted) {
        console.log(`[DELETE] Deleted from memory: ${id}`);
      }

      // Return true if deleted from either source
      const success = dbDeleted || memoryDeleted;

      if (success) {
        console.log(`[DELETE] ✓ Program deleted successfully: ${id}`);
      } else {
        console.warn(`[DELETE] Program not found in database or memory: ${id}`);
      }

      return success;
    } catch (error) {
      console.error(`[DELETE] ✗ Error deleting program ${id}:`, error);
      throw error;
    }
  }

  async getPartners(): Promise<Partner[]> {
    return await db.select().from(partners).orderBy(partners.order);
  }

  async getActivePartners(): Promise<Partner[]> {
    return await db.select().from(partners).where(eq(partners.isActive, true)).orderBy(partners.order);
  }

  async getPartnerById(id: string): Promise<Partner | undefined> {
    const result = await db.select().from(partners).where(eq(partners.id, id));
    return result[0];
  }

  async createPartner(insertPartner: InsertPartner): Promise<Partner> {
    const result = await db.insert(partners).values(insertPartner).returning();
    return result[0];
  }

  async updatePartner(id: string, updateData: UpdatePartner): Promise<Partner | undefined> {
    const result = await db.update(partners)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(partners.id, id))
      .returning();
    return result[0];
  }

  async deletePartner(id: string): Promise<boolean> {
    const result = await db.delete(partners).where(eq(partners.id, id)).returning();
    return result.length > 0;
  }

  async getPopupSettings(): Promise<PopupSettings | null> {
    const result = await db.select().from(popupSettings);
    if (result.length === 0) {
      const defaultSettings = await db.insert(popupSettings).values({
        isEnabled: true,
        title: "Startup Boot Camp",
        bannerImage: "/assets/kef a_1764492076701.png",
        buttonText: "Register Now",
        buttonLink: "/register",
        delaySeconds: "1",
        showOnce: false,
      }).returning();
      return defaultSettings[0];
    }
    return result[0];
  }

  async updatePopupSettings(settings: UpdatePopupSettings): Promise<PopupSettings> {
    const existing = await this.getPopupSettings();
    if (!existing) {
      const created = await db.insert(popupSettings).values({
        isEnabled: settings.isEnabled ?? true,
        title: settings.title ?? "Startup Boot Camp",
        bannerImage: settings.bannerImage ?? "/assets/kef a_1764492076701.png",
        buttonText: settings.buttonText ?? "Register Now",
        buttonLink: settings.buttonLink ?? "/register",
        delaySeconds: settings.delaySeconds ?? "1",
        showOnce: settings.showOnce ?? false,
      }).returning();
      return created[0];
    }
    const result = await db.update(popupSettings)
      .set({ ...settings, updatedAt: new Date() })
      .where(eq(popupSettings.id, existing.id))
      .returning();
    return result[0];
  }

  async getProgramRegistrations(programId: string): Promise<ProgramRegistration[]> {
    return await db.select().from(programRegistrations).where(eq(programRegistrations.programId, programId));
  }

  async createProgramRegistration(registration: InsertProgramRegistration): Promise<ProgramRegistration> {
    // Apply defaults for optional fields
    const registrationWithDefaults = {
      ...registration,
      attendeeType: registration.attendeeType || "first-time",
      affiliation: registration.affiliation || "not-affiliated",
    };
    const result = await db.insert(programRegistrations).values(registrationWithDefaults).returning();
    return result[0];
  }

  async deleteProgramRegistration(id: string): Promise<boolean> {
    const result = await db.delete(programRegistrations).where(eq(programRegistrations.id, id)).returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
