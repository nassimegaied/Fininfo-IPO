import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useMemo, useState } from "react";

type Candidate = {
  id: string;
  name: string;
};

type ParticipantSelectionModalProps = {
  open: boolean;
  title: string;
  candidates: Candidate[];
  onClose: () => void;
  onValidate: (candidate: Candidate | null) => void;
};

export default function ParticipantSelectionModal({
  open,
  title,
  candidates,
  onClose,
  onValidate,
}: ParticipantSelectionModalProps) {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredCandidates = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return candidates;
    return candidates.filter((candidate) =>
      candidate.name.toLowerCase().includes(query)
    );
  }, [search, candidates]);

  const selectedCandidate =
    candidates.find((candidate) => candidate.id === selectedId) ?? null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 3,
          overflow: "hidden",
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2.5,
              position: "relative",
            }}
          >
            <Typography
              sx={{
                fontSize: 24,
                fontWeight: 700,
                color: "#5f6f7f",
                textTransform: "uppercase",
                mx: "auto",
                textAlign: "center",
              }}
            >
              {title}
            </Typography>

            <IconButton
              onClick={onClose}
              sx={{
                position: "absolute",
                right: 0,
                top: 0,
                color: "#33b7c9",
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ position: "relative", mb: 2.5 }}>
            <Box
              sx={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                display: "flex",
                alignItems: "center",
                pointerEvents: "none",
                zIndex: 1,
              }}
            >
              <SearchIcon sx={{ color: "#738191", fontSize: 20 }} />
            </Box>

            <TextField
              fullWidth
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  bgcolor: "#fff",
                  fontSize: 15,
                },
                "& .MuiInputBase-input": {
                  pl: 5,
                },
              }}
            />
          </Box>

          <Box
            sx={{
              minHeight: 220,
              borderRadius: 1.5,
            }}
          >
            {filteredCandidates.length === 0 ? (
              <Typography sx={{ color: "#7a8699", fontSize: 14 }}>
                Aucun résultat trouvé.
              </Typography>
            ) : (
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                {filteredCandidates.map((candidate) => {
                  const active = candidate.id === selectedId;

                  return (
                    <Box
                      key={candidate.id}
                      onClick={() => setSelectedId(candidate.id)}
                      sx={{
                        width: 120,
                        borderRadius: 2,
                        border: active
                          ? "2px solid #33b7c9"
                          : "1px solid #e5edf2",
                        p: 1.5,
                        cursor: "pointer",
                        textAlign: "center",
                        transition: "0.2s ease",
                        "&:hover": {
                          borderColor: "#33b7c9",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          border: "1px solid #d6e2e8",
                          ml: "auto",
                          mb: 2,
                          bgcolor: active ? "#33b7c9" : "#fff",
                        }}
                      />
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: 2,
                          bgcolor: "#fafcfd",
                          border: "1px solid #eef3f6",
                          mx: "auto",
                          mb: 1.5,
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: 15,
                          color: "#5f6f7f",
                          wordBreak: "break-word",
                        }}
                      >
                        {candidate.name}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 3,
            }}
          >
            <Button
              variant="contained"
              onClick={() => onValidate(selectedCandidate)}
              disabled={!selectedCandidate}
              sx={{
                textTransform: "none",
                bgcolor: "#20b8c8",
                px: 4,
                py: 1.1,
                borderRadius: 2,
                fontWeight: 600,
                boxShadow: "none",
                "&:hover": {
                  bgcolor: "#17a9b8",
                  boxShadow: "none",
                },
                "&.Mui-disabled": {
                  bgcolor: "#bfe8ee",
                  color: "#fff",
                },
              }}
            >
              Valider
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}