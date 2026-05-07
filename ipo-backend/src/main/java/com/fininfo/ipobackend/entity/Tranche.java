package com.fininfo.ipobackend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "tranche_ipo")
public class Tranche {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Human-readable label shown in dropdowns: "Tranche Corporate", "Tranche Syndicale", "Tranche 1" */
    private String label;

    /** CORPORATE | SYNDICAL | CUSTOM */
    private String type;

    /** The IPO reference this tranche belongs to (e.g. CAM0000001) */
    private String referenceIpo;

    /** FK to OffreIPO */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "offre_ipo_id", nullable = false)
    private OffreIPO offreIpo;

    // ── Constructors ──────────────────────────────────────────────────────────

    public Tranche() {}

    public Tranche(String label, String type, String referenceIpo, OffreIPO offreIpo) {
        this.label       = label;
        this.type        = type;
        this.referenceIpo = referenceIpo;
        this.offreIpo    = offreIpo;
    }

    // ── Getters / Setters ─────────────────────────────────────────────────────

    public Long getId()                  { return id; }
    public void setId(Long id)           { this.id = id; }

    public String getLabel()             { return label; }
    public void setLabel(String label)   { this.label = label; }

    public String getType()              { return type; }
    public void setType(String type)     { this.type = type; }

    public String getReferenceIpo()                   { return referenceIpo; }
    public void setReferenceIpo(String referenceIpo)  { this.referenceIpo = referenceIpo; }

    public OffreIPO getOffreIpo()                     { return offreIpo; }
    public void setOffreIpo(OffreIPO offreIpo)        { this.offreIpo = offreIpo; }
}
