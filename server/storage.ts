import { 
  type User, 
  type InsertUser, 
  type Contact, 
  type InsertContact,
  type Membership,
  type InsertMembership,
  type Bootcamp,
  type InsertBootcamp
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createContactSubmission(contact: InsertContact): Promise<Contact>;
  getContactSubmissions(): Promise<Contact[]>;
  
  createMembershipApplication(membership: InsertMembership): Promise<Membership>;
  getMembershipApplications(): Promise<Membership[]>;
  updateMembershipStatus(id: string, status: string): Promise<Membership | undefined>;
  
  createBootcampRegistration(bootcamp: InsertBootcamp): Promise<Bootcamp>;
  getBootcampRegistrations(): Promise<Bootcamp[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private contacts: Map<string, Contact>;
  private memberships: Map<string, Membership>;
  private bootcamps: Map<string, Bootcamp>;

  constructor() {
    this.users = new Map();
    this.contacts = new Map();
    this.memberships = new Map();
    this.bootcamps = new Map();
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

  async updateMembershipStatus(id: string, status: string): Promise<Membership | undefined> {
    const membership = this.memberships.get(id);
    if (membership) {
      membership.status = status;
      this.memberships.set(id, membership);
      return membership;
    }
    return undefined;
  }

  async createBootcampRegistration(insertBootcamp: InsertBootcamp): Promise<Bootcamp> {
    const id = randomUUID();
    const bootcamp: Bootcamp = {
      ...insertBootcamp,
      id,
      organization: insertBootcamp.organization ?? null,
      expectations: insertBootcamp.expectations ?? null,
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
}

export const storage = new MemStorage();
