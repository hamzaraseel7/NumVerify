import { db } from "../db";
import { users, searches, analytics, type User, type InsertUser, type Search, type InsertSearch, type Analytics } from "@shared/schema";
import { eq, desc } from "drizzle-orm";
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

export class DbStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    const user = result[0];
    
    await db.insert(analytics).values({
      userId: user.id,
      totalSearches: 0,
      recentSearches: 0,
      validNumbersCount: 0,
    });
    
    return user;
  }

  async createSearch(search: InsertSearch): Promise<Search> {
    const result = await db.insert(searches).values(search).returning();
    return result[0];
  }

  async getUserSearches(userId: string, limit: number = 50): Promise<Search[]> {
    return await db
      .select()
      .from(searches)
      .where(eq(searches.userId, userId))
      .orderBy(desc(searches.createdAt))
      .limit(limit);
  }

  async getUserAnalytics(userId: string): Promise<Analytics | undefined> {
    const result = await db.select().from(analytics).where(eq(analytics.userId, userId)).limit(1);
    return result[0];
  }

  async updateUserAnalytics(userId: string, data: Partial<Analytics>): Promise<void> {
    await db.update(analytics).set(data).where(eq(analytics.userId, userId));
  }

  async incrementSearchCount(userId: string, isValid: boolean): Promise<void> {
    const userAnalytics = await this.getUserAnalytics(userId);
    if (userAnalytics) {
      await db.update(analytics).set({
        totalSearches: userAnalytics.totalSearches + 1,
        recentSearches: userAnalytics.recentSearches + 1,
        validNumbersCount: isValid ? userAnalytics.validNumbersCount + 1 : userAnalytics.validNumbersCount,
        updatedAt: new Date(),
      }).where(eq(analytics.userId, userId));
    }
  }
}

export const storage = new DbStorage();
