package com.fininfo.ipobackend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "offre_ipo")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OffreIPO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 20)
    private String reference;

    /** "FIXED" or "VARIABLE" */
    @Column(name = "type_offre", nullable = false, length = 20)
    private String typeOffre;

    /** "PREVALIDE", "VALIDE", "ANNULE" */
    @Column(nullable = false, length = 20)
    private String status;

    @Column(name = "nature_titre", length = 100)
    private String natureTitre;

    @Column(name = "prix_souscription", precision = 18, scale = 2)
    private BigDecimal prixSouscription;

    @Column(name = "nb_nouvelles_actions")
    private Long nbNouvellesActions;

    @Column(name = "montant_global_operation", precision = 18, scale = 2)
    private BigDecimal montantGlobalOperation;

    @Column(name = "valeur_nominale", precision = 18, scale = 2)
    private BigDecimal valeurNominale;

    @Column(name = "periode_debut_souscription")
    private LocalDate periodeDebutSouscription;

    @Column(name = "periode_fin_souscription")
    private LocalDate periodeFinSouscription;

    @Column(name = "nb_actions_ceder")
    private Long nbActionsCeder;

    @Column(name = "date_visa_ammc")
    private LocalDate dateVisaAmmc;

    @Column(name = "reference_visa_ammc", length = 100)
    private String referenceVisaAmmc;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) this.status = "PREVALIDE";
    }

    @PreUpdate
    void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
