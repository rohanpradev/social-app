import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";
import { SessionProvider } from "./SessionProvider";

export default async function MainLayout({ children }: PropsWithChildren) {
  const session = await validateRequest();
  if (!session?.user) redirect("/login");
  return <SessionProvider value={session}>{children}</SessionProvider>;
}
