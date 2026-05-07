package com.fininfo.ipobackend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "instrument")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Instrument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String mnemonique;

    @Column(nullable = false)
    private String isin;

    @Column(name = "code_valeur")
    private String codeValeur;

    private String description;

    @Column(name = "groupe_cotation")
    private String groupeCotation;

    @Column(name = "place_denouement")
    private String placeDenouement;
}
