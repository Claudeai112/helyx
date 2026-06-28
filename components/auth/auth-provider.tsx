"use client";
import { createContext, useContext } from "react";

export type AuthUser = { id: string; email: string; name: string | null } | null;

const AuthContext = createContext<AuthUser>(null);

export function AuthProvider({ user, children }: { user: AuthUser; children: React.ReactNode }) {
  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}

// Returns the signed-in user, or null when logged out.
export function useAuth(): AuthUser {
  return useContext(AuthContext);
}
