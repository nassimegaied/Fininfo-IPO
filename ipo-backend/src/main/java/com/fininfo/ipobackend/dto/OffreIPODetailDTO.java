package com.fininfo.ipobackend.dto;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

/** Full IPO detail DTO used for create / edit / view. */
public record OffreIPODetailDTO(
        Long id,
        String reference,
        @NotBlank(message = "typeOffre is required.")
        @Size(max = 20, message = "typeOffre must be at most 20 characters.")
        String typeOffre,
        String status,
        @NotBlank(message = "natureTitre is required.")
        @Size(max = 100, message = "natureTitre must be at most 100 characters.")
        String natureTitre,
        @NotNull(message = "prixSouscription is required.")
        @Positive(message = "prixSouscription must be positive.")
        BigDecimal prixSouscription,
        @NotNull(message = "nbNouvellesActions is required.")
        @Positive(message = "nbNouvellesActions must be positive.")
        Long nbNouvellesActions,
        @NotNull(message = "montantGlobalOperation is required.")
        @Positive(message = "montantGlobalOperation must be positive.")
        BigDecimal montantGlobalOperation,
        @NotNull(message = "valeurNominale is required.")
        @Positive(message = "valeurNominale must be positive.")
        BigDecimal valeurNominale,
        @NotNull(message = "periodeDebutSouscription is required.")
        LocalDate periodeDebutSouscription,
        @NotNull(message = "periodeFinSouscription is required.")
        LocalDate periodeFinSouscription,
        @NotNull(message = "nbActionsCeder is required.")
        @Positive(message = "nbActionsCeder must be positive.")
        Long nbActionsCeder,
        @NotNull(message = "dateVisaAmmc is required.")
        LocalDate dateVisaAmmc,
        @NotBlank(message = "referenceVisaAmmc is required.")
        @Size(max = 100, message = "referenceVisaAmmc must be at most 100 characters.")
        String referenceVisaAmmc
) {
    @AssertTrue(message = "periodeDebutSouscription must be before or equal to periodeFinSouscription.")
    public boolean isSubscriptionPeriodValid() {
        if (periodeDebutSouscription == null || periodeFinSouscription == null) {
            return true;
        }
        return !periodeDebutSouscription.isAfter(periodeFinSouscription);
    }
}

