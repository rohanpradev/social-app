import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";

export default async function AuthLayout({ children }: PropsWithChildren) {
  const { user } = await validateRequest();
  if (user) redirect("/");
  return <>{children}</>;
}
