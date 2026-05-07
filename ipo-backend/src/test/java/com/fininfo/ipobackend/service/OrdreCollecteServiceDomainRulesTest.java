package com.fininfo.ipobackend.service;

import com.fininfo.ipobackend.dto.OrdreCollecteDetailDTO;
import com.fininfo.ipobackend.entity.OrdreCollecte;
import com.fininfo.ipobackend.entity.OffreIPO;
import com.fininfo.ipobackend.entity.Tranche;
import com.fininfo.ipobackend.error.DomainRuleViolationException;
import com.fininfo.ipobackend.repository.OrdreCollecteRepository;
import com.fininfo.ipobackend.repository.TrancheRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrdreCollecteServiceDomainRulesTest {

    @Mock
    private OrdreCollecteRepository ordreRepo;

    @Mock
    private TrancheRepository trancheRepo;

    @InjectMocks
    private OrdreCollecteService service;

    @Test
    void createFailsWhenTrancheDoesNotExist() {
        when(trancheRepo.findById(eq(10L))).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> service.create(validDetail()));
    }

    @Test
    void createFailsWhenReferenceIpoDoesNotMatchTranche() {
        Tranche tranche = buildTranche(10L, "CAM0000001");
        when(trancheRepo.findById(eq(10L))).thenReturn(Optional.of(tranche));

        OrdreCollecteDetailDTO dto = new OrdreCollecteDetailDTO(
                null, null, "C1", "Client 1", "ESP-1", "TIT-1",
                "INS-1", "ATW", "MA000001", "Ordre a declenchement", "Marche principal",
                "SB-1", 10L, BigDecimal.valueOf(99), "JOUR",
                "CAM9999999", 10L, null, null
        );

        assertThrows(DomainRuleViolationException.class, () -> service.create(dto));
    }

    @Test
    void validateFailsWhenStatusIsNotEnAttente() {
        OrdreCollecte entity = OrdreCollecte.builder()
                .id(1L)
                .status("VALIDE")
                .build();
        when(ordreRepo.findById(eq(1L))).thenReturn(Optional.of(entity));

        assertThrows(DomainRuleViolationException.class, () -> service.validate(1L));
    }

    private OrdreCollecteDetailDTO validDetail() {
        return new OrdreCollecteDetailDTO(
                null, null, "C1", "Client 1", "ESP-1", "TIT-1",
                "INS-1", "ATW", "MA000001", "Ordre a declenchement", "Marche principal",
                "SB-1", 10L, BigDecimal.valueOf(99), "JOUR",
                "CAM0000001", 10L, null, null
        );
    }

    private Tranche buildTranche(Long id, String referenceIpo) {
        OffreIPO offre = new OffreIPO();
        offre.setId(1L);
        offre.setReference(referenceIpo);

        Tranche t = new Tranche();
        t.setId(id);
        t.setReferenceIpo(referenceIpo);
        t.setOffreIpo(offre);
        return t;
    }
}
