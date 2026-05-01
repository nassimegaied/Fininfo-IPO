import { Box, IconButton, TextField, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import type {
  SyndicatePrerequisItem,
  SyndicateTabData,
} from "../../types/ipo";

function MiniSwitch({ active = false }: { active?: boolean }) {
  return (
    <Box
      sx={{
        width: 18,
        height: 10,
        borderRadius: 999,
        bgcolor: active ? "#19bccb" : "#d7dee5",
        position: "relative",
        display: "inline-block",
        verticalAlign: "middle",
        "&::after": {
          content: '""',
          position: "absolute",
          top: 1,
          left: active ? 9 : 1,
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
        gap: 0.75,
        cursor: "pointer",
        userSelect: "none",
        background: "transparent",
        border: "none",
        padding: 0,
        margin: 0,
      }}
    >
      <MiniSwitch active={active} />
      <Typography sx={{ fontSize: 13, color: "#4d5a68" }}>{text}</Typography>
    </Box>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        border: "1px solid #e6edf2",
        borderRadius: 1,
        bgcolor: "#fff",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          px: 1.5,
          py: 1,
          bgcolor: "#eefafb",
          borderBottom: "1px solid #e6edf2",
        }}
      >
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#6a7a89" }}>
          {title}
        </Typography>
      </Box>

      <Box sx={{ p: 1.5 }}>{children}</Box>
    </Box>
  );
}

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    bgcolor: "#fff",
    borderRadius: 1,
    fontSize: 14,
    height: 40,
  },
  "& .MuiInputBase-input::placeholder": {
    color: "#8a97a5",
    opacity: 1,
  },
  "& input[type='date']": {
    color: "#4d5a68",
  },
};

const onlyDigits = (input: string) => input.replace(/\D/g, "");

type SyndicateTabContentProps = {
  value: SyndicateTabData;
  onChange: (nextValue: SyndicateTabData) => void;
};

function createDuplicateItem(
  source: SyndicatePrerequisItem,
  id: string
): SyndicatePrerequisItem {
  return {
    ...source,
    id,
  };
}

