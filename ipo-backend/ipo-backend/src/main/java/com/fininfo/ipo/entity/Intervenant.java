package com.fininfo.ipo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Intervenant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String prenom;
    private String categorie;  // e.g., "Conseiller financier", "Chef de file", "Membre du syndicat"
    private String code;       // an internal identifier if needed
}