import { useState, useEffect } from "react";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  ListItemIcon,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../components/ipo/ConfirmDialog";
import { fetchOrdreList, validateOrdre, type OrdreRow } from "../api/ordreApi";

const headerButtonSx = {
  textTransform: "none",
  borderRadius: 2,
  px: 2,
  py: 1,
  fontWeight: 500,
  minWidth: 0,
};

export default function CollecteOrdreListPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<OrdreRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionsAnchorEl, setActionsAnchorEl] = useState<null | HTMLElement>(null);
  const [rowMenuAnchorEl, setRowMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [confirmValidateOpen, setConfirmValidateOpen] = useState(false);

  const actionsMenuOpen = Boolean(actionsAnchorEl);
  const rowMenuOpen = Boolean(rowMenuAnchorEl);

  // Load orders from API on mount
  useEffect(() => {
    setLoading(true);
    fetchOrdreList()
      .then((data) => { setRows(data); setError(null); })
      .catch((err) => {
        setError("Impossible de charger les ordres. Vérifiez que le backend est démarré.");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleOpenActionsMenu = (event: React.MouseEvent<HTMLElement>) =>
    setActionsAnchorEl(event.currentTarget);
  const handleCloseActionsMenu = () => setActionsAnchorEl(null);

  const handleOpenRowMenu = (event: React.MouseEvent<HTMLElement>, rowId: number) => {
    setSelectedRowId(rowId);
    setRowMenuAnchorEl(event.currentTarget);
  };
  const handleCloseRowMenu = () => setRowMenuAnchorEl(null);

  const handleValidateBulk = () => { handleCloseActionsMenu(); setConfirmValidateOpen(true); };
  const handleValidateRow = () => { handleCloseRowMenu(); setConfirmValidateOpen(true); };
  const handleEditRow = () => { handleCloseRowMenu(); navigate(`/collecte/edit/${selectedRowId}`); };
  const handleViewRow = () => { handleCloseRowMenu(); navigate(`/collecte/view/${selectedRowId}`); };

  const handleConfirmValidate = async () => {
    if (selectedRowId == null) return;
    try {
      await validateOrdre(selectedRowId);
      const data = await fetchOrdreList();
      setRows(data);
    } catch (err) {
      console.error("Validation failed", err);
    }
    setConfirmValidateOpen(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress sx={{ color: "#20b8c8" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ px: 2.5, pt: 5, textAlign: "center" }}>
        <Typography sx={{ color: "#ef4444", fontSize: 15 }}>{error}</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ px: 2.5, pt: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 2,
            borderBottom: "1px solid #e8edf2",
            pb: 2,
          }}
        >
          <Box>
            <Typography sx={{ fontSize: 24, fontWeight: 700, color: "#111827", mb: 0.5 }}>
              Collecte D'ordre IPO
            </Typography>
            <Typography sx={{ fontSize: 14, color: "#7b8794" }}>
              Liste Collecte D'ordre IPO
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <Button
              variant="outlined"
              endIcon={<KeyboardArrowDownRoundedIcon />}
              onClick={handleOpenActionsMenu}
              sx={{ ...headerButtonSx, borderColor: "#33b7c9", color: "#33b7c9", bgcolor: "#fff" }}
            >
              Actions
            </Button>
            <Button
              variant="outlined"
              startIcon={<FilterListRoundedIcon />}
              sx={{ ...headerButtonSx, borderColor: "#33b7c9", color: "#33b7c9", bgcolor: "#fff" }}
            >
              Filtres
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate("/collecte/create")}
              sx={{
                ...headerButtonSx, px: 2.5, bgcolor: "#20b8c8", color: "#fff", boxShadow: "none",
                "&:hover": { bgcolor: "#18aab8", boxShadow: "none" },
              }}
            >
              Nouveau Ordre
            </Button>
          </Box>
        </Box>

        <Box sx={{ mt: 3, bgcolor: "#fff" }}>
          {/* Table header */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "70px 1.2fr 1fr 1.2fr 1.2fr 1fr 80px",
              alignItems: "center",
              minHeight: 54,
              bgcolor: "#eef4f6",
              borderBottom: "1px solid #edf2f6",
              px: 1,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "center" }}><Checkbox /></Box>
            <HeaderCell text="Identifiant ↓" />
            <HeaderCell text="Quantité" />
            <HeaderCell text="Donneur d'ordre" />
            <HeaderCell text="Membre négociateur" />
            <HeaderCell text="Status" />
            <Box />
          </Box>

          {/* Data rows */}
          {rows.length === 0 ? (
            <Box sx={{ px: 2, py: 4, textAlign: "center" }}>
              <Typography sx={{ fontSize: 14, color: "#9aa6b2" }}>
                Aucun ordre trouvé. Créez votre premier ordre.
              </Typography>
            </Box>
          ) : (
            rows.map((row) => (
              <Box
                key={row.id}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "70px 1.2fr 1fr 1.2fr 1.2fr 1fr 80px",
                  alignItems: "center",
                  minHeight: 54,
                  borderBottom: "1px solid #edf2f6",
                  px: 1,
                  bgcolor: "#fff",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Checkbox
                    checked={selectedRowId === row.id}
                    onChange={() =>
                      setSelectedRowId((prev) => (prev === row.id ? null : row.id))
                    }
                  />
                </Box>
                <BodyCell text={row.reference ?? String(row.id)} />
                <BodyCell text={row.quantite != null ? String(row.quantite) : "—"} />
                <BodyCell text={row.clientLabel ?? "—"} />
                <BodyCell text={row.societeBourse ?? "—"} />
                <BodyCell text={row.status} />
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <IconButton size="small" onClick={(e) => handleOpenRowMenu(e, row.id)}>
                    <MoreVertRoundedIcon sx={{ color: "#6f7c8b" }} />
                  </IconButton>
                </Box>
              </Box>
            ))
          )}

          {/* Footer */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", px: 2, py: 1.5 }}>
            <Typography sx={{ fontSize: 14, color: "#4b5563" }}>
              {rows.length} résultat{rows.length !== 1 ? "s" : ""}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Actions menu */}
      <Menu
        anchorEl={actionsAnchorEl}
        open={actionsMenuOpen}
        onClose={handleCloseActionsMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{ paper: { sx: { mt: 0.5, minWidth: 120, borderRadius: 1, boxShadow: "0 6px 16px rgba(0,0,0,0.14)" } } }}
      >
        <MenuItem onClick={handleValidateBulk} sx={{ fontSize: 15, color: "#2f3a45", minHeight: 42 }}>
          Valider
        </MenuItem>
      </Menu>

      {/* Row context menu */}
      <Menu
        anchorEl={rowMenuAnchorEl}
        open={rowMenuOpen}
        onClose={handleCloseRowMenu}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { minWidth: 170, borderRadius: 1, boxShadow: "0 6px 16px rgba(0,0,0,0.14)", overflow: "hidden" } } }}
      >
        <MenuItem onClick={handleValidateRow} sx={{ py: 1.25 }}>
          <ListItemIcon sx={{ minWidth: 34 }}>
            <CheckCircleOutlineRoundedIcon sx={{ fontSize: 20, color: "#5663a8" }} />
          </ListItemIcon>
          <Typography sx={{ fontSize: 15, fontWeight: 500, color: "#4b5563" }}>VALIDER</Typography>
        </MenuItem>
        <MenuItem onClick={handleEditRow} sx={{ py: 1.25 }}>
          <ListItemIcon sx={{ minWidth: 34 }}>
            <EditOutlinedIcon sx={{ fontSize: 20, color: "#5663a8" }} />
          </ListItemIcon>
          <Typography sx={{ fontSize: 15, fontWeight: 500, color: "#4b5563" }}>MODIFIER</Typography>
        </MenuItem>
        <MenuItem onClick={handleViewRow} sx={{ py: 1.25 }}>
          <ListItemIcon sx={{ minWidth: 34 }}>
            <RemoveRedEyeOutlinedIcon sx={{ fontSize: 20, color: "#5663a8" }} />
          </ListItemIcon>
          <Typography sx={{ fontSize: 15, fontWeight: 500, color: "#4b5563" }}>CONSULTER</Typography>
        </MenuItem>
      </Menu>

      <ConfirmDialog
        open={confirmValidateOpen}
        title="Confirmer la validation"
        message="Voulez-vous vraiment valider cet ordre IPO ?"
        confirmLabel="Oui, valider"
        cancelLabel="Retour"
        onConfirm={handleConfirmValidate}
        onCancel={() => setConfirmValidateOpen(false)}
      />
    </>
  );
}

function HeaderCell({ text }: { text: string }) {
  return (
    <Typography sx={{ fontSize: 14, fontWeight: 500, color: "#506070" }}>
      {text}
    </Typography>
  );
}

function BodyCell({ text }: { text: string }) {
  return (
    <Typography sx={{ fontSize: 14, color: "#7b8794" }}>
      {text}
    </Typography>
  );
}

