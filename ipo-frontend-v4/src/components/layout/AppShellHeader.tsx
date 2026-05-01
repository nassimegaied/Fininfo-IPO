import { useState } from "react";
import { Box, Typography, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useAuth } from "../../auth/AuthContext";

type AppShellHeaderProps = {
  showBackToMenu?: boolean;
};

export default function AppShellHeader({
  showBackToMenu = true,
}: AppShellHeaderProps) {
  const navigate = useNavigate();
  const { keycloak, userName, userInitial } = useAuth();

  const handleLogout = () => {
    keycloak.logout({ redirectUri: window.location.origin });
  };
  const [anchorElBourse, setAnchorElBourse] = useState<null | HTMLElement>(null);

  const handleOpenBourse = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElBourse(event.currentTarget);
  };
  
  const handleCloseBourse = () => {
    setAnchorElBourse(null);
  };

  return (
    <>
      <Box
        sx={{
          height: 48,
          bgcolor: "#eef4f6",
          borderBottom: "1px solid #dfe7ec",
          px: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          sx={{
            fontSize: 16,
            fontWeight: 700,
            color: "#22b8c8",
          }}
        >
          FININFO DEPOSITAIRE
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              border: "2px solid #22b8c8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#6b7280",
              fontSize: 18,
              fontWeight: 500,
              bgcolor: "#fff",
              textTransform: "uppercase",
            }}
          >
            {userInitial}
          </Box>

          <Typography sx={{ fontSize: 16, color: "#1f2937" }}>
            {userName}
          </Typography>

          <Typography
            onClick={handleLogout}
            sx={{
              fontSize: 16,
              color: "#22b8c8",
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Se déconnecter
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          height: 62,
          bgcolor: "#fff",
          borderBottom: "1px solid #e6edf2",
          px: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: showBackToMenu ? "space-between" : "flex-start",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
          {/* HOME ICON - Only this one navigates back to menu */}
          <Box onClick={() => navigate("/")} sx={{ display: "flex", alignItems: "center", color: "#6b7280", cursor: "pointer", transition: "0.2s", "&:hover": { color: "#22b8c8" } }}>
            <HomeOutlinedIcon sx={{ fontSize: 24 }} />
          </Box>

          {/* ACCUEIL */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#4b5563", cursor: "pointer", transition: "0.2s", "&:hover": { color: "#22b8c8" } }}>
            <Typography sx={{ fontSize: 18 }}>
              Accueil
            </Typography>
          </Box>

          {/* OTC */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#4b5563", cursor: "pointer", transition: "0.2s", "&:hover": { color: "#22b8c8" } }}>
            <Typography sx={{ fontSize: 18 }}>
              OTC
            </Typography>
            <KeyboardArrowDownIcon sx={{ fontSize: 20 }} />
          </Box>

          {/* BOURSE DROPDOWN */}
          <Box onClick={handleOpenBourse} sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#4b5563", cursor: "pointer", transition: "0.2s", "&:hover": { color: "#22b8c8" } }}>
            <Typography sx={{ fontSize: 18 }}>
              Bourse
            </Typography>
            <KeyboardArrowDownIcon sx={{ fontSize: 20, transform: Boolean(anchorElBourse) ? "rotate(180deg)" : "none", transition: "0.2s" }} />
          </Box>
          <Menu 
            anchorEl={anchorElBourse} 
            open={Boolean(anchorElBourse)} 
            onClose={handleCloseBourse}
            slotProps={{ paper: { sx: { mt: 1, minWidth: 220 } } }}
          >
            <MenuItem onClick={() => { handleCloseBourse(); navigate("/ipo"); }}>
              Introduction en Bourse
            </MenuItem>
            <MenuItem onClick={() => { handleCloseBourse(); navigate("/collecte"); }}>
              Collecte d'ordres
            </MenuItem>
          </Menu>
        </Box>

        {showBackToMenu && (
          <Box
            onClick={() => navigate("/")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              color: "#22b8c8",
              cursor: "pointer",
              transition: "0.2s",
              "&:hover": { opacity: 0.8 },
            }}
          >
            <ArrowBackOutlinedIcon sx={{ fontSize: 22 }} />
            <Typography sx={{ fontSize: 16, color: "inherit" }}>
              Retour au Menu
            </Typography>
          </Box>
        )}
      </Box>
    </>
  );
}