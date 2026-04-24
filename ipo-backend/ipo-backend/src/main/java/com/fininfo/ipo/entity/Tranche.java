package com.fininfo.ipo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class Tranche {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;                    // "Personnel corporate", "Personnel syndicat", etc.

    // Paramètres de la tranche (common fields)
    private BigDecimal montantOffre;
    private Integer nombreActions;
    private BigDecimal prixSouscription;
    private BigDecimal pourcentageMontantGlobal; // e.g., 30.5
    private BigDecimal plafondSouscription;       // max per investor
    private BigDecimal minSouscription;           // min per investor

    // Frais
    private BigDecimal impotBourse;
    private BigDecimal fraisIntermediation;
    private BigDecimal fraisTransaction;

    // Méthode de paiement
    private Boolean creditObligatoire;
    private Boolean comptantObligatoire;
    private Boolean collateralObligatoire;

    // Allocation
    private String modaliteAllocation;   // "Prorata des demandes" or "Par itération"

    // Couverture
    private BigDecimal tauxCouverture;
    private String moyensCouverture;

    // Placement
    private String statutInvestisseur;   // "Qualifié" / "Non Qualifié"
    private String droitApplicable;      // "Marocain" / "étranger"

    // Each tranche belongs to one IPO offer
    @ManyToOne
    @JoinColumn(name = "offreipo_id")
    @JsonIgnore

    private OffreIPO offreIPO;
}