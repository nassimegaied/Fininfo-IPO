package com.fininfo.ipobackend.service;

import com.fininfo.ipobackend.entity.OffreIPO;
import com.fininfo.ipobackend.error.DomainRuleViolationException;
import com.fininfo.ipobackend.repository.OffreIPORepository;
import com.fininfo.ipobackend.repository.TrancheRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OffreIPOServiceDomainRulesTest {

    @Mock
    private OffreIPORepository offreRepo;

    @Mock
    private TrancheRepository trancheRepo;

    @InjectMocks
    private OffreIPOService service;

    @Test
    void validateFailsWhenStatusIsNotPrevalide() {
        OffreIPO entity = new OffreIPO();
        entity.setId(1L);
        entity.setStatus("VALIDE");
        when(offreRepo.findById(eq(1L))).thenReturn(Optional.of(entity));

        assertThrows(DomainRuleViolationException.class, () -> service.validate(1L));
    }
}

