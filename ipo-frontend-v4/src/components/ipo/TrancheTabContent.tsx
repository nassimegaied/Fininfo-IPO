import { Box, IconButton, TextField, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import type { TrancheData } from "../../types/ipo";

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
  rightAction,
  children,
}: {
  title: string;
  rightAction?: React.ReactNode;
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
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#6a7a89" }}>
          {title}
        </Typography>
        {rightAction}
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
};

const onlyDigits = (input: string) => input.replace(/\D/g, "");

type TrancheTabContentProps = {
  value: TrancheData;
  onChange: (nextValue: TrancheData) => void;
};

export default function TrancheTabContent({
  value,
  onChange,
}: TrancheTabContentProps) {
  const updatePrerequisField = (
    field: keyof TrancheData["prerequis"],
    fieldValue: string
  ) => {
    onChange({
      ...value,
      prerequis: {
        ...value.prerequis,
        [field]: fieldValue,
      },
    });
  };

  const updateConditionsField = (
    field: keyof TrancheData["conditionsExclusion"],
    fieldValue: boolean
  ) => {
    onChange({
      ...value,
      conditionsExclusion: {
        ...value.conditionsExclusion,
        [field]: fieldValue,
      },
    });
  };

  const updateParametreField = (
    field: keyof TrancheData["parametres"],
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
    field: keyof TrancheData["frais"],
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
    field: keyof TrancheData["methodePaiement"],
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
    field: keyof TrancheData["allocation"],
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
    field: keyof TrancheData["couvertureSouscription"],
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
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "2.4fr 1.2fr 1fr",
          gap: 2,
          mb: 2,
        }}
      >
        <SectionCard title="Prérequis">
          <Box sx={{ display: "grid", gap: 1.25 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 1.25,
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
                  active={value.prerequis.type === "physique"}
                  onClick={() =>
                    updatePrerequisField(
                      "type",
                      value.prerequis.type === "physique" ? "" : "physique"
                    )
                  }
                />
                <ToggleChoice
                  text="Moral"
                  active={value.prerequis.type === "moral"}
                  onClick={() =>
                    updatePrerequisField(
                      "type",
                      value.prerequis.type === "moral" ? "" : "moral"
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
                  minHeight: 40,
                }}
              >
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#1cb7c8" }}>
                  Nationalité :
                </Typography>
                <ToggleChoice
                  text="Marocaine"
                  active={value.prerequis.nationalite === "marocaine"}
                  onClick={() =>
                    updatePrerequisField(
                      "nationalite",
                      value.prerequis.nationalite === "marocaine" ? "" : "marocaine"
                    )
                  }
                />
                <ToggleChoice
                  text="étrangère"
                  active={value.prerequis.nationalite === "etrangere"}
                  onClick={() =>
                    updatePrerequisField(
                      "nationalite",
                      value.prerequis.nationalite === "etrangere" ? "" : "etrangere"
                    )
                  }
                />
              </Box>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 1.25,
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
                  Droits applicables :
                </Typography>
                <ToggleChoice
                  text="Droit Marocain"
                  active={value.prerequis.droitsApplicables === "marocain"}
                  onClick={() =>
                    updatePrerequisField(
                      "droitsApplicables",
                      value.prerequis.droitsApplicables === "marocain"
                        ? ""
                        : "marocain"
                    )
                  }
                />
                <ToggleChoice
                  text="Droit étranger"
                  active={value.prerequis.droitsApplicables === "etranger"}
                  onClick={() =>
                    updatePrerequisField(
                      "droitsApplicables",
                      value.prerequis.droitsApplicables === "etranger"
                        ? ""
                        : "etranger"
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
                  minHeight: 40,
                }}
              >
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#1cb7c8" }}>
                  Statut d'investisseur :
                </Typography>
                <ToggleChoice
                  text="Droit Qualifié"
                  active={value.prerequis.statutInvestisseur === "qualifie"}
                  onClick={() =>
                    updatePrerequisField(
                      "statutInvestisseur",
                      value.prerequis.statutInvestisseur === "qualifie"
                        ? ""
                        : "qualifie"
                    )
                  }
                />
                <ToggleChoice
                  text="Droit Non Qualifié"
                  active={value.prerequis.statutInvestisseur === "non-qualifie"}
                  onClick={() =>
                    updatePrerequisField(
                      "statutInvestisseur",
                      value.prerequis.statutInvestisseur === "non-qualifie"
                        ? ""
                        : "non-qualifie"
                    )
                  }
                />
              </Box>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 1.25,
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
                  Résidence :
                </Typography>
                <ToggleChoice
                  text="Résident"
                  active={value.prerequis.residence === "resident"}
                  onClick={() =>
                    updatePrerequisField(
                      "residence",
                      value.prerequis.residence === "resident" ? "" : "resident"
                    )
                  }
                />
                <ToggleChoice
                  text="Non résident"
                  active={value.prerequis.residence === "non-resident"}
                  onClick={() =>
                    updatePrerequisField(
                      "residence",
                      value.prerequis.residence === "non-resident"
                        ? ""
                        : "non-resident"
                    )
                  }
                />
              </Box>

              <Box
                sx={{
                  border: "1px solid #e7edf2",
                  borderRadius: 1,
                  px: 1,
                  py: 0.7,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  minHeight: 40,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#1cb7c8",
                    whiteSpace: "nowrap",
                  }}
                >
                  Justifiant de plus de
                </Typography>
                <TextField
                  {...numericTextFieldProps(
                    value.prerequis.justifiantPlusDe,
                    (next) => updatePrerequisField("justifiantPlusDe", next),
                    ""
                  )}
                  sx={{
                    width: 180,
                    ...fieldSx,
                    "& .MuiOutlinedInput-root": {
                      height: 34,
                      fontSize: 13,
                    },
                  }}
                />
                <Typography sx={{ fontSize: 13, color: "#4d5a68" }}>
                  ans
                </Typography>
              </Box>
            </Box>
          </Box>
        </SectionCard>

        <SectionCard
          title="Autres Prérequis"
          rightAction={
            <IconButton
              size="small"
              sx={{
                bgcolor: "#19bccb",
                color: "#fff",
                borderRadius: 1,
                width: 28,
                height: 28,
                "&:hover": { bgcolor: "#15aab8" },
              }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          }
        >
          <Box sx={{ minHeight: 135 }} />
        </SectionCard>

        <SectionCard title="Conditions d'exclusion">
          <Box sx={{ display: "grid", gap: 1.25 }}>
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
              <ToggleChoice
                text="Client"
                active={value.conditionsExclusion.client}
                onClick={() =>
                  updateConditionsField(
                    "client",
                    !value.conditionsExclusion.client
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
                flexDirection: "column",
                gap: 0.9,
                minHeight: 72,
              }}
            >
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#1cb7c8",
                }}
              >
                Type OPCVM :
              </Typography>

              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <ToggleChoice
                  text="Qualifié"
                  active={value.conditionsExclusion.typeOpcvmQualifie}
                  onClick={() =>
                    updateConditionsField(
                      "typeOpcvmQualifie",
                      !value.conditionsExclusion.typeOpcvmQualifie
                    )
                  }
                />

                <ToggleChoice
                  text="Obligataire"
                  active={value.conditionsExclusion.typeOpcvmObligataire}
                  onClick={() =>
                    updateConditionsField(
                      "typeOpcvmObligataire",
                      !value.conditionsExclusion.typeOpcvmObligataire
                    )
                  }
                />
              </Box>
            </Box>
          </Box>
        </SectionCard>
      </Box>

      <Box
        sx={{
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
                (next) =>
                  updateParametreField("montantGlobalOperationPercent", next),
                "Montant global de l’opération (%)"
              )}
            />
            <TextField
              {...numericTextFieldProps(
                value.parametres.plafondSouscriptionsParInvestisseur,
                (next) =>
                  updateParametreField(
                    "plafondSouscriptionsParInvestisseur",
                    next
                  ),
                "Plafond des souscriptions par inv..."
              )}
            />
            <TextField
              {...numericTextFieldProps(
                value.parametres.minSouscriptionParInvestisseur,
                (next) =>
                  updateParametreField("minSouscriptionParInvestisseur", next),
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