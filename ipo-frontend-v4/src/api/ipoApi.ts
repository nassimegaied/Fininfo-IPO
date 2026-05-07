// ipoApi.ts
// Functions for interacting with /api/offres endpoints.

import { apiGet, apiPost, apiPut, apiPatch } from "./apiClient";

// ── Types (mirrors backend DTOs) ─────────────────────────────────────────────

export interface IpoRow {
  id: number;
  reference: string;
  prixSouscription: number | null;
  typeOffre: string;
  status: string;
  createdAt: string;
}

export interface IpoDetail {
  id: number | null;
  reference: string | null;
  typeOffre: string;
  status: string | null;
  natureTitre: string;
  prixSouscription: number | null;
  nbNouvellesActions: number | null;
  montantGlobalOperation: number | null;
  valeurNominale: number | null;
  periodeDebutSouscription: string | null;
  periodeFinSouscription: string | null;
  nbActionsCeder: number | null;
  dateVisaAmmc: string | null;
  referenceVisaAmmc: string | null;
}

// ── API functions ─────────────────────────────────────────────────────────────

/** GET /api/offres — returns list of all IPO offers */
export const fetchIpoList = (): Promise<IpoRow[]> =>
  apiGet<IpoRow[]>("/api/offres");

/** GET /api/offres/{id} — returns full IPO detail */
export const fetchIpoById = (id: number | string): Promise<IpoDetail> =>
  apiGet<IpoDetail>(`/api/offres/${id}`);

/** POST /api/offres — creates a new IPO offer */
export const createIpo = (data: IpoDetail): Promise<IpoDetail> =>
  apiPost<IpoDetail>("/api/offres", data);

/** PUT /api/offres/{id} — updates an IPO offer */
export const updateIpo = (id: number | string, data: IpoDetail): Promise<IpoDetail> =>
  apiPut<IpoDetail>(`/api/offres/${id}`, data);

/** PATCH /api/offres/{id}/validate — validates an IPO offer */
export const validateIpo = (id: number | string): Promise<IpoDetail> =>
  apiPatch<IpoDetail>(`/api/offres/${id}/validate`);

/** Mirrors backend TrancheDTO — represents a tranche for a specific IPO */
export interface TrancheOption {
  id: number;
  label: string;        // "Tranche Corporate" | "Tranche Syndicale" | "Tranche 1"
  type: string;         // "CORPORATE" | "SYNDICAL" | "CUSTOM"
  referenceIpo: string; // e.g. "CAM0000001"
  offreIpoId: number;
}

/** GET /api/offres/{id}/tranches — returns the tranches for a given IPO */
export const fetchTranchesByIpo = (ipoId: number | string): Promise<TrancheOption[]> =>
  apiGet<TrancheOption[]>(`/api/offres/${ipoId}/tranches`);
