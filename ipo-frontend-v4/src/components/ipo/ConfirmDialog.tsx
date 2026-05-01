import { Box, Button, Dialog, DialogContent, Typography } from "@mui/material";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      fullWidth
      maxWidth="xs"
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 3,
          overflow: "hidden",
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          <Typography
            sx={{
              fontSize: 22,
              fontWeight: 700,
              color: "#5f6f7f",
              textAlign: "center",
              mb: 2,
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              fontSize: 15,
              color: "#6f7d8a",
              textAlign: "center",
              mb: 3,
              lineHeight: 1.6,
            }}
          >
            {message}
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 1.5,
            }}
          >
            <Button
              variant="outlined"
              onClick={onCancel}
              sx={{
                textTransform: "none",
                borderColor: "#33b7c9",
                color: "#33b7c9",
                px: 3,
                py: 1,
                borderRadius: 2,
                fontWeight: 500,
              }}
            >
              {cancelLabel}
            </Button>

            <Button
              variant="contained"
              onClick={onConfirm}
              sx={{
                textTransform: "none",
                bgcolor: "#20b8c8",
                px: 3,
                py: 1,
                borderRadius: 2,
                fontWeight: 600,
                boxShadow: "none",
                "&:hover": {
                  bgcolor: "#17a9b8",
                  boxShadow: "none",
                },
              }}
            >
              {confirmLabel}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}