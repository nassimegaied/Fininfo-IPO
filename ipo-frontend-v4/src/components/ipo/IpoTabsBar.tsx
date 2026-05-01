import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Box, IconButton, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import CorporateTabContent from "./CorporateTabContent";
import SyndicateTabContent from "./SyndicateTabContent";
import TrancheTabContent from "./TrancheTabContent";
import ConfirmDialog from "./ConfirmDialog";
import type {
  CorporateTabData,
  SyndicateTabData,
  TrancheData,
} from "../../types/ipo";

type TabId = "corporate" | "syndicate" | string;

type IpoTabsBarProps = {
  corporateValue: CorporateTabData;
  onCorporateChange: (nextValue: CorporateTabData) => void;
  syndicateValue: SyndicateTabData;
  onSyndicateChange: (nextValue: SyndicateTabData) => void;
  tranches: TrancheData[];
  onAddTranche: () => void;
  onUpdateTranche: (trancheId: string, nextTranche: TrancheData) => void;
  onDeleteTranche: (trancheId: string) => void;
};

export default function IpoTabsBar({
  corporateValue,
  onCorporateChange,
  syndicateValue,
  onSyndicateChange,
  tranches,
  onAddTranche,
  onUpdateTranche,
  onDeleteTranche,
}: IpoTabsBarProps) {
  const [activeTab, setActiveTab] = useState<TabId>("corporate");
  const [editingTrancheId, setEditingTrancheId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [trancheToDelete, setTrancheToDelete] = useState<TrancheData | null>(null);

  useEffect(() => {
    if (activeTab === "corporate" || activeTab === "syndicate") return;

    const activeStillExists = tranches.some((tranche) => tranche.id === activeTab);

    if (!activeStillExists) {
      setActiveTab("corporate");
    }
  }, [tranches, activeTab]);

  const activeTranche =
    tranches.find((tranche) => tranche.id === activeTab) ?? null;

  const startRename = (tranche: TrancheData) => {
    setEditingTrancheId(tranche.id);
    setEditingLabel(tranche.label);
  };

  const cancelRename = () => {
    setEditingTrancheId(null);
    setEditingLabel("");
  };

  const confirmRename = (tranche: TrancheData) => {
    const trimmed = editingLabel.trim();

    if (!trimmed) {
      cancelRename();
      return;
    }

    onUpdateTranche(tranche.id, {
      ...tranche,
      label: trimmed,
    });

    cancelRename();
  };

  const openDeleteDialog = (tranche: TrancheData) => {
    setTrancheToDelete(tranche);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setTrancheToDelete(null);
  };

  const confirmDeleteTranche = () => {
    if (!trancheToDelete) return;
    onDeleteTranche(trancheToDelete.id);
    closeDeleteDialog();
  };

  return (
    <>
      <Box
        sx={{
          bgcolor: "#fff",
          border: "1px solid #e6edf2",
          borderRadius: 1.5,
          overflow: "hidden",
        }}
      >
        <Box sx={{ display: "flex", flexWrap: "nowrap", overflowX: "auto" }}>
          <Box
            onClick={() => setActiveTab("corporate")}
            sx={tabStyle(activeTab === "corporate", true)}
          >
            <Typography sx={tabTextStyle(activeTab === "corporate")}>
              Personnel corporate
            </Typography>
          </Box>

          <Box
            onClick={() => setActiveTab("syndicate")}
            sx={tabStyle(activeTab === "syndicate", true)}
          >
            <Typography sx={tabTextStyle(activeTab === "syndicate")}>
              Personnel de syndicat de placement
            </Typography>
          </Box>

          {tranches.map((tranche) => {
            const active = activeTab === tranche.id;
            const isEditing = editingTrancheId === tranche.id;

            return (
              <Box
                key={tranche.id}
                sx={{
                  ...tabStyle(active, false),
                  minWidth: 290,
                  flex: "0 0 290px",
                  justifyContent: "space-between",
                  gap: 1,
                  px: 1.25,
                }}
              >
                {isEditing ? (
                  <>
                    <TextField
                      size="small"
                      value={editingLabel}
                      onChange={(e) => setEditingLabel(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          confirmRename(tranche);
                        }
                        if (e.key === "Escape") {
                          cancelRename();
                        }
                      }}
                      autoFocus
                      sx={{
                        flex: 1,
                        "& .MuiOutlinedInput-root": {
                          height: 32,
                          bgcolor: "#fff",
                          fontSize: 13,
                        },
                      }}
                    />

                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmRename(tranche);
                        }}
                        sx={{
                          color: active ? "#fff" : "#24b8c8",
                        }}
                      >
                        <CheckRoundedIcon fontSize="small" />
                      </IconButton>

                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          cancelRename();
                        }}
                        sx={{
                          color: active ? "#fff" : "#24b8c8",
                        }}
                      >
                        <CloseRoundedIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </>
                ) : (
                  <>
                    <Box
                      onClick={() => setActiveTab(tranche.id)}
                      sx={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        minWidth: 0,
                      }}
                    >
                      <Typography
                        sx={{
                          ...tabTextStyle(active),
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {tranche.label}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          startRename(tranche);
                        }}
                        sx={{
                          color: active ? "#fff" : "#24b8c8",
                        }}
                      >
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>

                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteDialog(tranche);
                        }}
                        sx={{
                          color: active ? "#fff" : "#24b8c8",
                        }}
                      >
                        <DeleteOutlineRoundedIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </>
                )}
              </Box>
            );
          })}

          <Box
            onClick={onAddTranche}
            sx={{
              ...tabStyle(false, false),
              minWidth: 280,
              flex: "0 0 280px",
              color: "#24b8c8",
              gap: 1,
            }}
          >
            <AddCircleOutlineRoundedIcon sx={{ fontSize: 20 }} />
            <Typography sx={{ fontSize: 15, fontWeight: 500 }}>
              Nouvelle tranche
            </Typography>
          </Box>
        </Box>

        <Box sx={{ bgcolor: "#fff" }}>
          {activeTab === "corporate" && (
            <CorporateTabContent
              value={corporateValue}
              onChange={onCorporateChange}
            />
          )}

          {activeTab === "syndicate" && (
            <SyndicateTabContent
              value={syndicateValue}
              onChange={onSyndicateChange}
            />
          )}

          {activeTranche && (
            <TrancheTabContent
              value={activeTranche}
              onChange={(nextTranche) =>
                onUpdateTranche(activeTranche.id, nextTranche)
              }
            />
          )}
        </Box>
      </Box>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Confirmer la suppression"
        message={
          trancheToDelete
            ? `Voulez-vous vraiment supprimer ${trancheToDelete.label} ?`
            : "Voulez-vous vraiment supprimer cette tranche ?"
        }
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        onConfirm={confirmDeleteTranche}
        onCancel={closeDeleteDialog}
      />
    </>
  );
}

function tabStyle(active: boolean, flexFill: boolean) {
  return {
    flex: flexFill ? "1 1 0" : undefined,
    minWidth: flexFill ? 350 : undefined,
    px: 3,
    py: 1.2,
    bgcolor: active ? "#19bccb" : "#fff",
    color: active ? "#fff" : "#24b8c8",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid #edf2f6",
  };
}

function tabTextStyle(active: boolean) {
  return {
    fontSize: 15,
    fontWeight: active ? 600 : 500,
  };
}