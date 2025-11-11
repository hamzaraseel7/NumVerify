import { type User, type InsertUser, type Search, type InsertSearch, type Analytics } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createSearch(search: InsertSearch): Promise<Search>;
  getUserSearches(userId: string, limit?: number): Promise<Search[]>;
  
  getUserAnalytics(userId: string): Promise<Analytics | undefined>;
  updateUserAnalytics(userId: string, data: Partial<Analytics>): Promise<void>;
  incrementSearchCount(userId: string, isValid: boolean): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private usersByEmail: Map<string, User> = new Map();
  private searches: Map<string, Search> = new Map();
  private analytics: Map<string, Analytics> = new Map();

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.usersByEmail.get(email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: randomUUID(),
      email: insertUser.email,
      password: insertUser.password,
      createdAt: new Date(),
    };
    
    this.users.set(user.id, user);
    this.usersByEmail.set(user.email, user);
    
    const userAnalytics: Analytics = {
      id: randomUUID(),
      userId: user.id,
      totalSearches: 0,
      recentSearches: 0,
      validNumbersCount: 0,
      updatedAt: new Date(),
    };
    this.analytics.set(user.id, userAnalytics);
    
    return user;
  }

  async createSearch(insertSearch: InsertSearch): Promise<Search> {
    const search: Search = {
      id: randomUUID(),
      userId: insertSearch.userId,
      phoneNumber: insertSearch.phoneNumber,
      countryCode: insertSearch.countryCode,
      country: insertSearch.country ?? null,
      location: insertSearch.location ?? null,
      carrier: insertSearch.carrier ?? null,
      lineType: insertSearch.lineType ?? null,
      valid: insertSearch.valid,
      aiInsight: insertSearch.aiInsight ?? null,
      createdAt: new Date(),
    };
    
    this.searches.set(search.id, search);
    return search;
  }

  async getUserSearches(userId: string, limit: number = 50): Promise<Search[]> {
    const userSearches = Array.from(this.searches.values())
      .filter(search => search.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
    
    return userSearches;
  }

  async getUserAnalytics(userId: string): Promise<Analytics | undefined> {
    return this.analytics.get(userId);
  }

  async updateUserAnalytics(userId: string, data: Partial<Analytics>): Promise<void> {
    const current = this.analytics.get(userId);
    if (current) {
      this.analytics.set(userId, { ...current, ...data, updatedAt: new Date() });
    }
  }

  async incrementSearchCount(userId: string, isValid: boolean): Promise<void> {
    const userAnalytics = await this.getUserAnalytics(userId);
    if (userAnalytics) {
      await this.updateUserAnalytics(userId, {
        totalSearches: userAnalytics.totalSearches + 1,
        recentSearches: userAnalytics.recentSearches + 1,
        validNumbersCount: isValid ? userAnalytics.validNumbersCount + 1 : userAnalytics.validNumbersCount,
      });
    }
  }
}

export const storage = new MemStorage();
