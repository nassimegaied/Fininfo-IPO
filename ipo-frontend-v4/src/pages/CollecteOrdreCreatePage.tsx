import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import ConfirmDialog from "../components/ipo/ConfirmDialog";
import {
  clients,
  instruments,
  societesBourse,
  typesOrdre,
  typesMarche,
  validitesOrdre,
  tranches,
} from "../mocks/apiData";

type CollecteOrdrePageMode = "create" | "edit" | "view";

type CollecteOrdreCreatePageProps = {
  mode?: CollecteOrdrePageMode;
};

type ClientOption = {
  id: string;
  label: string;
  compteEspeces: string;
  compteTitres: string;
  devise: string;
};

type InstrumentOption = {
  id: string;
  mnemonique: string;
  isin: string;
  codeValeur: string;
  description: string;
  groupeCotation: string;
  placeDenouement: string;
};

type TrancheOption = {
  id: string;
  label: string;
  referenceIpo: string;
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    height: 40,
    backgroundColor: "#fff",
    fontSize: 14,
  },
  "& .MuiInputBase-input::placeholder": {
    color: "#97a3af",
    opacity: 1,
  },
};

const readOnlyFieldSx = {
  ...fieldSx,
  "& .MuiOutlinedInput-root": {
    ...fieldSx["& .MuiOutlinedInput-root"],
    cursor: "default",
  },
  "& .MuiInputBase-input": {
    cursor: "default",
  },
};

function MiniSwitch({
  active = false,
  onClick,
}: {
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        width: 20,
        height: 10,
        borderRadius: 999,
        bgcolor: active ? "#20b8c8" : "#d4dbe2",
        position: "relative",
        display: "inline-block",
        border: "none",
        cursor: "pointer",
        p: 0,
        "&::after": {
          content: '""',
          position: "absolute",
          top: 1,
          left: active ? 10 : 1,
          width: 8,
          height: 8,
          borderRadius: "50%",
          bgcolor: "#fff",
        },
      }}
    />
  );
}

function ToggleChoice({
  text,
  active,
  onClick,
}: {
  text: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.6,
        border: "none",
        background: "transparent",
        cursor: "pointer",
        p: 0,
      }}
    >
      <Typography sx={switchTextSx}>{text}</Typography>
      <MiniSwitch active={active} />
    </Box>
  );
}

