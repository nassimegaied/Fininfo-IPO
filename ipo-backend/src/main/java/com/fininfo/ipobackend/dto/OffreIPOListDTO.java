package com.fininfo.ipobackend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/** Lightweight DTO used for IPO list rows. */
public record OffreIPOListDTO(
    Long id,
    String reference,
    BigDecimal prixSouscription,
    String typeOffre,
    String status,
    LocalDateTime createdAt
) {}
