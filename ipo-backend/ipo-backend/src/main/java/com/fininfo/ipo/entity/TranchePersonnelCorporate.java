package com.fininfo.ipo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class TranchePersonnelCorporate extends Tranche {

    // Specific eligibility fields for corporate personnel
    private String typePersonne;               // "Physique", "Moral"
    private String residence;                  // "Résident", "Non résident"
    private String nationalite;                // "Marocaine", "étrangère"
    private String regimeRemuneration;         // "CDI", "CDD", "Autres"
    private String conditionEligibilite;       // "Titulaire", "Non démissionnaire"
    private String anciennete;                 // "Dirigeant/salarié", "Salarié", "Dirigeant"
    private Boolean mineur;                    // true if minor

    // Régime de rémunération mensuel (could be a list, but for simplicity we keep a string)
    // You can add more if needed.
}