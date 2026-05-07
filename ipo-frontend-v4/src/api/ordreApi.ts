// ordreApi.ts
// Functions for interacting with /api/ordres endpoints.

import { apiGet, apiPost, apiPut, apiPatch } from "./apiClient";

// ── Types (mirrors backend DTOs) ─────────────────────────────────────────────

export interface OrdreRow {
  id: number;
  reference: string;
  quantite: number | null;
  clientLabel: string;
  societeBourse: string;
  status: string;
  createdAt: string;
}

export interface OrdreDetail {
  id: number | null;
  reference: string | null;
  clientId: string;
  clientLabel: string;
  compteEspeces: string;
  compteTitres: string;
  instrumentId: string;
  mnemonique: string;
  isin: string;
  typeOrdre: string;
  typeMarche: string;
  societeBourse: string;
  quantite: number | null;
  prix: number | null;
  validite: string;
  referenceIpo: string;
  trancheId: number | null;
  offreIpoId: number | null; // ← IPO FK returned by backend for edit/view mode
  status: string | null;
}

// ── API functions ─────────────────────────────────────────────────────────────

/** GET /api/ordres — returns list of all collecte orders */
export const fetchOrdreList = (): Promise<OrdreRow[]> =>
  apiGet<OrdreRow[]>("/api/ordres");

/** GET /api/ordres/{id} — returns full order detail */
export const fetchOrdreById = (id: number | string): Promise<OrdreDetail> =>
  apiGet<OrdreDetail>(`/api/ordres/${id}`);

/** POST /api/ordres — creates a new collecte order */
export const createOrdre = (data: OrdreDetail): Promise<OrdreDetail> =>
  apiPost<OrdreDetail>("/api/ordres", data);

/** PUT /api/ordres/{id} — updates a collecte order */
export const updateOrdre = (id: number | string, data: OrdreDetail): Promise<OrdreDetail> =>
  apiPut<OrdreDetail>(`/api/ordres/${id}`, data);

/** PATCH /api/ordres/{id}/validate — validates a collecte order */
export const validateOrdre = (id: number | string): Promise<OrdreDetail> =>
  apiPatch<OrdreDetail>(`/api/ordres/${id}/validate`);
