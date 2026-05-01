import {
  Box,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import type { IpoDetailsData, OfferType } from "../../types/ipo";

type IpoDetailsFormProps = {
  value: IpoDetailsData;
  onChange: (nextValue: IpoDetailsData) => void;
};

export default function IpoDetailsForm({
  value,
  onChange,
}: IpoDetailsFormProps) {
  const updateField = <K extends keyof IpoDetailsData>(
    field: K,
    fieldValue: IpoDetailsData[K]
  ) => {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  };

  const setOfferType = (offerType: OfferType) => {
    updateField("offerType", offerType);
  };
  
  const onlyDigits = (input: string) => input.replace(/\D/g, "");

  return (
    <Box
      sx={{
        bgcolor: "#fff",
        border: "1px solid #e6edf2",
        borderRadius: 1.5,
        p: 2,
      }}
    >
      <Typography
        variant="body1"
        sx={{
          fontWeight: 600,
          color: "#6a7a89",
          mb: 2,
        }}
      >
        Détails
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 3,
          alignItems: "center",
          mb: 2,
          flexWrap: "wrap",
        }}
      >
        <Typography
          variant="body2"
          sx={{ color: "#18b8c8", fontWeight: 700 }}
        >
          • Type de l’offre :
        </Typography>

        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Typography variant="body2" sx={{ color: "#4d5a68" }}>
            À prix ferme
          </Typography>
          <Box
            onClick={() => setOfferType("fixed")}
            sx={switchStyle(value.offerType === "fixed")}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Typography variant="body2" sx={{ color: "#4d5a68" }}>
            À prix variable
          </Typography>
          <Box
            onClick={() => setOfferType("variable")}
            sx={switchStyle(value.offerType === "variable")}
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 2,
        }}
      >
        <FormControl fullWidth size="small">
          <Select
            value={value.natureTitre}
            displayEmpty
            onChange={(e) => updateField("natureTitre", String(e.target.value))}
            sx={fieldStyle}
          >
            <MenuItem value="">Nature de Titre</MenuItem>
            <MenuItem value="action">Action</MenuItem>
            <MenuItem value="obligation">Obligation</MenuItem>
            <MenuItem value="titre-participatif">Titre participatif</MenuItem>
          </Select>
        </FormControl>

        <TextField
            fullWidth
            size="small"
            placeholder="Prix de souscription"
            value={value.prixSouscription}
            onChange={(e) =>
                updateField("prixSouscription", onlyDigits(e.target.value))
  }
  sx={textFieldSx}
/>

        <TextField
            fullWidth
            size="small"
            placeholder="Nombre de nouvelles actions à émettre"
            value={value.nbNouvellesActions}
            onChange={(e) =>
                updateField("nbNouvellesActions", onlyDigits(e.target.value))
            }
  sx={textFieldSx}
/>

        <TextField
          fullWidth
          size="small"
          placeholder="Montant global de l’opération"
          value={value.montantGlobalOperation}
          onChange={(e) =>
            updateField("montantGlobalOperation", e.target.value)
          }
          sx={textFieldSx}
        />

        <TextField
  fullWidth
  size="small"
  placeholder="Valeur nominale"
  value={value.valeurNominale}
  onChange={(e) =>
    updateField("valeurNominale", onlyDigits(e.target.value))
  }
  sx={textFieldSx}
/>

        <TextField
  fullWidth
  size="small"
  type="date"
  value={value.periodeDebutSouscription}
  onChange={(e) =>
    updateField("periodeDebutSouscription", e.target.value)
  }
  sx={textFieldSx}
/>

        <TextField
  fullWidth
  size="small"
  type="datetime-local"
  value={value.periodeFinSouscription}
  onChange={(e) =>
    updateField("periodeFinSouscription", e.target.value)
  }
  sx={textFieldSx}
/>

        <TextField
  fullWidth
  size="small"
  placeholder="Nombre d’actions à céder"
  value={value.nbActionsCeder}
  onChange={(e) =>
    updateField("nbActionsCeder", onlyDigits(e.target.value))
  }
  sx={textFieldSx}
/>

        <TextField
  fullWidth
  size="small"
  type="date"
  value={value.dateVisaAmmc}
  onChange={(e) => updateField("dateVisaAmmc", e.target.value)}
  sx={textFieldSx}
/>

        <TextField
          fullWidth
          size="small"
          placeholder="Référence Visa AMMC"
          value={value.referenceVisaAmmc}
          onChange={(e) => updateField("referenceVisaAmmc", e.target.value)}
          sx={textFieldSx}
        />
      </Box>
    </Box>
  );
}

const textFieldSx = {
  "& .MuiOutlinedInput-root": {
    bgcolor: "#fff",
    borderRadius: 1,
    fontSize: 14,
  },
  "& .MuiInputBase-input::placeholder": {
    color: "#8a97a5",
    opacity: 1,
  },
  "& input[type='date']": {
    color: "#4d5a68",
  },
  "& input[type='datetime-local']": {
    color: "#4d5a68",
  },
};

const fieldStyle = {
  borderRadius: 1,
  fontSize: 14,
  color: "#8a97a5",
};

const switchStyle = (active: boolean) => ({
  width: 18,
  height: 10,
  borderRadius: 999,
  bgcolor: active ? "#19bccb" : "#d7dee5",
  position: "relative",
  cursor: "pointer",
  "&::after": {
    content: '""',
    position: "absolute",
    top: 1,
    left: active ? 9 : 1,
    width: 8,
    height: 8,
    borderRadius: "50%",
    bgcolor: "#fff",
    transition: "all 0.2s ease",
  },
  
});
