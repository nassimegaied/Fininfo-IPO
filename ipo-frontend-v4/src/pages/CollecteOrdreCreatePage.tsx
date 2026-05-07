import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import ConfirmDialog from "../components/ipo/ConfirmDialog";
import {
  societesBourse,
  typesOrdre,
  typesMarche,
  validitesOrdre,
} from "../mocks/apiData";
import { fetchClients, fetchInstruments, type ClientOption, type InstrumentOption } from "../api/referenceApi";
import { createOrdre, fetchOrdreById, updateOrdre, type OrdreDetail } from "../api/ordreApi";
import { fetchIpoList, fetchTranchesByIpo, type IpoRow, type TrancheOption } from "../api/ipoApi";

type CollecteOrdrePageMode = "create" | "edit" | "view";

type CollecteOrdreCreatePageProps = {
  mode?: CollecteOrdrePageMode;
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
  disabled = false,
  onClick,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <Box
      component="button"
      type="button"
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      sx={{
        width: 20,
        height: 10,
        borderRadius: 999,
        bgcolor: disabled ? "#e0e0e0" : active ? "#20b8c8" : "#d4dbe2",
        position: "relative",
        display: "inline-block",
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
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
  disabled = false,
  onClick,
}: {
  text: string;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <Box
      component="button"
      type="button"
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.6,
        border: "none",
        background: "transparent",
        cursor: disabled ? "not-allowed" : "pointer",
        p: 0,
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <Typography sx={{ fontSize: 13, color: "#2f3a45" }}>{text}</Typography>
      <MiniSwitch active={active} disabled={disabled} />
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
  const { id } = useParams<{ id: string }>();
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";

  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false, message: "", severity: "success",
  });

  // ── Real IPO list, Tranches, Clients, Instruments ───────────────────────
  const [ipoList, setIpoList] = useState<IpoRow[]>([]);
  const [trancheList, setTrancheList] = useState<TrancheOption[]>([]);
  const [clientList, setClientList] = useState<ClientOption[]>([]);
  const [instrumentList, setInstrumentList] = useState<InstrumentOption[]>([]);
  const [selectedIpoId, setSelectedIpoId] = useState<string>("");
  const [loadingTranches, setLoadingTranches] = useState(false);
  const trancheIdToRestoreRef = useRef<string | null>(null);

  // Load lists on mount
  useEffect(() => {
    fetchIpoList()
      .then(setIpoList)
      .catch(() => console.warn("Could not load IPO list"));

    fetchClients()
      .then(setClientList)
      .catch(() => console.warn("Could not load clients"));

    fetchInstruments()
      .then(setInstrumentList)
      .catch(() => console.warn("Could not load instruments"));
  }, []);

  // When IPO selected, load its tranches.
  // In edit/view mode we keep the saved tranche selection.
  useEffect(() => {
    if (!selectedIpoId) {
      setTrancheList([]);
      setTrancheId("");
      return;
    }

    const trancheIdToRestore = trancheIdToRestoreRef.current;
    setLoadingTranches(true);
    if (!trancheIdToRestore) {
      setTrancheId("");
    }

    fetchTranchesByIpo(selectedIpoId)
      .then((tranches) => {
        setTrancheList(tranches);

        if (trancheIdToRestore) {
          const exists = tranches.some(
            (tranche) => String(tranche.id) === trancheIdToRestore
          );
          setTrancheId(exists ? trancheIdToRestore : "");
          trancheIdToRestoreRef.current = null;
        }
      })
      .catch(() => {
        setTrancheList([]);
        if (trancheIdToRestore) {
          setTrancheId("");
          trancheIdToRestoreRef.current = null;
        }
      })
      .finally(() => setLoadingTranches(false));
  }, [selectedIpoId]);

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

  // Load existing order data in edit/view mode
  useEffect(() => {
    if ((mode === "edit" || mode === "view") && id) {
      fetchOrdreById(id)
        .then((data: OrdreDetail) => {
          setClientId(data.clientId ?? "");
          setQuantite(data.quantite != null ? String(data.quantite) : "");
          setInstrumentId(data.instrumentId ?? "");
          setSocieteBourse(data.societeBourse ?? "");
          setTypeOrdre(data.typeOrdre ?? "");
          setTypeMarche(data.typeMarche ?? "");
          setValiditeOrdre(data.validite ?? "");
          setPrix(data.prix != null ? String(data.prix) : "");
          const savedTrancheId = data.trancheId != null ? String(data.trancheId) : "";
          setTrancheId(savedTrancheId);
          setReferencePrincipale(data.referenceIpo ?? "");
          // ✅ Restore IPO dropdown so tranches reload for this order
          if (data.offreIpoId != null) {
            trancheIdToRestoreRef.current = savedTrancheId || null;
            setSelectedIpoId(String(data.offreIpoId));
          }
        })
        .catch(() => {
          setSnackbar({ open: true, message: "Impossible de charger les données de l'ordre.", severity: "error" });
        });
    }
  }, [id, mode]);

  const selectedClient = useMemo(
    () => clientList.find((client) => String(client.id) === clientId) ?? null,
    [clientList, clientId]
  );

  const selectedInstrument = useMemo(
    () => instrumentList.find((instrument) => String(instrument.id) === instrumentId) ?? null,
    [instrumentList, instrumentId]
  );

  // selectedTranche — look up the chosen tranche from the real API list
  const selectedTranche = useMemo(
    () => trancheList.find((t) => String(t.id) === trancheId) ?? null,
    [trancheList, trancheId]
  );
  // ── Form validation ───────────────────────────────────────────────
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!clientId) newErrors.clientId = "Le donneur d'ordre est requis.";
    if (!quantite || parseInt(quantite.replace(/\D/g, "")) <= 0)
      newErrors.quantite = "La quantité doit être supérieure à 0.";
    if (!selectedIpoId) newErrors.selectedIpoId = "Veuillez sélectionner une référence IPO.";
    if (!trancheId) newErrors.trancheId = "Veuillez sélectionner une tranche.";
    if (!instrumentId) newErrors.instrumentId = "L'instrument est requis.";
    if (!societeBourse) newErrors.societeBourse = "Le membre négociateur est requis.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  const handleSave = async () => {
    if (isViewMode) return;
    if (!validateForm()) return;  // ← stop if required fields are missing
    setSaving(true);
    try {
      const payload: OrdreDetail = {
        id: id ? Number(id) : null,
        reference: null,
        clientId,
        clientLabel: selectedClient?.label ?? clientId,
        compteEspeces: selectedClient?.compteEspeces ?? "",
        compteTitres: selectedClient?.compteTitres ?? "",
        instrumentId,
        mnemonique: selectedInstrument?.mnemonique ?? "",
        isin: selectedInstrument?.isin ?? "",
        typeOrdre,
        typeMarche,
        societeBourse,
        quantite: quantite ? parseInt(quantite.replace(/[^\d]/g, "")) : null,
        prix: prix ? parseFloat(prix.replace(",", ".")) : null,
        validite: validiteOrdre,
        referenceIpo: selectedTranche?.referenceIpo ?? referencePrincipale,
        trancheId: trancheId ? Number(trancheId) : null,
        offreIpoId: selectedIpoId ? Number(selectedIpoId) : null,
        status: null,
      };

      if (isEditMode && id) {
        await updateOrdre(id, payload);
        setSnackbar({ open: true, message: "Ordre mis à jour avec succès !", severity: "success" });
      } else {
        await createOrdre(payload);
        setSnackbar({ open: true, message: "Ordre créé avec succès !", severity: "success" });
      }
      setErrors({});  // clear any previous validation errors

      setTimeout(() => navigate("/collecte"), 1200);
    } catch (err: any) {
      console.error("Save error:", err);
      setSnackbar({
        open: true,
        message: `Erreur : ${err.message ?? "Vérifiez que le backend est démarré."}`,
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
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
                  disabled={saving}
                  sx={{
                    textTransform: "none",
                    bgcolor: "#20b8c8",
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    fontWeight: 600,
                    boxShadow: "none",
                    minWidth: 140,
                    "&:hover": {
                      bgcolor: "#17a9b8",
                      boxShadow: "none",
                    },
                  }}
                >
                  {saving ? (
                    <CircularProgress size={20} sx={{ color: "#fff" }} />
                  ) : (
                    isEditMode ? "Mettre à jour" : "Sauvegarder"
                  )}
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
            }}
          >
            <SectionFrame title="Détails client" minHeight={338}>
              <Box sx={{ display: "grid", gap: 1.5 }}>
                <Box>
                  <Typography sx={labelSx}>Donneur d'ordre *</Typography>
                  <Select
                    disabled={isViewMode}
                    fullWidth
                    displayEmpty
                    value={clientId}
                    onChange={(e) => { setClientId(String(e.target.value)); setErrors((p) => ({ ...p, clientId: "" })); }}
                    IconComponent={KeyboardArrowDownRoundedIcon}
                    sx={{ ...fieldSx, ...(errors.clientId ? { "& .MuiOutlinedInput-notchedOutline": { borderColor: "#dc2626" } } : {}) }}
                    renderValue={(selected) =>
                      selected
                        ? clientList.find((client) => String(client.id) === selected)?.label ?? ""
                        : "Donneur d'ordre *"
                    }
                  >
                    {clientList.map((client) => (
                      <MenuItem key={client.id} value={String(client.id)}>
                        {client.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.clientId && (
                    <Typography sx={{ fontSize: 11, color: "#dc2626", mt: 0.4 }}>{errors.clientId}</Typography>
                  )}
                </Box>

                <Box>
                  <Typography sx={labelSx}>Compte espèces Client*</Typography>
                  <Select
                    disabled={isViewMode}
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
                    disabled={isViewMode}
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
                    disabled={isViewMode}
                    fullWidth
                    value={selectedClient?.devise ?? ""}
                    placeholder="Devise du compte espèce"
                    onChange={() => { }}
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
                    disabled={isViewMode}
                    text="Oui"
                    active={clientSujetReservation}
                    onClick={() => setClientSujetReservation(true)}
                  />

                  <ToggleChoice
                    disabled={isViewMode}
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
                  disabled={isViewMode}
                  fullWidth
                  placeholder="Référence Principale"
                  value={referencePrincipale}
                  onChange={(e) => setReferencePrincipale(e.target.value)}
                  sx={fieldSx}
                />
                <TextField
                  disabled={isViewMode}
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
                    disabled={isViewMode}
                    text="Achat"
                    active={sensOrdre === "achat"}
                    onClick={() => setSensOrdre("achat")}
                  />

                  <ToggleChoice
                    disabled={isViewMode}
                    text="Vente"
                    active={sensOrdre === "vente"}
                    onClick={() => setSensOrdre("vente")}
                  />
                </Box>

                <Box>
                  <TextField
                    disabled={isViewMode}
                    fullWidth
                    placeholder="Quantité *"
                    value={quantite}
                    onChange={(e) => {
                      setQuantite(e.target.value.replace(/[^\d.,]/g, ""));
                      setErrors((p) => ({ ...p, quantite: "" }));
                    }}
                    sx={{ ...fieldSx, ...(errors.quantite ? { "& .MuiOutlinedInput-notchedOutline": { borderColor: "#dc2626" } } : {}) }}
                  />
                  {errors.quantite && (
                    <Typography sx={{ fontSize: 11, color: "#dc2626", mt: 0.4 }}>{errors.quantite}</Typography>
                  )}
                </Box>

                <Box>
                  <Select
                    disabled={isViewMode}
                    fullWidth
                    displayEmpty
                    value={instrumentId}
                    onChange={(e) => { setInstrumentId(String(e.target.value)); setErrors((p) => ({ ...p, instrumentId: "" })); }}
                    IconComponent={KeyboardArrowDownRoundedIcon}
                    sx={{ ...fieldSx, ...(errors.instrumentId ? { "& .MuiOutlinedInput-notchedOutline": { borderColor: "#dc2626" } } : {}) }}
                    renderValue={(selected) =>
                      selected
                        ? instrumentList.find((instrument) => String(instrument.id) === selected)
                          ?.mnemonique ?? ""
                        : "Mnémonique*"
                    }
                  >
                    {instrumentList.map((instrument) => (
                      <MenuItem key={instrument.id} value={String(instrument.id)}>
                        {instrument.mnemonique}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.instrumentId && (
                    <Typography sx={{ fontSize: 11, color: "#dc2626", mt: 0.4 }}>{errors.instrumentId}</Typography>
                  )}
                </Box>

                <TextField
                  disabled={isViewMode}
                  fullWidth
                  placeholder="ISIN *"
                  value={selectedInstrument?.isin ?? ""}
                  onChange={() => { }}
                  sx={readOnlyFieldSx}
                />
                <TextField
                  disabled={isViewMode}
                  fullWidth
                  placeholder="Code valeur  *"
                  value={selectedInstrument?.codeValeur ?? ""}
                  onChange={() => { }}
                  sx={readOnlyFieldSx}
                />

                <TextField
                  disabled={isViewMode}
                  fullWidth
                  placeholder="Description de l'instrument"
                  value={selectedInstrument?.description ?? ""}
                  onChange={() => { }}
                  sx={readOnlyFieldSx}
                />
                <TextField
                  disabled={isViewMode}
                  fullWidth
                  placeholder="Groupe de cotation"
                  value={selectedInstrument?.groupeCotation ?? ""}
                  onChange={() => { }}
                  sx={readOnlyFieldSx}
                />
                <TextField
                  disabled={isViewMode}
                  fullWidth
                  placeholder="Place de dénouement *"
                  value={selectedInstrument?.placeDenouement ?? ""}
                  onChange={() => { }}
                  sx={readOnlyFieldSx}
                />
                <Box>
                  <Select
                    disabled={isViewMode}
                    fullWidth
                    displayEmpty
                    value={societeBourse}
                    onChange={(e) => { setSocieteBourse(String(e.target.value)); setErrors((p) => ({ ...p, societeBourse: "" })); }}
                    IconComponent={KeyboardArrowDownRoundedIcon}
                    sx={{ ...fieldSx, ...(errors.societeBourse ? { "& .MuiOutlinedInput-notchedOutline": { borderColor: "#dc2626" } } : {}) }}
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
                  {errors.societeBourse && (
                    <Typography sx={{ fontSize: 11, color: "#dc2626", mt: 0.4 }}>{errors.societeBourse}</Typography>
                  )}
                </Box>

                <Select
                  disabled={isViewMode}
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
                    disabled={isViewMode}
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
                  disabled={isViewMode}
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
                  disabled={isViewMode}
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
                    disabled={isViewMode}
                    text="Non"
                    active={routage === "non"}
                    onClick={() => setRoutage("non")}
                  />

                  <ToggleChoice
                    disabled={isViewMode}
                    text="Oui"
                    active={routage === "oui"}
                    onClick={() => setRoutage("oui")}
                  />
                </Box>
              </Box>
            </SectionFrame>

            <SectionFrame title="Détails Tranche" minHeight={338}>
              <Box sx={{ display: "grid", gap: 1.75 }}>

                {/* Step 1 — Pick the IPO reference */}
                <Box>
                  <Typography sx={labelSx}>Référence IPO *</Typography>
                  <Select
                    disabled={isViewMode}
                    fullWidth
                    displayEmpty
                    value={selectedIpoId}
                    onChange={(e) => {
                      trancheIdToRestoreRef.current = null;
                      setSelectedIpoId(String(e.target.value));
                      setErrors((p) => ({ ...p, selectedIpoId: "" }));
                    }}
                    IconComponent={KeyboardArrowDownRoundedIcon}
                    sx={{ ...fieldSx, ...(errors.selectedIpoId ? { "& .MuiOutlinedInput-notchedOutline": { borderColor: "#dc2626" } } : {}) }}
                    renderValue={(selected) =>
                      selected
                        ? ipoList.find((ipo) => String(ipo.id) === selected)?.reference ?? selected
                        : "Sélectionner une IPO"
                    }
                  >
                    {ipoList.length === 0 ? (
                      <MenuItem disabled value="">
                        Aucune IPO disponible
                      </MenuItem>
                    ) : (
                      ipoList.map((ipo) => (
                        <MenuItem key={ipo.id} value={String(ipo.id)}>
                          {ipo.reference} — {ipo.typeOffre}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                  {errors.selectedIpoId && (
                    <Typography sx={{ fontSize: 11, color: "#dc2626", mt: 0.4 }}>{errors.selectedIpoId}</Typography>
                  )}
                </Box>

                {/* Step 2 — Pick a tranche from that IPO */}
                <Box>
                  <Typography sx={labelSx}>Tranche</Typography>
                  <Select
                    fullWidth
                    displayEmpty
                    disabled={isViewMode || !selectedIpoId || loadingTranches}
                    value={trancheId}
                    onChange={(e) => {
                      setTrancheId(String(e.target.value));
                      setErrors((p) => ({ ...p, trancheId: "" }));
                    }}
                    IconComponent={loadingTranches ? CircularProgress : KeyboardArrowDownRoundedIcon}
                    sx={{ ...fieldSx, ...(errors.trancheId ? { "& .MuiOutlinedInput-notchedOutline": { borderColor: "#dc2626" } } : {}) }}
                    renderValue={(selected) =>
                      selected
                        ? trancheList.find((t) => String(t.id) === selected)?.label ?? selected
                        : selectedIpoId
                          ? loadingTranches
                            ? "Chargement..."
                            : "Sélectionner une tranche"
                          : "Choisir d'abord une IPO"
                    }
                  >
                    {trancheList.map((tranche) => (
                      <MenuItem key={tranche.id} value={String(tranche.id)}>
                        {tranche.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.trancheId && (
                    <Typography sx={{ fontSize: 11, color: "#dc2626", mt: 0.4 }}>{errors.trancheId}</Typography>
                  )}
                </Box>

                {/* Auto-filled Référence IPO from selected tranche */}
                <Box>
                  <Typography sx={labelSx}>Référence IPO (auto)</Typography>
                  <TextField
                    disabled={isViewMode}
                    fullWidth
                    value={
                      trancheList.find((t) => String(t.id) === trancheId)?.referenceIpo
                      ?? ipoList.find((ipo) => String(ipo.id) === selectedIpoId)?.reference
                      ?? ""
                    }
                    placeholder="Référence IPO"
                    onChange={() => { }}
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

      {/* Toast notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          sx={{ minWidth: 300 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
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
