import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateToken, hashPassword, comparePassword, authMiddleware } from "./auth";
import { validatePhoneNumber, generateAIInsight } from "./numverify";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/signup", async (req, res) => {
    try {
      const { email, password } = insertUserSchema.parse(req.body);

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        res.status(400).json({ error: "Email already registered" });
        return;
      }

      const hashedPassword = await hashPassword(password);
      const user = await storage.createUser({ email, password: hashedPassword });

      const token = generateToken({ userId: user.id, email: user.email });

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid input", details: error.errors });
        return;
      }
      console.error("Signup error:", error);
      res.status(500).json({ error: "Failed to create account" });
    }
  });

  app.post("/api/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: "Email and password required" });
        return;
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      const isValid = await comparePassword(password, user.password);
      if (!isValid) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      const token = generateToken({ userId: user.id, email: user.email });

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/search", authMiddleware, async (req, res) => {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const { phoneNumber, countryCode } = req.body;

      if (!phoneNumber || !countryCode) {
        res.status(400).json({ error: "Phone number and country code required" });
        return;
      }

      const validationResult = await validatePhoneNumber(phoneNumber, countryCode);
      const aiInsight = generateAIInsight(validationResult);

      const search = await storage.createSearch({
        userId,
        phoneNumber,
        countryCode,
        country: validationResult.country_name || null,
        location: validationResult.location || null,
        carrier: validationResult.carrier || null,
        lineType: validationResult.line_type || null,
        valid: validationResult.valid,
        aiInsight,
      });

      await storage.incrementSearchCount(userId, validationResult.valid);

      res.json({
        id: search.id,
        phoneNumber: search.phoneNumber,
        valid: search.valid,
        country: search.country,
        location: search.location,
        carrier: search.carrier,
        lineType: search.lineType,
        aiInsight: search.aiInsight,
        createdAt: search.createdAt,
      });
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({ error: "Search failed" });
    }
  });

  app.get("/api/searches", authMiddleware, async (req, res) => {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const searches = await storage.getUserSearches(userId, limit);

      res.json(searches);
    } catch (error) {
      console.error("Get searches error:", error);
      res.status(500).json({ error: "Failed to fetch searches" });
    }
  });

  app.get("/api/analytics", authMiddleware, async (req, res) => {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const analytics = await storage.getUserAnalytics(userId);

      if (!analytics) {
        res.json({
          totalSearches: 0,
          recentSearches: 0,
          validNumbersCount: 0,
          validationRate: 0,
        });
        return;
      }

      const validationRate = analytics.totalSearches > 0 
        ? Math.round((analytics.validNumbersCount / analytics.totalSearches) * 100)
        : 0;

      res.json({
        totalSearches: analytics.totalSearches,
        recentSearches: analytics.recentSearches,
        validNumbersCount: analytics.validNumbersCount,
        validationRate,
      });
    } catch (error) {
      console.error("Get analytics error:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  app.get("/api/profile", authMiddleware, async (req, res) => {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const user = await storage.getUser(userId);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const analytics = await storage.getUserAnalytics(userId);

      res.json({
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        totalSearches: analytics?.totalSearches || 0,
      });
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
