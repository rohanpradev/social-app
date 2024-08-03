import { type SQL, relations, sql } from "drizzle-orm";
import { type AnyPgColumn, pgTable, text, timestamp } from "drizzle-orm/pg-core";

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

export const sessionRelations = relations(sessionTable, ({ one }) => ({
  sessions: one(userTable, {
    fields: [sessionTable.userId],
    references: [userTable.id],
  }),
}));

// custom lower function
export function lower(email: AnyPgColumn): SQL {
  return sql`lower(${email})`;
}
