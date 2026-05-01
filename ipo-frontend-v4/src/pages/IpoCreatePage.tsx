import { useMemo, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import IpoDetailsForm from "../components/ipo/IpoDetailsForm";
import OperationParticipantsPanel from "../components/ipo/OperationParticipantsPanel";
import IpoTabsBar from "../components/ipo/IpoTabsBar";
import ConfirmDialog from "../components/ipo/ConfirmDialog";
import ImportFileModal from "../components/ipo/ImportFileModal";
import { useNavigate } from "react-router-dom";
import type {
  CorporatePrerequisItem,
  IpoFormData,
  SyndicatePrerequisItem,
  SyndicateTabData,
  TrancheData,
} from "../types/ipo";

type IpoPageMode = "create" | "edit" | "view";

type IpoCreatePageProps = {
  mode?: IpoPageMode;
  initialData?: IpoFormData;
};

function createEmptyCorporateItem(id: string): CorporatePrerequisItem {
  return {
    id,
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
    dirigeantSalarie: "",
    regimeRemuneration: "",
    titulaire: false,
    nonDemissionnaire: false,
    anciennete: "",
    mineur: false,
  };
}

function createEmptySyndicateItem(id: string): SyndicatePrerequisItem {
  return {
    id,
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
  };
}

function createEmptyIpoFormData(): IpoFormData {
  return {
    details: {
      offerType: "fixed",
      natureTitre: "",
      prixSouscription: "",
      nbNouvellesActions: "",
      montantGlobalOperation: "",
      valeurNominale: "",
      periodeDebutSouscription: "",
      periodeFinSouscription: "",
      nbActionsCeder: "",
      dateVisaAmmc: "",
      referenceVisaAmmc: "",
    },
    participants: {
      conseiller: [],
      chef: [],
      coChef: [],
      membre: [],
    },
    corporate: {
      prerequisItems: [createEmptyCorporateItem("corp-1")],
      parametres: {
        montantOffre: "",
        nombreActions: "",
        prixSouscription: "",
        montantGlobalOperationPercent: "",
        plafondSouscriptionsParInvestisseur: "",
        minSouscriptionParInvestisseur: "",
      },
      frais: {
        impotBourse: "",
        fraisIntermediation: "",
        fraisTransaction: "",
      },
      methodePaiement: {
        credit: "",
        comptant: "",
        collateral: "",
      },
      allocation: {
        prorataDemandes: false,
        parIteration: false,
      },
      couvertureSouscription: {
        tauxCouverture: "",
        moyensCouverture: "",
        statutInvestisseur: "",
        droitApplicable: "",
      },
    },
    syndicate: {
      prerequisItems: [createEmptySyndicateItem("synd-1")],
      parametres: {
        montantOffre: "",
        nombreActions: "",
        prixSouscription: "",
        montantGlobalOperationPercent: "",
        plafondSouscriptionsParInvestisseur: "",
        minSouscriptionParInvestisseur: "",
      },
      frais: {
        impotBourse: "",
        fraisIntermediation: "",
        fraisTransaction: "",
      },
      methodePaiement: {
        credit: "",
        comptant: "",
        collateral: "",
      },
      allocation: {
        prorataDemandes: false,
        parIteration: false,
      },
      couvertureSouscription: {
        tauxCouverture: "",
        moyensCouverture: "",
        statutInvestisseur: "",
        droitApplicable: "",
      },
    },
    tranches: [],
  };
}

function createEmptyTranche(nextIndex: number): TrancheData {
  return {
    id: `tranche-${nextIndex}`,
    label: `Tranche ${nextIndex}`,
    prerequis: {
      type: "",
      nationalite: "",
      droitsApplicables: "",
      statutInvestisseur: "",
      residence: "",
      justifiantPlusDe: "",
    },
    conditionsExclusion: {
      client: false,
      typeOpcvmQualifie: false,
      typeOpcvmObligataire: false,
    },
    parametres: {
      montantOffre: "",
      nombreActions: "",
      prixSouscription: "",
      montantGlobalOperationPercent: "",
      plafondSouscriptionsParInvestisseur: "",
      minSouscriptionParInvestisseur: "",
    },
    frais: {
      impotBourse: "",
      fraisIntermediation: "",
      fraisTransaction: "",
    },
    methodePaiement: {
      credit: "",
      comptant: "",
      collateral: "",
    },
    allocation: {
      prorataDemandes: false,
      parIteration: false,
    },
    couvertureSouscription: {
      tauxCouverture: "",
      moyensCouverture: "",
      statutInvestisseur: "",
      droitApplicable: "",
    },
  };
}

export default function IpoCreatePage({
  mode = "create",
  initialData,
}: IpoCreatePageProps) {
  const navigate = useNavigate();
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";

  const [formData, setFormData] = useState<IpoFormData>(
    initialData ?? createEmptyIpoFormData()
  );
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);

  const pageTitle = useMemo(() => {
    if (mode === "view") return "CONSULTATION INTRODUCTION EN BOURSE";
    if (mode === "edit") return "MODIFICATION INTRODUCTION EN BOURSE";
    return "INTRODUCTION EN BOURSE";
  }, [mode]);

  const pageSubtitle = useMemo(() => {
    if (mode === "view") return "Consultation introduction en bourse";
    if (mode === "edit") return "Modification introduction en bourse";
    return "Introduction en bourse";
  }, [mode]);

  const handleSave = () => {
    if (isViewMode) return;
    console.log("IPO FORM DATA =", formData);
  };

  const handleAskCancel = () => {
    if (isViewMode) {
      navigate("/ipo");
      return;
    }
    setConfirmCancelOpen(true);
  };

  const handleConfirmCancel = () => {
    setFormData(initialData ?? createEmptyIpoFormData());
    setConfirmCancelOpen(false);
    navigate("/ipo");
  };

  const handleCloseCancelDialog = () => {
    setConfirmCancelOpen(false);
  };

  const handleOpenImportModal = () => {
    if (isViewMode) return;
    setImportModalOpen(true);
  };

  const handleCloseImportModal = () => {
    setImportModalOpen(false);
  };

  const handleImportFile = (payload: {
    file: File | null;
    commentaire: string;
    statut: string;
    dateDebut: string;
    dateFin: string;
  }) => {
    if (isViewMode) return;
    console.log("Imported file payload =", payload);
    setImportModalOpen(false);
  };

  const handleAddTranche = () => {
    if (isViewMode) return;

    setFormData((prev) => {
      const nextIndex = prev.tranches.length + 1;
      return {
        ...prev,
        tranches: [...prev.tranches, createEmptyTranche(nextIndex)],
      };
    });
  };

  const handleUpdateTranche = (
    trancheId: string,
    nextTranche: TrancheData
  ) => {
    if (isViewMode) return;

    setFormData((prev) => ({
      ...prev,
      tranches: prev.tranches.map((tranche) =>
        tranche.id === trancheId ? nextTranche : tranche
      ),
    }));
  };

  const handleDeleteTranche = (trancheId: string) => {
    if (isViewMode) return;

    setFormData((prev) => ({
      ...prev,
      tranches: prev.tranches.filter((tranche) => tranche.id !== trancheId),
    }));
  };

  return (
    <>
      <Box sx={{ px: 2.5, py: 3 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: 24,
                      fontWeight: 700,
                      color: "#111827",
                      letterSpacing: 0.2,
                    }}
                  >
                    {pageTitle}
                  </Typography>
                  <Typography
                    sx={{ color: "#7a8699", mt: 0.5, fontSize: 14 }}
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
                      "&:hover": {
                        borderColor: "#25a5b8",
                        bgcolor: "#f2fdff",
                      },
                    }}
                  >
                    {isViewMode ? "Retour" : "Annuler"}
                  </Button>

                  {!isViewMode && (
                    <Button
                      variant="outlined"
                      startIcon={<UploadFileOutlinedIcon />}
                      onClick={handleOpenImportModal}
                      sx={{
                        textTransform: "none",
                        borderColor: "#33b7c9",
                        color: "#33b7c9",
                        px: 2.5,
                        py: 1,
                        borderRadius: 2,
                        fontWeight: 500,
                        "&:hover": {
                          borderColor: "#25a5b8",
                          bgcolor: "#f2fdff",
                        },
                      }}
                    >
                      IMPORTER
                    </Button>
                  )}

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
                  display: "grid",
                  gridTemplateColumns: "1.9fr 1fr",
                  gap: 2,
                  alignItems: "stretch",
                  pointerEvents: isViewMode ? "none" : "auto",
                  opacity: isViewMode ? 0.92 : 1,
                }}
              >
                <Box>
                  <IpoDetailsForm
                    value={formData.details}
                    onChange={(nextDetails) =>
                      setFormData((prev) => ({
                        ...prev,
                        details: nextDetails,
                      }))
                    }
                  />
                </Box>

                <Box>
                  <OperationParticipantsPanel
                    value={formData.participants}
                    onChange={(nextParticipants) =>
                      setFormData((prev) => ({
                        ...prev,
                        participants: nextParticipants,
                      }))
                    }
                  />
                </Box>
              </Box>

              <Box
                sx={{
                  pointerEvents: isViewMode ? "none" : "auto",
                  opacity: isViewMode ? 0.92 : 1,
                }}
              >
                <IpoTabsBar
                  corporateValue={formData.corporate}
                  onCorporateChange={(nextCorporate) =>
                    setFormData((prev) => ({
                      ...prev,
                      corporate: nextCorporate,
                    }))
                  }
                  syndicateValue={formData.syndicate}
                  onSyndicateChange={(nextSyndicate: SyndicateTabData) =>
                    setFormData((prev) => ({
                      ...prev,
                      syndicate: nextSyndicate,
                    }))
                  }
                  tranches={formData.tranches}
                  onAddTranche={handleAddTranche}
                  onUpdateTranche={handleUpdateTranche}
                  onDeleteTranche={handleDeleteTranche}
                />
              </Box>
            </Box>
          </Box>

      {!isViewMode && (
        <ConfirmDialog
          open={confirmCancelOpen}
          title="Confirmer l’annulation"
          message="Voulez-vous vraiment annuler et revenir à la liste des IPO ?"
          confirmLabel="Oui, annuler"
          cancelLabel="Retour"
          onConfirm={handleConfirmCancel}
          onCancel={handleCloseCancelDialog}
        />
      )}

      {!isViewMode && (
        <ImportFileModal
          open={importModalOpen}
          onClose={handleCloseImportModal}
          onImport={handleImportFile}
        />
      )}
    </>
  );
}