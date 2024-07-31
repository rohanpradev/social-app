import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { relations } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL as string);

export const db = drizzle(sql);

export const userTable = pgTable("users", {
  id: text("id").primaryKey(),
  userName: text("user_name").unique().notNull(),
  displayName: text("display_name").notNull(),
  email: text("email").unique(),
  avatarUrl: text("avatar_url"),
  googleId: text("google_id").unique(),
  passwordHash: text("password_hash"),
  bio: text("bio"),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  }).defaultNow(),
});

export const sessionTable = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const userRelations = relations(userTable, ({ many }) => ({
  sessions: many(sessionTable),
}));
