package com.fininfo.ipo.dto;

import lombok.Data;

@Data
public class InvestisseurProfile {
    // Common fields
    private String typePersonne;        // "Physique", "Moral"
    private String residence;           // "Résident", "Non résident"
    private String nationalite;         // "Marocaine", "étrangère"

    // Corporate specific
    private String regimeRemuneration;  // "CDI", "CDD", "Autres"
    private String conditionEligibilite;// "Titulaire", "Non démissionnaire"
    private String anciennete;          // "Salarié", "Dirigeant/salarié", "Dirigeant"
    private Boolean mineur;             // true/false

    // Syndicate specific
    private Boolean titulaire;          // Is a registered syndicate member?
    private Boolean inscritListeSyndicat;
}