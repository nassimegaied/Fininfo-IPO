// MOCK DATA for Prototype

export const ipoRows = [
  { id: 30, reference: "CAM0000012", prix: "25,00", typeOffre: "À prix ferme", status: "Prévalidé" },
  { id: 29, reference: "CAM0000011", prix: "25,00", typeOffre: "À prix ferme", status: "Validé" },
  { id: 28, reference: "CAM0000010", prix: "25,00", typeOffre: "À prix ferme", status: "Validé" },
  { id: 27, reference: "CAM0000009", prix: "3 000,00", typeOffre: "À prix ferme", status: "Validé" },
  { id: 26, reference: "CAM0000008", prix: "25,00", typeOffre: "À prix ferme", status: "Prévalidé" },
  { id: 25, reference: "CAM0000007", prix: "25,00", typeOffre: "À prix ferme", status: "Prévalidé" },
  { id: 24, reference: "CAM0000006", prix: "0,00", typeOffre: "À prix variable", status: "Prévalidé" },
  { id: 23, reference: "CAM0000005", prix: "25,00", typeOffre: "À prix ferme", status: "Prévalidé" },
];

export const clients = [
  { id: "client-fake", label: "Client-fake", compteEspeces: "12343434343", compteTitres: "9999999999", devise: "MAD" },
  { id: "poc-client-01", label: "POC-Client-01", compteEspeces: "22223333444", compteTitres: "1000000001", devise: "MAD" },
  { id: "poc-client-1a", label: "Poc-Client-1", compteEspeces: "55556666777", compteTitres: "1000000002", devise: "EUR" },
  { id: "poc-client-1b", label: "Poc-Client-1 ", compteEspeces: "88889999000", compteTitres: "1000000003", devise: "USD" },
  { id: "poc01-client", label: "POC01-Client", compteEspeces: "77770000111", compteTitres: "1000000004", devise: "MAD" },
  { id: "client-opcvm", label: "CLIENT OPCVM TTC14", compteEspeces: "44445555666", compteTitres: "1000000005", devise: "MAD" },
];

export const instruments = [
  { id: "eqty-ref-01", mnemonique: "EQTY-REF-01", isin: "US0378331005", codeValeur: "EQTY-CDGK-01", description: "Listed Stock Example", groupeCotation: "Actions cotées en Continu", placeDenouement: "MAROCLEAR" },
  { id: "eqty-ref-02", mnemonique: "EQTY-REF-02", isin: "FR0000120271", codeValeur: "EQTY-CDGK-02", description: "Second Listed Example", groupeCotation: "Actions cotées au fixing", placeDenouement: "MAROCLEAR" },
];

export const societesBourse = ["ENT0000198", "ENT0000456", "ENT0000789"];
export const typesOrdre = ["Ordre à déclenchement", "Ordre à meilleure limite", "Ordre au marché"];
export const typesMarche = ["Secondaire", "Primaire", "IPO"];
export const validitesOrdre = ["Jour", "À date déterminée"];

export const tranches = [
  { id: "tranche-1", label: "Tranche 1", referenceIpo: "CAM0000004" },
  { id: "tranche-2", label: "Tranche 2", referenceIpo: "CAM0000005" },
];
