import { useEffect, useState, useRef, type ReactNode } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { AuthContext } from "./AuthContext";
import keycloak from "./keycloak";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const initialized = useRef(false);

  useEffect(() => {
    // Prevent double-initialization in React StrictMode
    if (initialized.current) return;
    initialized.current = true;

    keycloak
      .init({
        onLoad: "login-required",
        pkceMethod: "S256",
      })
      .then((auth: boolean) => {
        setAuthenticated(auth);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  // Extract user display info from Keycloak token
  const tokenParsed = keycloak.tokenParsed as Record<string, string> | undefined;
  const userName: string =
    tokenParsed?.["preferred_username"] ??
    tokenParsed?.["given_name"] ??
    "Utilisateur";

  const userInitial = userName.charAt(0).toUpperCase();

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f7f9fb",
          gap: 2,
        }}
      >
        <CircularProgress sx={{ color: "#22b8c8" }} size={48} />
        <Typography sx={{ fontSize: 16, color: "#6b7280" }}>
          Connexion en cours…
        </Typography>
      </Box>
    );
  }

  return (
    <AuthContext.Provider
      value={{ keycloak, authenticated, userName, userInitial }}
    >
      {children}
    </AuthContext.Provider>
  );
}
