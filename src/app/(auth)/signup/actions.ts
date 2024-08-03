"use server";

import { db } from "@/lib/drizzle";
import { lower, userTable } from "@/lib/schema";
import { type SignUpType, signUpSchema } from "@/lib/validation";
import { eq } from "drizzle-orm";
import { Scrypt, generateIdFromEntropySize } from "lucia";

export async function signUp(credentials: SignUpType): Promise<{ error: string }> {
  try {
    const { email, password, userName } = signUpSchema.parse(credentials);
    const scrypt = new Scrypt();
    const passwordHash = scrypt.hash(password);
    const userId = generateIdFromEntropySize(10);

    const existinguser = await db.query.userTable.findFirst({
      where: eq(lower(userTable.userName), userName.toLowerCase()),
    });
    if (existinguser) return { error: "Username is already taken" };
  } catch (err) {
    console.error(err);
    return { error: "Something went wrong. Please try again" };
  }
}
