import { Box } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import AppShellHeader from "./AppShellHeader";

export default function AppLayout() {
  const location = useLocation();
  const showBack = location.pathname !== "/";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f7f9fb",
        overflowX: "auto",
      }}
    >
      <Box sx={{ minWidth: 1280 }}>
        <AppShellHeader showBackToMenu={showBack} />
        <Outlet />
      </Box>
    </Box>
  );
}
