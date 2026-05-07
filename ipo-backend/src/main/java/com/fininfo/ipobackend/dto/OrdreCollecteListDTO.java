package com.fininfo.ipobackend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/** Lightweight DTO used for Collecte d'Ordre list rows. */
public record OrdreCollecteListDTO(
    Long id,
    String reference,
    Long quantite,
    String clientLabel,
    String societeBourse,
    String status,
    LocalDateTime createdAt
) {}
