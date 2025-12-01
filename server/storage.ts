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
  users,
  contactSubmissions,
  membershipApplications,
  bootcampRegistrations,
  adminUsers,
  programs,
  partners
} from "@shared/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { eq } from "drizzle-orm";

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
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private contacts: Map<string, Contact>;
  private memberships: Map<string, Membership>;
  private bootcamps: Map<string, Bootcamp>;
  private admins: Map<string, Admin>;
  private programsMap: Map<string, Program>;
  private partnersMap: Map<string, Partner>;

  constructor() {
    this.users = new Map();
    this.contacts = new Map();
    this.memberships = new Map();
    this.bootcamps = new Map();
    this.admins = new Map();
    this.programsMap = new Map();
    this.partnersMap = new Map();
    
    this.initDefaultAdmin();
    this.initDefaultPrograms();
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
      { title: "Startup Boot Camp", description: "Residential camps with workshops, business model creation, and pitching sessions.", icon: "Rocket", gradient: "orange" as const },
      { title: "Business Conclaves", description: "Large-scale gatherings connecting founders, investors, and thought leaders.", icon: "Building2", gradient: "blue" as const },
      { title: "Founder Circle", description: "Exclusive networking dinners for honest entrepreneur conversations.", icon: "Users", gradient: "purple" as const },
      { title: "Advisory Clinics", description: "One-on-one mentoring in finance, branding, legal, and marketing.", icon: "Briefcase", gradient: "teal" as const },
      { title: "Campus Labs", description: "Innovation cells and student incubators in colleges across Kerala.", icon: "GraduationCap", gradient: "blue" as const },
    ];

    for (let i = 0; i < defaultPrograms.length; i++) {
      await this.createProgram({
        ...defaultPrograms[i],
        order: String(i),
        isActive: true,
      });
    }
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

  async createProgram(insertProgram: InsertProgram): Promise<Program> {
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
      order: insertProgram.order ?? "0",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.programsMap.set(id, program);
    return program;
  }

  async updateProgram(id: string, updateData: UpdateProgram): Promise<Program | undefined> {
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
}

export class DatabaseStorage implements IStorage {
  constructor() {
    this.initDefaultAdmin();
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

  async initDefaultPrograms() {
    try {
      const existing = await this.getPrograms();
      
      if (existing.length === 0) {
        const defaultPrograms = [
          { 
            title: "Startup Boot Camp", 
            description: "Both residential and Day camps where participants learn to think like entrepreneurs. The camp includes powerful workshops, business model creation, idea validation, field assignments, pitching sessions, and mentor interactions.",
            icon: "Rocket", 
            gradient: "orange" as const,
            isActive: true,
            order: "0"
          },
          { 
            title: "Business Conclaves", 
            description: "Large-scale gatherings where founders, investors, mentors, thought leaders, and students connect and collaborate.",
            icon: "Building2", 
            gradient: "blue" as const,
            isActive: true,
            order: "1"
          },
          { 
            title: "Founder Circles", 
            description: "Exclusive curated networking dinners and tea sessions bringing entrepreneurs and experts for honest conversations and opportunities.",
            icon: "Users", 
            gradient: "purple" as const,
            isActive: true,
            order: "2"
          },
          { 
            title: "Advisory Clinics", 
            description: "One-on-one mentoring and business advisory sessions in finance, branding, HR, legal, marketing, and operations.",
            icon: "Briefcase", 
            gradient: "teal" as const,
            isActive: true,
            order: "3"
          },
          { 
            title: "Campus Innovation Labs", 
            description: "Building entrepreneurship clubs, innovation cells, startup labs, and student incubators in colleges across Kerala.",
            icon: "Lightbulb", 
            gradient: "blue" as const,
            isActive: true,
            order: "4"
          },
          { 
            title: "KEF Student Entrepreneurs Forum", 
            description: "Vibrant club of student entrepreneurs and entrepreneurship aspirants.",
            icon: "GraduationCap", 
            gradient: "orange" as const,
            isActive: true,
            order: "5"
          },
        ];

        for (const prog of defaultPrograms) {
          await this.createProgram(prog);
        }
        console.log("Default programs created successfully");
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
    return await db.select().from(programs).orderBy(programs.order);
  }

  async getActivePrograms(): Promise<Program[]> {
    return await db.select().from(programs).where(eq(programs.isActive, true)).orderBy(programs.order);
  }

  async getProgramById(id: string): Promise<Program | undefined> {
    const result = await db.select().from(programs).where(eq(programs.id, id));
    return result[0];
  }

  async createProgram(insertProgram: InsertProgram): Promise<Program> {
    const result = await db.insert(programs).values(insertProgram).returning();
    return result[0];
  }

  async updateProgram(id: string, updateData: UpdateProgram): Promise<Program | undefined> {
    const result = await db.update(programs)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(programs.id, id))
      .returning();
    return result[0];
  }

  async deleteProgram(id: string): Promise<boolean> {
    const result = await db.delete(programs).where(eq(programs.id, id)).returning();
    return result.length > 0;
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
}

export const storage = new DatabaseStorage();
