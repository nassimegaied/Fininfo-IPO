export type OfferType = "fixed" | "variable";

export interface IpoDetailsData {
  offerType: OfferType;
  natureTitre: string;
  prixSouscription: string;
  nbNouvellesActions: string;
  montantGlobalOperation: string;
  valeurNominale: string;
  periodeDebutSouscription: string;
  periodeFinSouscription: string;
  nbActionsCeder: string;
  dateVisaAmmc: string;
  referenceVisaAmmc: string;
}

export interface ParticipantCandidate {
  id: string;
  name: string;
}

export interface IpoParticipantsData {
  conseiller: ParticipantCandidate[];
  chef: ParticipantCandidate[];
  coChef: ParticipantCandidate[];
  membre: ParticipantCandidate[];
}

export interface TrancheParametresData {
  montantOffre: string;
  nombreActions: string;
  prixSouscription: string;
  montantGlobalOperationPercent: string;
  plafondSouscriptionsParInvestisseur: string;
  minSouscriptionParInvestisseur: string;
}

export interface TrancheFraisData {
  impotBourse: string;
  fraisIntermediation: string;
  fraisTransaction: string;
}

export interface TrancheMethodePaiementData {
  credit: string;
  comptant: string;
  collateral: string;
}

export interface TrancheAllocationData {
  prorataDemandes: boolean;
  parIteration: boolean;
}

export interface TrancheCouvertureSouscriptionData {
  tauxCouverture: string;
  moyensCouverture: string;
  statutInvestisseur: "" | "qualifie" | "non-qualifie";
  droitApplicable: "" | "marocain" | "etranger";
}

export interface CorporatePrerequisItem {
  id: string;
  nom: string;
  prenom: string;
  cin: string;
  compteTitre: string;
  compteEspece: string;
  dateNaissance: string;
  idSyndical: string;
  type: "" | "physique" | "moral";
  residence: "" | "resident" | "non-resident";
  nationalite: "" | "marocaine" | "etrangere";
  dirigeantSalarie: "" | "salarie" | "dirigeant";
  regimeRemuneration: "" | "cdi" | "cdd" | "autres";
  titulaire: boolean;
  nonDemissionnaire: boolean;
  anciennete: string;
  mineur: boolean;
}

export interface CorporateTabData {
  prerequisItems: CorporatePrerequisItem[];
  parametres: TrancheParametresData;
  frais: TrancheFraisData;
  methodePaiement: TrancheMethodePaiementData;
  allocation: TrancheAllocationData;
  couvertureSouscription: TrancheCouvertureSouscriptionData;
}

export interface SyndicatePrerequisItem {
  id: string;
  nom: string;
  prenom: string;
  cin: string;
  compteTitre: string;
  compteEspece: string;
  dateNaissance: string;
  idSyndical: string;
  type: "" | "physique" | "moral";
  residence: "" | "resident" | "non-resident";
  nationalite: "" | "marocaine" | "etrangere";
  titulaireAuSyndicat: boolean;
  mineur: boolean;
  inscritListeValidee: boolean;
}

export interface SyndicateTabData {
  prerequisItems: SyndicatePrerequisItem[];
  parametres: TrancheParametresData;
  frais: TrancheFraisData;
  methodePaiement: TrancheMethodePaiementData;
  allocation: TrancheAllocationData;
  couvertureSouscription: TrancheCouvertureSouscriptionData;
}

export interface TranchePrerequisData {
  type: "" | "physique" | "moral";
  nationalite: "" | "marocaine" | "etrangere";
  droitsApplicables: "" | "marocain" | "etranger";
  statutInvestisseur: "" | "qualifie" | "non-qualifie";
  residence: "" | "resident" | "non-resident";
  justifiantPlusDe: string;
}

export interface TrancheConditionsExclusionData {
  client: boolean;
  typeOpcvmQualifie: boolean;
  typeOpcvmObligataire: boolean;
}

export interface TrancheData {
  id: string;
  label: string;
  prerequis: TranchePrerequisData;
  conditionsExclusion: TrancheConditionsExclusionData;
  parametres: TrancheParametresData;
  frais: TrancheFraisData;
  methodePaiement: TrancheMethodePaiementData;
  allocation: TrancheAllocationData;
  couvertureSouscription: TrancheCouvertureSouscriptionData;
}

export interface IpoFormData {
  details: IpoDetailsData;
  participants: IpoParticipantsData;
  corporate: CorporateTabData;
  syndicate: SyndicateTabData;
  tranches: TrancheData[];
}

export interface NatureTitreOption {
  value: string;
  label: string;
}

export interface SaveIpoResponse {
  id: string;
  message: string;
}