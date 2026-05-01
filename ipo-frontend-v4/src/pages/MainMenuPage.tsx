import { useMemo, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import WalletOutlinedIcon from "@mui/icons-material/WalletOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import CalculateOutlinedIcon from "@mui/icons-material/CalculateOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import BalanceOutlinedIcon from "@mui/icons-material/BalanceOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import BubbleChartOutlinedIcon from "@mui/icons-material/BubbleChartOutlined";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import { useNavigate } from "react-router-dom";

type MainCardProps = {
  title: string;
  icon: React.ReactNode;
  large?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
};

type SmallCardProps = {
  title: string;
  icon: React.ReactNode;
};

type BourseMenuKey =
  | "carnet"
  | "instruction"
  | "positions"
  | "flux"
  | null;

const border = "#71d9dc";
const bg = "#f7f9fb";
const text = "#111827";

function MainCard({ title, icon, large, onClick, children }: MainCardProps) {
  return (
    <Box
      onClick={onClick}
      sx={{
        position: "relative",
        width: 300,
        height: large ? 178 : 178,
        border: `2px solid ${border}`,
        borderRadius: 1.5,
        bgcolor: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: onClick ? "pointer" : "default",
        userSelect: "none",
      }}
    >
      <Box sx={{ color: "#1f2937", mb: 1.5 }}>{icon}</Box>
      <Typography
        sx={{
          fontSize: 17,
          fontWeight: 600,
          color: "#5d6776",
          textAlign: "center",
        }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  );
}

function SmallCard({ title, icon }: SmallCardProps) {
  return (
    <Box
      sx={{
        width: 135,
        height: 135,
        borderRadius: 2,
        bgcolor: "#f5fbfc",
        border: "1px solid #edf5f6",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 1,
      }}
    >
      <Box sx={{ color: "#243041", mb: 1.25 }}>{icon}</Box>
      <Typography
        sx={{
          fontSize: 15,
          fontWeight: 700,
          color: "#4b596a",
          lineHeight: 1.35,
          whiteSpace: "pre-line",
        }}
      >
        {title}
      </Typography>
    </Box>
  );
}

export default function MainMenuPage() {
  const navigate = useNavigate();
  const [openBourseMenu, setOpenBourseMenu] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<BourseMenuKey>(null);

  const bourseRef = useRef<HTMLDivElement | null>(null);

  const showSubMenu = useMemo(() => hoveredItem === "carnet", [hoveredItem]);

  const handleOpenIntro = () => {
    setOpenBourseMenu(false);
    setHoveredItem(null);
    navigate("/ipo");
  };

  const handleOpenCollecte = () => {
    setOpenBourseMenu(false);
    setHoveredItem(null);
    navigate("/collecte");
  };

  const handleOpenIpo = () => {
    setOpenBourseMenu(false);
    setHoveredItem(null);
    navigate("/ipo");
  };

  return (
    <Box sx={{ px: 3, pt: 5 }}>
          <Typography
            sx={{
              textAlign: "center",
              fontSize: 29,
              fontWeight: 800,
              color: text,
              mb: 5,
            }}
          >
            Bienvenue sur la plateforme dépositaire de CDGK
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 300px)",
              justifyContent: "center",
              gap: 3,
              mb: 3.5,
            }}
          >
            <Box
              ref={bourseRef}
              sx={{ position: "relative", width: 300, height: 178 }}
            >
              <MainCard
                title="Bourse"
                icon={<AccountBalanceOutlinedIcon sx={{ fontSize: 60 }} />}
                onClick={() => {
                  setOpenBourseMenu((prev) => !prev);
                  setHoveredItem(null);
                }}
              >
                {openBourseMenu && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: 300,
                      borderRadius: 1.5,
                      overflow: "visible",
                      boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                      bgcolor: "#fff",
                      border: `1px solid ${border}`,
                      zIndex: 20,
                    }}
                  >
                    <Box
                      sx={{
                        px: 1.8,
                        pt: 1.4,
                        pb: 0.75,
                        fontSize: 14,
                        color: "#4b5563",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography sx={{ fontSize: 14, color: "#4b5563" }}>
                        Carnet d'ordre
                      </Typography>
                      <MoreVertRoundedIcon sx={{ fontSize: 18, color: "#808b97" }} />
                    </Box>

                    <BourseMenuItem
                      text="Introduction en bourse"
                      active={hoveredItem === "carnet"}
                      onMouseEnter={() => setHoveredItem("carnet")}
                      onClick={handleOpenIntro}
                    />

                    <BourseMenuItem
                      text="Instruction Client"
                      active={hoveredItem === "instruction"}
                      onMouseEnter={() => setHoveredItem("instruction")}
                    />

                    <BourseMenuItem
                      text="Positions & Mouvements"
                      active={hoveredItem === "positions"}
                      onMouseEnter={() => setHoveredItem("positions")}
                    />

                    <BourseMenuItem
                      text="Gestion des Flux & Notifications"
                      active={hoveredItem === "flux"}
                      onMouseEnter={() => setHoveredItem("flux")}
                    />

                    <Box
                      sx={{
                        mt: 0.5,
                        height: 40,
                        bgcolor: "#10b7bf",
                        px: 1.5,
                        display: "flex",
                        alignItems: "center",
                        gap: 1.2,
                      }}
                    >
                      <AccountBalanceOutlinedIcon
                        sx={{ fontSize: 24, color: "#fff" }}
                      />
                      <Typography
                        sx={{
                          color: "#fff",
                          fontSize: 18,
                          fontWeight: 700,
                        }}
                      >
                        Bourse
                      </Typography>
                    </Box>

                    {showSubMenu && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 58,
                          left: 258,
                          width: 136,
                          bgcolor: "#fff",
                          boxShadow: "0 6px 16px rgba(0,0,0,0.14)",
                          borderRadius: 1,
                          overflow: "hidden",
                          zIndex: 25,
                        }}
                      >
                        <SubMenuItem text="Ordre de l’IPO" onClick={handleOpenCollecte} />
                        <SubMenuItem text="Réservation espèces" />
                        <SubMenuItem text="Ipo" onClick={handleOpenIpo} />
                      </Box>
                    )}
                  </Box>
                )}
              </MainCard>
            </Box>

            <MainCard
              title="OTC"
              icon={<HandshakeOutlinedIcon sx={{ fontSize: 60 }} />}
            />

            <MainCard
              title="OPCVM"
              icon={<PaymentsOutlinedIcon sx={{ fontSize: 60 }} />}
            />

            <MainCard
              title="FRANCO"
              icon={<WalletOutlinedIcon sx={{ fontSize: 60 }} />}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 3.5,
            }}
          >
            <MainCard
              title=""
              large
              icon={<CampaignOutlinedIcon sx={{ fontSize: 78 }} />}
            />
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 135px)",
              justifyContent: "center",
              gap: 2,
              pb: 3,
            }}
          >
            <SmallCard
              title={"Référentiel\nCommun"}
              icon={<SettingsOutlinedIcon sx={{ fontSize: 40 }} />}
            />
            <SmallCard
              title="Facturations"
              icon={<ReceiptLongOutlinedIcon sx={{ fontSize: 40 }} />}
            />
            <SmallCard
              title="Comptabilité"
              icon={<CalculateOutlinedIcon sx={{ fontSize: 40 }} />}
            />
            <SmallCard
              title="Rapports"
              icon={<CalendarMonthOutlinedIcon sx={{ fontSize: 40 }} />}
            />
            <SmallCard
              title={"Position &\nBalance"}
              icon={<BalanceOutlinedIcon sx={{ fontSize: 40 }} />}
            />
            <SmallCard
              title={"Valo &\nInventaire"}
              icon={<TrendingUpOutlinedIcon sx={{ fontSize: 40 }} />}
            />
            <SmallCard
              title={"Commission\net Fiscalité"}
              icon={<BubbleChartOutlinedIcon sx={{ fontSize: 40 }} />}
            />
          </Box>
    </Box>
  );
}

function BourseMenuItem({
  text,
  active,
  onMouseEnter,
  onClick,
}: {
  text: string;
  active?: boolean;
  onMouseEnter?: () => void;
  onClick?: () => void;
}) {
  return (
    <Box
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      sx={{
        height: 38,
        px: 1.8,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        bgcolor: active ? "#c8eff0" : "#fff",
        cursor: "pointer",
        color: "#4b5563",
        fontSize: 14,
        "&:hover": {
          bgcolor: "#c8eff0",
        },
      }}
    >
      <Typography sx={{ fontSize: 14 }}>{text}</Typography>
      <MoreVertRoundedIcon sx={{ fontSize: 17, color: "#7b8794" }} />
    </Box>
  );
}

function SubMenuItem({
  text,
  onClick,
}: {
  text: string;
  onClick?: () => void;
}) {
  return (
    <Box
      onClick={onClick}
      sx={{
        px: 1.6,
        py: 1.1,
        fontSize: 14,
        color: "#4b5563",
        cursor: "pointer",
        bgcolor: "#fff",
        "&:hover": {
          bgcolor: "#f1f5f9",
        },
      }}
    >
      {text}
    </Box>
  );
}