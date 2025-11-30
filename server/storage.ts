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
  type InsertAdmin
} from "@shared/schema";
import { randomUUID } from "crypto";

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
  
  getDashboardStats(): Promise<{
    totalBootcampRegistrations: number;
    totalMembershipApplications: number;
    totalContactSubmissions: number;
    pendingBootcamp: number;
    pendingMembership: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private contacts: Map<string, Contact>;
  private memberships: Map<string, Membership>;
  private bootcamps: Map<string, Bootcamp>;
  private admins: Map<string, Admin>;

  constructor() {
    this.users = new Map();
    this.contacts = new Map();
    this.memberships = new Map();
    this.bootcamps = new Map();
    this.admins = new Map();
    
    this.initDefaultAdmin();
  }

  private async initDefaultAdmin() {
    const existingAdmin = await this.getAdminByUsername("admin");
    if (!existingAdmin) {
      await this.createAdmin({
        username: "admin",
        password: "admin123"
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
      organization: insertBootcamp.organization ?? null,
      district: "",
      experience: "",
      expectations: null,
      createdAt: new Date(),
      status: "pending",
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
    const admin: Admin = {
      ...insertAdmin,
      id,
      createdAt: new Date(),
    };
    this.admins.set(id, admin);
    return admin;
  }

  async getAdmins(): Promise<Admin[]> {
    return Array.from(this.admins.values());
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
}

export const storage = new MemStorage();
