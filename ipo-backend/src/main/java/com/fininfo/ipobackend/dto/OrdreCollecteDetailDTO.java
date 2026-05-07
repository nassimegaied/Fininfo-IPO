package com.fininfo.ipobackend.dto;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.text.Normalizer;

/** Full order detail DTO used for create / edit / view. */
public record OrdreCollecteDetailDTO(
        Long id,
        String reference,
        @NotBlank(message = "clientId is required.")
        @Size(max = 100, message = "clientId must be at most 100 characters.")
        String clientId,
        @NotBlank(message = "clientLabel is required.")
        @Size(max = 200, message = "clientLabel must be at most 200 characters.")
        String clientLabel,
        @NotBlank(message = "compteEspeces is required.")
        @Size(max = 50, message = "compteEspeces must be at most 50 characters.")
        String compteEspeces,
        @NotBlank(message = "compteTitres is required.")
        @Size(max = 50, message = "compteTitres must be at most 50 characters.")
        String compteTitres,
        @NotBlank(message = "instrumentId is required.")
        @Size(max = 100, message = "instrumentId must be at most 100 characters.")
        String instrumentId,
        @NotBlank(message = "mnemonique is required.")
        @Size(max = 50, message = "mnemonique must be at most 50 characters.")
        String mnemonique,
        @NotBlank(message = "isin is required.")
        @Size(max = 20, message = "isin must be at most 20 characters.")
        String isin,
        @NotBlank(message = "typeOrdre is required.")
        @Size(max = 100, message = "typeOrdre must be at most 100 characters.")
        String typeOrdre,
        @NotBlank(message = "typeMarche is required.")
        @Size(max = 100, message = "typeMarche must be at most 100 characters.")
        String typeMarche,
        @NotBlank(message = "societeBourse is required.")
        @Size(max = 100, message = "societeBourse must be at most 100 characters.")
        String societeBourse,
        @NotNull(message = "quantite is required.")
        @Positive(message = "quantite must be positive.")
        Long quantite,
        BigDecimal prix,
        @NotBlank(message = "validite is required.")
        @Size(max = 50, message = "validite must be at most 50 characters.")
        String validite,
        @NotBlank(message = "referenceIpo is required.")
        @Size(max = 20, message = "referenceIpo must be at most 20 characters.")
        String referenceIpo,
        @NotNull(message = "trancheId is required.")
        @Positive(message = "trancheId must be positive.")
        Long trancheId,
        Long offreIpoId,
        String status
) {
    @AssertTrue(message = "prix must be provided and positive when typeOrdre is a trigger order.")
    public boolean isPriceRuleValid() {
        if (typeOrdre == null) {
            return true;
        }
        String normalized = Normalizer.normalize(typeOrdre, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase();

        boolean isTriggerOrder = normalized.contains("declenche");
        if (!isTriggerOrder) {
            return true;
        }
        return prix != null && prix.signum() > 0;
    }
}