function SectionFrame({
  title,
  children,
  minHeight,
}: {
  title: string;
  children: React.ReactNode;
  minHeight?: number;
}) {
  return (
    <Box
      sx={{
        position: "relative",
        border: "2px solid #77d4d7",
        minHeight: minHeight ?? 280,
        px: 1.25,
        pt: 2.5,
        pb: 2,
        bgcolor: "#fff",
      }}
    >
      <Typography
        sx={{
          position: "absolute",
          top: -13,
          left: 14,
          px: 1,
          bgcolor: "#f7f9fb",
          color: "#56c2cb",
          fontSize: 14,
          fontWeight: 500,
        }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  );
}

export default function CollecteOrdreCreatePage({
  mode = "create",
}: CollecteOrdreCreatePageProps) {
  const navigate = useNavigate();
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";

  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);

  const [clientId, setClientId] = useState("");
  const [clientSujetReservation, setClientSujetReservation] = useState(false);

  const [referencePrincipale, setReferencePrincipale] = useState("");
  const [referenceOrdre, setReferenceOrdre] = useState("");
  const [quantite, setQuantite] = useState("");
  const [instrumentId, setInstrumentId] = useState("");
  const [societeBourse, setSocieteBourse] = useState("");
  const [sensOrdre, setSensOrdre] = useState<"" | "achat" | "vente">("");
  const [typeOrdre, setTypeOrdre] = useState("");
  const [typeMarche, setTypeMarche] = useState("");
  const [validiteOrdre, setValiditeOrdre] = useState("");
  const [prix, setPrix] = useState("");
  const [routage, setRoutage] = useState<"" | "oui" | "non">("");
  const [trancheId, setTrancheId] = useState("");

  const selectedClient = useMemo(
    () => clients.find((client) => client.id === clientId) ?? null,
    [clientId]
  );

  const selectedInstrument = useMemo(
    () => instruments.find((instrument) => instrument.id === instrumentId) ?? null,
    [instrumentId]
  );

  const selectedTranche = useMemo(
    () => tranches.find((tranche) => tranche.id === trancheId) ?? null,
    [trancheId]
  );

  const showPrixField = typeOrdre === "Ordre à déclenchement";

  const pageTitle = useMemo(() => {
    if (mode === "view") return "CONSULTATION COLLECTE D'ORDRE IPO";
    if (mode === "edit") return "MODIFICATION COLLECTE D'ORDRE IPO";
    return "COLLECTE D'ORDRE IPO";
  }, [mode]);

  const pageSubtitle = useMemo(() => {
    if (mode === "view") return "Consultation collecte d'ordre IPO";
    if (mode === "edit") return "Modification collecte d'ordre IPO";
    return "Formulaire collecte d'ordre IPO";
  }, [mode]);

  const handleSave = () => {
    if (isViewMode) return;
    console.log("Collecte ordre payload =", {
      clientId,
      clientSujetReservation,
      referencePrincipale,
      referenceOrdre,
      quantite,
      instrumentId,
      societeBourse,
      sensOrdre,
      typeOrdre,
      typeMarche,
      validiteOrdre,
      prix,
      routage,
      trancheId,
    });
  };

  const handleAskCancel = () => {
    if (isViewMode) {
      navigate("/collecte");
      return;
    }
    setConfirmCancelOpen(true);
  };

  const handleConfirmCancel = () => {
    setConfirmCancelOpen(false);
    navigate("/collecte");
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ px: 2.5, py: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              borderBottom: "1px solid #e6edf2",
              pb: 2,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#111827",
                  mb: 0.5,
                }}
              >
                {pageTitle}
              </Typography>
              <Typography
                sx={{
                  fontSize: 14,
                  color: "#7b8794",
                }}
              >
                {pageSubtitle}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 1.5 }}>
              <Button
                variant="outlined"
                onClick={handleAskCancel}
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
                {isViewMode ? "Retour" : "Annuler"}
              </Button>

              {!isViewMode && (
                <Button
                  variant="contained"
                  onClick={handleSave}
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
                  {isEditMode ? "Mettre à jour" : "Sauvegarder"}
                </Button>
              )}
            </Box>
          </Box>

          <Box
            sx={{
              mt: 3,
              display: "grid",
              gridTemplateColumns: "340px 1fr 210px",
              gap: 2,
              alignItems: "start",
              pointerEvents: isViewMode ? "none" : "auto",
              opacity: isViewMode ? 0.92 : 1,
            }}
          >
            <SectionFrame title="Détails client" minHeight={338}>
              <Box sx={{ display: "grid", gap: 1.5 }}>
                <Box>
                  <Typography sx={labelSx}>Donneur d'ordre *</Typography>
                  <Select
                    fullWidth
                    displayEmpty
                    value={clientId}
                    onChange={(e) => setClientId(String(e.target.value))}
                    IconComponent={KeyboardArrowDownRoundedIcon}
                    sx={fieldSx}
                    renderValue={(selected) =>
                      selected
                        ? clients.find((client) => client.id === selected)?.label ?? ""
                        : "Donneur d'ordre *"
                    }
                  >
                    {clients.map((client) => (
                      <MenuItem key={client.id} value={client.id}>
                        {client.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>

                <Box>
                  <Typography sx={labelSx}>Compte espèces Client*</Typography>
                  <Select
                    fullWidth
                    displayEmpty
                    value={selectedClient?.compteEspeces ?? ""}
                    IconComponent={KeyboardArrowDownRoundedIcon}
                    sx={fieldSx}
                    renderValue={(selected) =>
                      selected ? String(selected) : "Compte espèces Client*"
                    }
                  >
                    {selectedClient && (
                      <MenuItem value={selectedClient.compteEspeces}>
                        {selectedClient.compteEspeces}
                      </MenuItem>
                    )}
                  </Select>
                </Box>

                <Box>
                  <Typography sx={labelSx}>Compte titres Client*</Typography>
                  <Select
                    fullWidth
                    displayEmpty
                    value={selectedClient?.compteTitres ?? ""}
                    IconComponent={KeyboardArrowDownRoundedIcon}
                    sx={fieldSx}
                    renderValue={(selected) =>
                      selected ? String(selected) : "Compte titres Client*"
                    }
                  >
                    {selectedClient && (
                      <MenuItem value={selectedClient.compteTitres}>
                        {selectedClient.compteTitres}
                      </MenuItem>
                    )}
                  </Select>
                </Box>

                <Box>
                  <Typography sx={labelSx}>Devise du compte espèce</Typography>
                  <TextField
                    fullWidth
                    value={selectedClient?.devise ?? ""}
                    placeholder="Devise du compte espèce"
                    onChange={() => {}}
                    sx={readOnlyFieldSx}
                  />
                </Box>

                <Box
                  sx={{
                    mt: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flexWrap: "wrap",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#2f3a45",
                    }}
                  >
                    Client sujet à réservation :
                  </Typography>

                  <ToggleChoice
                    text="Oui"
                    active={clientSujetReservation}
                    onClick={() => setClientSujetReservation(true)}
                  />

                  <ToggleChoice
                    text="Non"
                    active={!clientSujetReservation}
                    onClick={() => setClientSujetReservation(false)}
                  />
                </Box>
              </Box>
            </SectionFrame>

            <SectionFrame title="Détails de l'ordre" minHeight={338}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 1.5,
                }}
              >
                <TextField
                  fullWidth
                  placeholder="Référence Principale"
                  value={referencePrincipale}
                  onChange={(e) => setReferencePrincipale(e.target.value)}
                  sx={fieldSx}
                />
                <TextField
                  fullWidth
                  placeholder="Référence de l'ordre"
                  value={referenceOrdre}
                  onChange={(e) => setReferenceOrdre(e.target.value)}
                  sx={fieldSx}
                />

                <Box
                  sx={{
                    gridColumn: "span 2",
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    px: 1,
                  }}
                >
                  <Typography sx={labelInlineSx}>• Sens de l'ordre*</Typography>

                  <ToggleChoice
                    text="Achat"
                    active={sensOrdre === "achat"}
                    onClick={() => setSensOrdre("achat")}
                  />

                  <ToggleChoice
                    text="Vente"
                    active={sensOrdre === "vente"}
                    onClick={() => setSensOrdre("vente")}
                  />
                </Box>

                <TextField
                  fullWidth
                  placeholder="Quantité *"
                  value={quantite}
                  onChange={(e) =>
                    setQuantite(e.target.value.replace(/[^\d.,]/g, ""))
                  }
                  sx={fieldSx}
                />

                <Select
                  fullWidth
                  displayEmpty
                  value={instrumentId}
                  onChange={(e) => setInstrumentId(String(e.target.value))}
                  IconComponent={KeyboardArrowDownRoundedIcon}
                  sx={fieldSx}
                  renderValue={(selected) =>
                    selected
                      ? instruments.find((instrument) => instrument.id === selected)
                          ?.mnemonique ?? ""
                      : "Mnémonique*"
                  }
                >
                  {instruments.map((instrument) => (
                    <MenuItem key={instrument.id} value={instrument.id}>
                      {instrument.mnemonique}
                    </MenuItem>
                  ))}
                </Select>

                <TextField
                  fullWidth
                  placeholder="ISIN *"
                  value={selectedInstrument?.isin ?? ""}
                  onChange={() => {}}
                  sx={readOnlyFieldSx}
                />
                <TextField
                  fullWidth
                  placeholder="Code valeur  *"
                  value={selectedInstrument?.codeValeur ?? ""}
                  onChange={() => {}}
                  sx={readOnlyFieldSx}
                />

                <TextField
                  fullWidth
                  placeholder="Description de l'instrument"
                  value={selectedInstrument?.description ?? ""}
                  onChange={() => {}}
                  sx={readOnlyFieldSx}
                />
                <TextField
                  fullWidth
                  placeholder="Groupe de cotation"
                  value={selectedInstrument?.groupeCotation ?? ""}
                  onChange={() => {}}
                  sx={readOnlyFieldSx}
                />
                <TextField
                  fullWidth
                  placeholder="Place de dénouement *"
                  value={selectedInstrument?.placeDenouement ?? ""}
                  onChange={() => {}}
                  sx={readOnlyFieldSx}
                />
                <Select
                  fullWidth
                  displayEmpty
                  value={societeBourse}
                  onChange={(e) => setSocieteBourse(String(e.target.value))}
                  IconComponent={KeyboardArrowDownRoundedIcon}
                  sx={fieldSx}
                  renderValue={(selected) =>
                    selected ? String(selected) : "Société de bourse  *"
                  }
                >
                  {societesBourse.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>

                <Select
                  fullWidth
                  displayEmpty
                  value={typeOrdre}
                  onChange={(e) => setTypeOrdre(String(e.target.value))}
                  IconComponent={KeyboardArrowDownRoundedIcon}
                  sx={fieldSx}
                  renderValue={(selected) =>
                    selected ? String(selected) : "Type d'ordre *"
                  }
                >
                  {typesOrdre.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>

                {showPrixField ? (
                  <TextField
                    fullWidth
                    placeholder="Prix *"
                    value={prix}
                    onChange={(e) =>
                      setPrix(e.target.value.replace(/[^\d.,]/g, ""))
                    }
                    sx={fieldSx}
                  />
                ) : (
                  <Box />
                )}

                <Select
                  fullWidth
                  displayEmpty
                  value={validiteOrdre}
                  onChange={(e) => setValiditeOrdre(String(e.target.value))}
                  IconComponent={KeyboardArrowDownRoundedIcon}
                  sx={fieldSx}
                  renderValue={(selected) =>
                    selected ? String(selected) : "Validité de l'ordre*"
                  }
                >
                  {validitesOrdre.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>

                <Box />

                <Select
                  fullWidth
                  displayEmpty
                  value={typeMarche}
                  onChange={(e) => setTypeMarche(String(e.target.value))}
                  IconComponent={KeyboardArrowDownRoundedIcon}
                  sx={fieldSx}
                  renderValue={(selected) =>
                    selected ? String(selected) : "Type de marché*"
                  }
                >
                  {typesMarche.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2.5,
                    px: 1,
                  }}
                >
                  <Typography sx={labelInlineSx}>Routage :</Typography>

                  <ToggleChoice
                    text="Non"
                    active={routage === "non"}
                    onClick={() => setRoutage("non")}
                  />

                  <ToggleChoice
                    text="Oui"
                    active={routage === "oui"}
                    onClick={() => setRoutage("oui")}
                  />
                </Box>
              </Box>
            </SectionFrame>

            <SectionFrame title="Détails Tranche" minHeight={338}>
              <Box sx={{ display: "grid", gap: 1.75 }}>
                <Box>
                  <Typography sx={labelSx}>Tranche</Typography>
                  <Select
                    fullWidth
                    displayEmpty
                    value={trancheId}
                    onChange={(e) => setTrancheId(String(e.target.value))}
                    IconComponent={KeyboardArrowDownRoundedIcon}
                    sx={fieldSx}
                    renderValue={(selected) =>
                      selected
                        ? tranches.find((tranche) => tranche.id === selected)?.label ?? ""
                        : "Tranche"
                    }
                  >
                    {tranches.map((tranche) => (
                      <MenuItem key={tranche.id} value={tranche.id}>
                        {tranche.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>

                <Box>
                  <Typography sx={labelSx}>Référence IPO</Typography>
                  <TextField
                    fullWidth
                    value={selectedTranche?.referenceIpo ?? ""}
                    placeholder="Référence IPO"
                    onChange={() => {}}
                    sx={readOnlyFieldSx}
                  />
                </Box>
              </Box>
            </SectionFrame>
          </Box>
        </Box>
      </LocalizationProvider>

      {!isViewMode && (
        <ConfirmDialog
          open={confirmCancelOpen}
          title="Confirmer l’annulation"
          message="Voulez-vous vraiment annuler et revenir à la liste des ordres ?"
          confirmLabel="Oui, annuler"
          cancelLabel="Retour"
          onConfirm={handleConfirmCancel}
          onCancel={() => setConfirmCancelOpen(false)}
        />
      )}
    </>
  );
}

const labelSx = {
  fontSize: 12,
  color: "#8a97a5",
  mb: 0.5,
};

const labelInlineSx = {
  fontSize: 13,
  fontWeight: 700,
  color: "#2f3a45",
};

const switchTextSx = {
  fontSize: 13,
  color: "#2f3a45",
};