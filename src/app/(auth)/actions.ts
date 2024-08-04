"user server";

import { lucia, validateRequest } from "@/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const { session } = await validateRequest();
  if (!session) throw new Error("Unauthorized");
  await lucia.invalidateSession(session.id);

  const { name, value, attributes } = lucia.createBlankSessionCookie();
  cookies().set(name, value, attributes);

  return redirect("/login");
}
