package com.fininfo.ipobackend.dto;

public class TrancheDTO {
    private Long   id;
    private String label;
    private String type;
    private String referenceIpo;
    private Long   offreIpoId;

    public TrancheDTO() {}

    public TrancheDTO(Long id, String label, String type, String referenceIpo, Long offreIpoId) {
        this.id           = id;
        this.label        = label;
        this.type         = type;
        this.referenceIpo = referenceIpo;
        this.offreIpoId   = offreIpoId;
    }

    public Long   getId()                       { return id; }
    public void   setId(Long id)                { this.id = id; }
    public String getLabel()                    { return label; }
    public void   setLabel(String label)        { this.label = label; }
    public String getType()                     { return type; }
    public void   setType(String type)          { this.type = type; }
    public String getReferenceIpo()             { return referenceIpo; }
    public void   setReferenceIpo(String r)     { this.referenceIpo = r; }
    public Long   getOffreIpoId()               { return offreIpoId; }
    public void   setOffreIpoId(Long id)        { this.offreIpoId = id; }
}
