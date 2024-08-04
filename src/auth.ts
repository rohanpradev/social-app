import { db } from "@/lib/drizzle";
import { sessionTable, userTable } from "@/lib/schema";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia, type Session, type User } from "lucia";
import { cookies } from "next/headers";
import { cache } from "react";

const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: { secure: process.env.NODE_ENV === "production" },
  },
  getUserAttributes({ id, userName, displayName, avatarUrl, googleId }) {
    return {
      id,
      userName,
      displayName,
      avatarUrl,
      googleId,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  id: string;
  userName: string;
  displayName: string;
  avatarUrl: string | null;
  googleId: string | null;
}

export const validateRequest = cache(
  async (): Promise<{ user: User; session: Session } | { user: null; session: null }> => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) return { user: null, session: null };

    const { session, user } = await lucia.validateSession(sessionId);
    try {
      if (session?.fresh) {
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
      }
      if (!session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
      }
    } catch {
      // Next.js throws error when attempting to set cookies when rendering page
    }
    return { user, session } as { user: User; session: Session };
  },
);
