import { apiGet } from "./apiClient";

export interface ClientOption {
  id: number;
  label: string;
  compteEspeces: string;
  compteTitres: string;
  devise: string;
}

export interface InstrumentOption {
  id: number;
  mnemonique: string;
  isin: string;
  codeValeur: string;
  description: string;
  groupeCotation: string;
  placeDenouement: string;
}

/** GET /api/clients */
export const fetchClients = (): Promise<ClientOption[]> =>
  apiGet<ClientOption[]>("/api/clients");

/** GET /api/instruments */
export const fetchInstruments = (): Promise<InstrumentOption[]> =>
  apiGet<InstrumentOption[]>("/api/instruments");
