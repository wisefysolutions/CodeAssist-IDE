import { pgTable, text, serial, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Files model
export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  content: text("content").notNull(),
  language: text("language").notNull(),
  folderId: integer("folder_id"),
  userId: integer("user_id").notNull().references(() => users.id),
  path: text("path").notNull(),
});

export const insertFileSchema = createInsertSchema(files).pick({
  name: true,
  content: true,
  language: true,
  folderId: true,
  userId: true,
  path: true,
});

// Folders model
export const folders = pgTable("folders", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  parentId: integer("parent_id"),
  userId: integer("user_id").notNull().references(() => users.id),
  path: text("path").notNull(),
});

export const insertFolderSchema = createInsertSchema(folders).pick({
  name: true,
  parentId: true,
  userId: true,
  path: true,
});

// Chat messages model
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  timestamp: text("timestamp").notNull(),
  hasCode: text("has_code"),
  code: text("code"),
  codeLanguage: text("code_language"),
  userId: integer("user_id").notNull().references(() => users.id),
  assistantType: text("assistant_type").notNull(),
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  role: true,
  content: true,
  timestamp: true,
  hasCode: true,
  code: true,
  codeLanguage: true,
  userId: true,
  assistantType: true,
});

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertFile = z.infer<typeof insertFileSchema>;
export type File = typeof files.$inferSelect;

export type InsertFolder = z.infer<typeof insertFolderSchema>;
export type Folder = typeof folders.$inferSelect;

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
