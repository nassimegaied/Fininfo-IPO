package com.fininfo.ipobackend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "ordre_collecte")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OrdreCollecte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 20)
    private String reference;

    // ── Client info ────────────────────────────────────────────────────────────
    @Column(name = "client_id", length = 100)
    private String clientId;

    @Column(name = "client_label", length = 200)
    private String clientLabel;

    @Column(name = "compte_especes", length = 50)
    private String compteEspeces;

    @Column(name = "compte_titres", length = 50)
    private String compteTitres;

    // ── Instrument info ────────────────────────────────────────────────────────
    @Column(name = "instrument_id", length = 100)
    private String instrumentId;

    @Column(name = "mnemonique", length = 50)
    private String mnemonique;

    @Column(name = "isin", length = 20)
    private String isin;

    // ── Order details ──────────────────────────────────────────────────────────
    @Column(name = "type_ordre", length = 100)
    private String typeOrdre;

    @Column(name = "type_marche", length = 100)
    private String typeMarche;

    @Column(name = "societe_bourse", length = 100)
    private String societeBourse;

    @Column(name = "quantite")
    private Long quantite;

    @Column(name = "prix", precision = 18, scale = 2)
    private BigDecimal prix;

    @Column(name = "validite", length = 50)
    private String validite;

    // ── IPO link ───────────────────────────────────────────────────────────────
    @Column(name = "reference_ipo", length = 20)
    private String referenceIpo;

    @Column(name = "tranche_id")
    private Long trancheId;

    // ── Status ─────────────────────────────────────────────────────────────────
    /** "EN_ATTENTE", "VALIDE", "REJETE" */
    @Column(nullable = false, length = 20)
    private String status;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) this.status = "EN_ATTENTE";
    }

    @PreUpdate
    void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
