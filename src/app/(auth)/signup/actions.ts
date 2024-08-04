"use server";

import { lucia } from "@/auth";
import { db } from "@/lib/drizzle";
import { lower, userTable } from "@/lib/schema";
import { type SignUpType, signUpSchema } from "@/lib/validation";
import { eq } from "drizzle-orm";
import { Scrypt, generateIdFromEntropySize } from "lucia";
import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signUp(credentials: SignUpType): Promise<{ error: string }> {
  try {
    const { email, password, userName } = signUpSchema.parse(credentials);
    const scrypt = new Scrypt();
    const passwordHash = await scrypt.hash(password);
    const userId = generateIdFromEntropySize(10);

    const existingUser = await db.query.userTable.findFirst({
      where: eq(lower(userTable.userName), userName.toLowerCase()),
    });
    if (existingUser) return { error: "Username is already taken" };
    const existingEmail = await db.query.userTable.findFirst({
      where: eq(lower(userTable.email), email.toLowerCase()),
    });
    if (existingEmail) return { error: "Email is already taken" };

    await db.insert(userTable).values({
      id: userId,
      userName,
      displayName: userName,
      email,
      passwordHash,
    });

    const session = await lucia.createSession(userId, {});
    const { name, value, attributes } = lucia.createSessionCookie(session.id);
    cookies().set(name, value, attributes);

    return redirect("/");
  } catch (err) {
    console.error(err);
    if (isRedirectError(err)) throw err;
    return { error: "Something went wrong. Please try again" };
  }
}
