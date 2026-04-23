package com.fininfo.ipo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class TranchePersonnelSyndicat extends Tranche {

    // Specific eligibility fields for syndicate placement personnel
    private String typePersonne;       // "Physique", "Moral"
    private String residence;          // "Résident", "Non résident"
    private String nationalite;        // "Marocaine", "étrangère"
    private Boolean titulaire;         // Is the person a registered syndicate member?
    private Boolean mineur;

    // Additional field from the form: "Inscrit sur la liste validée par l'organisme compétent du syndicat"
    private Boolean inscritListeSyndicat;
}