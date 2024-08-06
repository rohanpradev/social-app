"use client";

import type { Session, User } from "lucia";
import { type PropsWithChildren, createContext, useContext } from "react";

interface SessionContext {
  user: User;
  session: Session;
}

const SessionContext = createContext<SessionContext | null>(null);

export const SessionProvider = ({ value, children }: PropsWithChildren<{ value: SessionContext }>) => (
  <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) throw new Error("Accessing outside the session context");
  return context;
};
