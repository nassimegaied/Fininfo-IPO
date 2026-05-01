import { Box, Button, IconButton, Typography } from "@mui/material";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useMemo, useState } from "react";
import ParticipantSelectionModal from "./ParticipantSelectionModal";
import type { IpoParticipantsData, ParticipantCandidate } from "../../types/ipo";

type ParticipantRole = {
  key: keyof IpoParticipantsData;
  label: string;
  multi: boolean;
};

type OperationParticipantsPanelProps = {
  value: IpoParticipantsData;
  onChange: (nextValue: IpoParticipantsData) => void;
};

const roles: ParticipantRole[] = [
  {
    key: "conseiller",
    label: "Conseiller financier & coordinateur global",
    multi: false,
  },
  {
    key: "chef",
    label: "Chef du file du syndicat de placement",
    multi: false,
  },
  {
    key: "coChef",
    label: "Co-Chef du file du syndicat de placement",
    multi: true,
  },
  {
    key: "membre",
    label: "Membre du syndicat de placement",
    multi: true,
  },
];

const mockCandidatesByRole: Record<string, ParticipantCandidate[]> = {
  conseiller: [
    { id: "c1", name: "JOKER" },
    { id: "c2", name: "Client-Fake" },
  ],
  chef: [
    { id: "c3", name: "Chef Alpha" },
    { id: "c4", name: "Chef Beta" },
  ],
  coChef: [
    { id: "c5", name: "Co-Chef 01" },
    { id: "c6", name: "Co-Chef 02" },
  ],
  membre: [
    { id: "c7", name: "Membre 01" },
    { id: "c8", name: "Membre 02" },
  ],
};

export default function OperationParticipantsPanel({
  value,
  onChange,
}: OperationParticipantsPanelProps) {
  const [modalRoleKey, setModalRoleKey] = useState<keyof IpoParticipantsData | null>(null);

  const activeRole = useMemo(
    () => roles.find((role) => role.key === modalRoleKey) ?? null,
    [modalRoleKey]
  );

  const modalCandidates = activeRole
    ? mockCandidatesByRole[activeRole.key] ?? []
    : [];

  const handleValidateParticipant = (candidate: ParticipantCandidate | null) => {
    if (!candidate || !activeRole) {
      setModalRoleKey(null);
      return;
    }

    const current = value[activeRole.key] ?? [];

    if (!activeRole.multi) {
      onChange({
        ...value,
        [activeRole.key]: [candidate],
      });
      setModalRoleKey(null);
      return;
    }

    const alreadyExists = current.some((item) => item.id === candidate.id);

    onChange({
      ...value,
      [activeRole.key]: alreadyExists ? current : [...current, candidate],
    });

    setModalRoleKey(null);
  };

  const handleDeleteParticipant = (
    roleKey: keyof IpoParticipantsData,
    candidateId: string
  ) => {
    onChange({
      ...value,
      [roleKey]: (value[roleKey] ?? []).filter(
        (candidate) => candidate.id !== candidateId
      ),
    });
  };

  return (
    <>
      <Box
        sx={{
          bgcolor: "#fff",
          border: "1px solid #e6edf2",
          borderRadius: 1.5,
          p: 2,
          height: "100%",
        }}
      >
        <Typography
          variant="body1"
          sx={{ fontWeight: 600, color: "#6a7a89", mb: 2 }}
        >
          Intervenants de l’opération
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
          {roles.map((role, index) => {
            const selected = value[role.key] ?? [];

            return (
              <Box
                key={role.key}
                sx={{
                  border: "1px solid #edf2f6",
                  borderRadius: 1,
                  px: 1.25,
                  py: 1.2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1.5,
                  }}
                >
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    {index >= 2 ? (
                      <Groups2OutlinedIcon sx={{ fontSize: 18, color: "#7b8794" }} />
                    ) : (
                      <PersonOutlineOutlinedIcon sx={{ fontSize: 18, color: "#7b8794" }} />
                    )}

                    <Typography
                      variant="body2"
                      sx={{ color: "#66727f", fontSize: 13.5 }}
                    >
                      {role.label}
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    onClick={() => setModalRoleKey(role.key)}
                    sx={{
                      textTransform: "none",
                      minWidth: 120,
                      bgcolor: "#b7b7b7",
                      color: "#fff",
                      borderRadius: 1.5,
                      boxShadow: "none",
                      "&:hover": {
                        bgcolor: "#a5a5a5",
                        boxShadow: "none",
                      },
                    }}
                  >
                    Selectionner
                  </Button>
                </Box>

                {selected.length > 0 && (
                  <Box sx={{ mt: 1.2, display: "grid", gap: 0.8 }}>
                    {selected.map((candidate) => (
                      <Box
                        key={candidate.id}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          pl: 4,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: 13.5,
                            color: "#66727f",
                            fontWeight: 500,
                          }}
                        >
                          {candidate.name}
                        </Typography>

                        <Box sx={{ display: "flex", gap: 0.5 }}>
                          <IconButton
                            size="small"
                            sx={{ color: "#a0adb8" }}
                            onClick={() => setModalRoleKey(role.key)}
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>

                          <IconButton
                            size="small"
                            sx={{ color: "#a0adb8" }}
                            onClick={() =>
                              handleDeleteParticipant(role.key, candidate.id)
                            }
                          >
                            <DeleteOutlineOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      </Box>

      <ParticipantSelectionModal
        open={Boolean(activeRole)}
        title="Veuillez sélectionner les membres du syndicat de placement"
        candidates={modalCandidates}
        onClose={() => setModalRoleKey(null)}
        onValidate={handleValidateParticipant}
      />
    </>
  );
}