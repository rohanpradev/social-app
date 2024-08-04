"use server";

import { lucia } from "@/auth";
import { db } from "@/lib/drizzle";
import { lower, userTable } from "@/lib/schema";
import { type LoginType, loginSchema } from "@/lib/validation";
import { eq } from "drizzle-orm";
import { Scrypt } from "lucia";
import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(credentials: LoginType): Promise<{ error: string }> {
  try {
    const { password, userName } = loginSchema.parse(credentials);
    const existingUser = await db.query.userTable.findFirst({
      where: eq(lower(userTable.userName), userName.toLowerCase()),
    });
    if (!existingUser || !existingUser.passwordHash) return { error: "Incorrect username or password" };
    const scrypt = new Scrypt();
    const validPassword = await scrypt.verify(existingUser.passwordHash, password);
    if (!validPassword) return { error: "Incorrect username or password" };
    const session = await lucia.createSession(existingUser.id, {});
    const { name, value, attributes } = lucia.createSessionCookie(session.id);
    cookies().set(name, value, attributes);
    return redirect("/");
  } catch (err) {
    if (isRedirectError(err)) throw err;
    console.error(err);
    return { error: "Something went wrong. Please try again later" };
  }
}
