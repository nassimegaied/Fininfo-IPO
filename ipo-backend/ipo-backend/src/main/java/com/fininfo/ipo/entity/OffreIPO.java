package com.fininfo.ipo.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OffreIPO {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String typeOffre;        // "PRIX_FERME" or "PRIX_VARIABLE"
    private String natureTitre;      // e.g., code ISIN
    private BigDecimal montantGlobal;
    private LocalDateTime periodeDebut;
    private LocalDateTime periodeFin;
    private String referenceVisaAMMC;
    private LocalDate dateVisa;
    private Integer nombreActionsACeder;
    private Integer nombreNouvellesActions;

    // Intervenants
    @ManyToOne
    private Intervenant conseillerFinancier;

    @ManyToOne
    private Intervenant chefFile;

    @ManyToOne
    private Intervenant coChefFile;

    @ManyToMany
    private List<Intervenant> membresSyndicat;

    // Tranches (will be created next)
    @OneToMany(mappedBy = "offreIPO", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Tranche> tranches;
}