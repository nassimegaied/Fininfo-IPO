import { createContext, useContext } from "react";

// We use 'any' here to avoid moduleResolution issues with keycloak-js ESM exports.
// The keycloak instance is typed via the singleton in keycloak.ts.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type KeycloakInstance = any;

export type AuthContextType = {
  keycloak: KeycloakInstance;
  authenticated: boolean;
  userName: string;
  userInitial: string;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
