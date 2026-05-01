import React, { useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";

type ImportFileModalProps = {
  open: boolean;
  onClose: () => void;
  onImport?: (payload: {
    file: File | null;
    commentaire: string;
    statut: string;
    dateDebut: string;
    dateFin: string;
  }) => void;
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    height: 44,
    backgroundColor: "#fff",
    fontSize: 14,
  },
  "& .MuiInputBase-input::placeholder": {
    color: "#9aa6b2",
    opacity: 1,
  },
};

export default function ImportFileModal({
  open,
  onClose,
  onImport,
}: ImportFileModalProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [commentaire, setCommentaire] = useState("");
  const [statut, setStatut] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");

  const canImport = useMemo(() => {
    return !!selectedFile && !!statut;
  }, [selectedFile, statut]);

  const resetForm = () => {
    setSelectedFile(null);
    setCommentaire("");
    setStatut("");
    setDateDebut("");
    setDateFin("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0] ?? null;
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleImport = () => {
    if (!canImport) return;

    const payload = {
      file: selectedFile,
      commentaire,
      statut,
      dateDebut,
      dateFin,
    };

    if (onImport) {
      onImport(payload);
    } else {
      console.log("Import payload:", payload);
    }

    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            px: 2.5,
            py: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #eef2f5",
          }}
        >
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 700,
              color: "#1eb6c6",
            }}
          >
            Importer un fichier
          </Typography>

          <IconButton onClick={handleClose} size="small">
            <CloseIcon sx={{ color: "#2f80ed" }} />
          </IconButton>
        </Box>

        <Box sx={{ px: 2.5, pt: 2, pb: 2.5 }}>
          <input
            ref={fileInputRef}
            type="file"
            hidden
            onChange={handleSelectFile}
          />

          <Box
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            sx={{
              border: "2px dashed #56c9c5",
              borderRadius: 2,
              backgroundColor: "#f7fbfb",
              minHeight: 135,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 1.5,
              cursor: "pointer",
              mb: 2,
              textAlign: "center",
              px: 2,
            }}
          >
            <CloudUploadOutlinedIcon
              sx={{ color: "#56c9c5", fontSize: 32 }}
            />

            {selectedFile ? (
              <>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#2f3a45" }}>
                  {selectedFile.name}
                </Typography>
                <Typography sx={{ fontSize: 13, color: "#7b8794" }}>
                  Cliquez pour changer le fichier
                </Typography>
              </>
            ) : (
              <>
                <Typography sx={{ fontSize: 14, color: "#4d5a68" }}>
                  Cliquez pour sélectionner un fichier
                </Typography>
                <Typography sx={{ fontSize: 14, color: "#4d5a68" }}>
                  ou glissez-déposez votre fichier ici
                </Typography>
              </>
            )}
          </Box>

          <TextField
            fullWidth
            multiline
            minRows={3}
            placeholder="Commentaire"
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#fff",
                fontSize: 14,
              },
              "& .MuiInputBase-input::placeholder": {
                color: "#9aa6b2",
                opacity: 1,
              },
            }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <Select
              displayEmpty
              value={statut}
              onChange={(e) => setStatut(e.target.value)}
              sx={{
                height: 44,
                backgroundColor: "#fff",
                fontSize: 14,
                "& .MuiSelect-select": {
                  color: statut ? "#2f3a45" : "#9aa6b2",
                },
              }}
              renderValue={(selected) => {
                if (!selected) {
                  return "Statut";
                }
                return selected;
              }}
            >
              <MenuItem value="Actif">Actif</MenuItem>
              <MenuItem value="Inactif">Inactif</MenuItem>
              <MenuItem value="Brouillon">Brouillon</MenuItem>
              <MenuItem value="Archivé">Archivé</MenuItem>
            </Select>
          </FormControl>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 1.5,
              mb: 3,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: 12,
                  color: "#7b8794",
                  mb: 0.5,
                }}
              >
                Date de validité (début)
              </Typography>
              <Box sx={{ position: "relative" }}>
                <TextField
                  fullWidth
                  type="date"
                  value={dateDebut}
                  onChange={(e) => setDateDebut(e.target.value)}
                  sx={fieldSx}
                />
                <CalendarTodayOutlinedIcon
                  sx={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#6b7785",
                    pointerEvents: "none",
                    fontSize: 18,
                  }}
                />
              </Box>
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: 12,
                  color: "#7b8794",
                  mb: 0.5,
                }}
              >
                Date de validité (fin)
              </Typography>
              <Box sx={{ position: "relative" }}>
                <TextField
                  fullWidth
                  type="date"
                  value={dateFin}
                  onChange={(e) => setDateFin(e.target.value)}
                  sx={fieldSx}
                />
                <CalendarTodayOutlinedIcon
                  sx={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#6b7785",
                    pointerEvents: "none",
                    fontSize: 18,
                  }}
                />
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 1.25,
            }}
          >
            <Button
              variant="outlined"
              onClick={handleClose}
              sx={{
                minWidth: 110,
                height: 40,
                borderColor: "#56c9c5",
                color: "#56c9c5",
                fontWeight: 700,
                textTransform: "none",
              }}
            >
              ANNULER
            </Button>

            <Button
              variant="contained"
              onClick={handleImport}
              disabled={!canImport}
              sx={{
                minWidth: 110,
                height: 40,
                backgroundColor: "#d9d9d9",
                color: "#fff",
                fontWeight: 700,
                textTransform: "none",
                boxShadow: "none",
                "&.Mui-disabled": {
                  backgroundColor: "#d9d9d9",
                  color: "#f8f8f8",
                },
                "&:not(.Mui-disabled)": {
                  backgroundColor: "#56c9c5",
                },
              }}
            >
              IMPORTER
            </Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}