export default function SyndicateTabContent({
  value,
  onChange,
}: SyndicateTabContentProps) {
  const updateItem = (
    itemId: string,
    updater: (current: SyndicatePrerequisItem) => SyndicatePrerequisItem
  ) => {
    onChange({
      ...value,
      prerequisItems: value.prerequisItems.map((item) =>
        item.id === itemId ? updater(item) : item
      ),
    });
  };

  const updateParametreField = (
    field: keyof SyndicateTabData["parametres"],
    fieldValue: string
  ) => {
    onChange({
      ...value,
      parametres: {
        ...value.parametres,
        [field]: fieldValue,
      },
    });
  };

  const updateFraisField = (
    field: keyof SyndicateTabData["frais"],
    fieldValue: string
  ) => {
    onChange({
      ...value,
      frais: {
        ...value.frais,
        [field]: fieldValue,
      },
    });
  };

  const updateMethodePaiementField = (
    field: keyof SyndicateTabData["methodePaiement"],
    fieldValue: string
  ) => {
    onChange({
      ...value,
      methodePaiement: {
        ...value.methodePaiement,
        [field]: fieldValue,
      },
    });
  };

  const updateAllocationField = (
    field: keyof SyndicateTabData["allocation"],
    fieldValue: boolean
  ) => {
    onChange({
      ...value,
      allocation: {
        ...value.allocation,
        [field]: fieldValue,
      },
    });
  };

  const updateCouvertureField = (
    field: keyof SyndicateTabData["couvertureSouscription"],
    fieldValue: string
  ) => {
    onChange({
      ...value,
      couvertureSouscription: {
        ...value.couvertureSouscription,
        [field]: fieldValue,
      },
    });
  };

  const addEmptyItem = () => {
    const nextIndex = value.prerequisItems.length + 1;

    onChange({
      ...value,
      prerequisItems: [
        ...value.prerequisItems,
        {
          id: `synd-${nextIndex}`,
          nom: "",
          prenom: "",
          cin: "",
          compteTitre: "",
          compteEspece: "",
          dateNaissance: "",
          idSyndical: "",
          type: "",
          residence: "",
          nationalite: "",
          titulaireAuSyndicat: false,
          mineur: false,
          inscritListeValidee: false,
        },
      ],
    });
  };

  const duplicateItem = (item: SyndicatePrerequisItem) => {
    const nextIndex = value.prerequisItems.length + 1;

    onChange({
      ...value,
      prerequisItems: [
        ...value.prerequisItems,
        createDuplicateItem(item, `synd-${nextIndex}`),
      ],
    });
  };

  const deleteItem = (itemId: string) => {
    if (value.prerequisItems.length === 1) return;

    onChange({
      ...value,
      prerequisItems: value.prerequisItems.filter((item) => item.id !== itemId),
    });
  };

  const numericTextFieldProps = (
    currentValue: string,
    onValueChange: (next: string) => void,
    placeholder: string
  ) => ({
    fullWidth: true,
    size: "small" as const,
    type: "text" as const,
    inputMode: "numeric" as const,
    placeholder,
    value: currentValue,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      onValueChange(onlyDigits(e.target.value));
    },
    sx: fieldSx,
  });

  return (
    <Box sx={{ p: 2 }}>
      {value.prerequisItems.map((item, index) => (
        <SectionCard
          key={item.id}
          title={`Prérequis${value.prerequisItems.length > 1 ? ` ${index + 1}` : ""}`}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 1.5,
              mb: 1.5,
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Nom"
              value={item.nom}
              onChange={(e) =>
                updateItem(item.id, (current) => ({
                  ...current,
                  nom: e.target.value,
                }))
              }
              sx={fieldSx}
            />
            <TextField
              fullWidth
              size="small"
              placeholder="Prénom"
              value={item.prenom}
              onChange={(e) =>
                updateItem(item.id, (current) => ({
                  ...current,
                  prenom: e.target.value,
                }))
              }
              sx={fieldSx}
            />
            <TextField
              {...numericTextFieldProps(
                item.cin,
                (next) =>
                  updateItem(item.id, (current) => ({
                    ...current,
                    cin: next,
                  })),
                "CIN"
              )}
            />
            <TextField
              {...numericTextFieldProps(
                item.compteTitre,
                (next) =>
                  updateItem(item.id, (current) => ({
                    ...current,
                    compteTitre: next,
                  })),
                "Compte titre"
              )}
            />
            <TextField
              {...numericTextFieldProps(
                item.compteEspece,
                (next) =>
                  updateItem(item.id, (current) => ({
                    ...current,
                    compteEspece: next,
                  })),
                "Compte espèce"
              )}
            />
            <TextField
              fullWidth
              size="small"
              type="date"
              value={item.dateNaissance}
              onChange={(e) =>
                updateItem(item.id, (current) => ({
                  ...current,
                  dateNaissance: e.target.value,
                }))
              }
              sx={fieldSx}
            />
            <TextField
              {...numericTextFieldProps(
                item.idSyndical,
                (next) =>
                  updateItem(item.id, (current) => ({
                    ...current,
                    idSyndical: next,
                  })),
                "ID syndical"
              )}
            />
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 1.25,
              mb: 1.25,
            }}
          >
            <Box
              sx={{
                border: "1px solid #e7edf2",
                borderRadius: 1,
                px: 1,
                py: 0.9,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                minHeight: 40,
              }}
            >
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#1cb7c8" }}>
                Type :
              </Typography>
              <ToggleChoice
                text="Physique"
                active={item.type === "physique"}
                onClick={() =>
                  updateItem(item.id, (current) => ({
                    ...current,
                    type: current.type === "physique" ? "" : "physique",
                  }))
                }
              />
              <ToggleChoice
                text="Moral"
                active={item.type === "moral"}
                onClick={() =>
                  updateItem(item.id, (current) => ({
                    ...current,
                    type: current.type === "moral" ? "" : "moral",
                  }))
                }
              />
            </Box>

            <Box
              sx={{
                border: "1px solid #e7edf2",
                borderRadius: 1,
                px: 1,
                py: 0.9,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                minHeight: 40,
              }}
            >
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#1cb7c8" }}>
                Résidence :
              </Typography>
              <ToggleChoice
                text="Résident"
                active={item.residence === "resident"}
                onClick={() =>
                  updateItem(item.id, (current) => ({
                    ...current,
                    residence: current.residence === "resident" ? "" : "resident",
                  }))
                }
              />
              <ToggleChoice
                text="Non résident"
                active={item.residence === "non-resident"}
                onClick={() =>
                  updateItem(item.id, (current) => ({
                    ...current,
                    residence:
                      current.residence === "non-resident" ? "" : "non-resident",
                  }))
                }
              />
            </Box>

            <Box
              sx={{
                border: "1px solid #e7edf2",
                borderRadius: 1,
                px: 1,
                py: 0.9,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                minHeight: 40,
              }}
            >
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#1cb7c8" }}>
                Nationalité :
              </Typography>
              <ToggleChoice
                text="Marocaine"
                active={item.nationalite === "marocaine"}
                onClick={() =>
                  updateItem(item.id, (current) => ({
                    ...current,
                    nationalite:
                      current.nationalite === "marocaine" ? "" : "marocaine",
                  }))
                }
              />
              <ToggleChoice
                text="étrangère"
                active={item.nationalite === "etrangere"}
                onClick={() =>
                  updateItem(item.id, (current) => ({
                    ...current,
                    nationalite:
                      current.nationalite === "etrangere" ? "" : "etrangere",
                  }))
                }
              />
            </Box>

            <Box
              sx={{
                border: "1px solid #e7edf2",
                borderRadius: 1,
                px: 1,
                py: 0.9,
                display: "flex",
                alignItems: "center",
                gap: 1.2,
                minHeight: 40,
              }}
            >
              <ToggleChoice
                text="Titulaire au sein du syndicat"
                active={item.titulaireAuSyndicat}
                onClick={() =>
                  updateItem(item.id, (current) => ({
                    ...current,
                    titulaireAuSyndicat: !current.titulaireAuSyndicat,
                  }))
                }
              />
            </Box>

            <Box
              sx={{
                border: "1px solid #e7edf2",
                borderRadius: 1,
                px: 1,
                py: 0.9,
                display: "flex",
                alignItems: "center",
                gap: 1.2,
                minHeight: 40,
              }}
            >
              <ToggleChoice
                text="Mineur"
                active={item.mineur}
                onClick={() =>
                  updateItem(item.id, (current) => ({
                    ...current,
                    mineur: !current.mineur,
                  }))
                }
              />
            </Box>
          </Box>

          <Box
            sx={{
              border: "1px solid #e7edf2",
              borderRadius: 1,
              px: 1,
              py: 0.9,
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 1.25,
              minHeight: 40,
            }}
          >
            <ToggleChoice
              text="Inscrit sur la liste validée par l’organe compétent du syndicat"
              active={item.inscritListeValidee}
              onClick={() =>
                updateItem(item.id, (current) => ({
                  ...current,
                  inscritListeValidee: !current.inscritListeValidee,
                }))
              }
            />
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              size="small"
              onClick={addEmptyItem}
              sx={{
                bgcolor: "#19bccb",
                color: "#fff",
                borderRadius: 1,
                "&:hover": { bgcolor: "#15aab8" },
              }}
            >
              <AddIcon fontSize="small" />
            </IconButton>

            <IconButton
              size="small"
              onClick={() => duplicateItem(item)}
              sx={{
                bgcolor: "#f3fbfc",
                color: "#6eaeb7",
                border: "1px solid #d8eef2",
                borderRadius: 1,
              }}
            >
              <ContentCopyOutlinedIcon fontSize="small" />
            </IconButton>

            <IconButton
              size="small"
              onClick={() => deleteItem(item.id)}
              disabled={value.prerequisItems.length === 1}
              sx={{
                bgcolor: "#f3fbfc",
                color: "#6eaeb7",
                border: "1px solid #d8eef2",
                borderRadius: 1,
              }}
            >
              <DeleteOutlineOutlinedIcon fontSize="small" />
            </IconButton>
          </Box>
        </SectionCard>
      ))}

      <Box
        sx={{
          mt: 2,
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr 1.3fr",
          gap: 2,
        }}
      >
        <SectionCard title="Paramètres de la tranche">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 1.5,
            }}
          >
            <TextField
              {...numericTextFieldProps(
                value.parametres.montantOffre,
                (next) => updateParametreField("montantOffre", next),
                "Montant de l'offre"
              )}
            />
            <TextField
              {...numericTextFieldProps(
                value.parametres.nombreActions,
                (next) => updateParametreField("nombreActions", next),
                "Nombre d’actions"
              )}
            />
            <TextField
              {...numericTextFieldProps(
                value.parametres.prixSouscription,
                (next) => updateParametreField("prixSouscription", next),
                "Prix de souscription"
              )}
            />
            <TextField
              {...numericTextFieldProps(
                value.parametres.montantGlobalOperationPercent,
                (next) => updateParametreField("montantGlobalOperationPercent", next),
                "Montant global de l’opération (%)"
              )}
            />
            <TextField
              {...numericTextFieldProps(
                value.parametres.plafondSouscriptionsParInvestisseur,
                (next) => updateParametreField("plafondSouscriptionsParInvestisseur", next),
                "Plafond des souscriptions par inv..."
              )}
            />
            <TextField
              {...numericTextFieldProps(
                value.parametres.minSouscriptionParInvestisseur,
                (next) => updateParametreField("minSouscriptionParInvestisseur", next),
                "Min de souscription par investisseur"
              )}
            />
          </Box>
        </SectionCard>

        <SectionCard title="Frais">
          <Box sx={{ display: "grid", gap: 1.5 }}>
            <TextField
              {...numericTextFieldProps(
                value.frais.impotBourse,
                (next) => updateFraisField("impotBourse", next),
                "Impôt de bourse"
              )}
            />
            <TextField
              {...numericTextFieldProps(
                value.frais.fraisIntermediation,
                (next) => updateFraisField("fraisIntermediation", next),
                "Frais intermédiation"
              )}
            />
            <TextField
              {...numericTextFieldProps(
                value.frais.fraisTransaction,
                (next) => updateFraisField("fraisTransaction", next),
                "Frais de transaction"
              )}
            />
          </Box>
        </SectionCard>

        <SectionCard title="Méthode de paiement">
          <Box sx={{ display: "grid", gap: 1.5 }}>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <TextField
                {...numericTextFieldProps(
                  value.methodePaiement.credit,
                  (next) => updateMethodePaiementField("credit", next),
                  "Credit (%)"
                )}
              />
              <Typography sx={{ fontSize: 13, color: "#4d5a68" }}>
                Obligatoire
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <TextField
                {...numericTextFieldProps(
                  value.methodePaiement.comptant,
                  (next) => updateMethodePaiementField("comptant", next),
                  "Comptant..."
                )}
              />
              <Typography sx={{ fontSize: 13, color: "#4d5a68" }}>
                Obligatoire
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <TextField
                {...numericTextFieldProps(
                  value.methodePaiement.collateral,
                  (next) => updateMethodePaiementField("collateral", next),
                  "Collatéral..."
                )}
              />
              <Typography sx={{ fontSize: 13, color: "#4d5a68" }}>
                Obligatoire
              </Typography>
            </Box>
          </Box>
        </SectionCard>

        <SectionCard title="Allocation">
          <Box sx={{ display: "grid", gap: 2 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#1cb7c8" }}>
              Modalité d’allocation
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography sx={{ fontSize: 13, color: "#4d5a68" }}>
                Prorata des demandes
              </Typography>
              <ToggleChoice
                text=""
                active={value.allocation.prorataDemandes}
                onClick={() =>
                  updateAllocationField(
                    "prorataDemandes",
                    !value.allocation.prorataDemandes
                  )
                }
              />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography sx={{ fontSize: 13, color: "#4d5a68" }}>
                Par itération
              </Typography>
              <ToggleChoice
                text=""
                active={value.allocation.parIteration}
                onClick={() =>
                  updateAllocationField(
                    "parIteration",
                    !value.allocation.parIteration
                  )
                }
              />
            </Box>
          </Box>
        </SectionCard>

        <SectionCard title="Couverture souscription">
          <Box sx={{ display: "grid", gap: 1.5 }}>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
              <TextField
                {...numericTextFieldProps(
                  value.couvertureSouscription.tauxCouverture,
                  (next) => updateCouvertureField("tauxCouverture", next),
                  "Taux de couverture"
                )}
              />
              <TextField
                {...numericTextFieldProps(
                  value.couvertureSouscription.moyensCouverture,
                  (next) => updateCouvertureField("moyensCouverture", next),
                  "Moyens de couver..."
                )}
              />
            </Box>

            <Box
              sx={{
                border: "1px solid #e6edf2",
                borderRadius: 1,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  px: 1.25,
                  py: 0.75,
                  bgcolor: "#eefafb",
                  borderBottom: "1px solid #e6edf2",
                }}
              >
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#6a7a89" }}>
                  Placement
                </Typography>
              </Box>

              <Box sx={{ p: 1.25, display: "grid", gap: 1 }}>
                <Box
                  sx={{
                    border: "1px solid #e7edf2",
                    borderRadius: 1,
                    px: 1,
                    py: 0.9,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    flexWrap: "wrap",
                    minHeight: 40,
                  }}
                >
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#1cb7c8" }}>
                    Statut investisseur :
                  </Typography>
                  <ToggleChoice
                    text="Qualifié"
                    active={value.couvertureSouscription.statutInvestisseur === "qualifie"}
                    onClick={() =>
                      updateCouvertureField(
                        "statutInvestisseur",
                        value.couvertureSouscription.statutInvestisseur === "qualifie"
                          ? ""
                          : "qualifie"
                      )
                    }
                  />
                  <ToggleChoice
                    text="Non Qualifié"
                    active={value.couvertureSouscription.statutInvestisseur === "non-qualifie"}
                    onClick={() =>
                      updateCouvertureField(
                        "statutInvestisseur",
                        value.couvertureSouscription.statutInvestisseur === "non-qualifie"
                          ? ""
                          : "non-qualifie"
                      )
                    }
                  />
                </Box>

                <Box
                  sx={{
                    border: "1px solid #e7edf2",
                    borderRadius: 1,
                    px: 1,
                    py: 0.9,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    flexWrap: "wrap",
                    minHeight: 40,
                  }}
                >
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#1cb7c8" }}>
                    Droit applicable :
                  </Typography>
                  <ToggleChoice
                    text="Marocain"
                    active={value.couvertureSouscription.droitApplicable === "marocain"}
                    onClick={() =>
                      updateCouvertureField(
                        "droitApplicable",
                        value.couvertureSouscription.droitApplicable === "marocain"
                          ? ""
                          : "marocain"
                      )
                    }
                  />
                  <ToggleChoice
                    text="étranger"
                    active={value.couvertureSouscription.droitApplicable === "etranger"}
                    onClick={() =>
                      updateCouvertureField(
                        "droitApplicable",
                        value.couvertureSouscription.droitApplicable === "etranger"
                          ? ""
                          : "etranger"
                      )
                    }
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </SectionCard>
      </Box>
    </Box>
  );
}