package com.fininfo.ipobackend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fininfo.ipobackend.dto.OrdreCollecteDetailDTO;
import com.fininfo.ipobackend.error.DomainRuleViolationException;
import com.fininfo.ipobackend.error.ErrorCodes;
import com.fininfo.ipobackend.error.GlobalExceptionHandler;
import com.fininfo.ipobackend.service.OrdreCollecteService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

import java.math.BigDecimal;
import java.util.NoSuchElementException;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class OrdreCollecteControllerErrorContractTest {

    @Mock
    private OrdreCollecteService service;

    private final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        OrdreCollecteController controller = new OrdreCollecteController(service);
        LocalValidatorFactoryBean validator = new LocalValidatorFactoryBean();
        validator.afterPropertiesSet();

        mockMvc = MockMvcBuilders
                .standaloneSetup(controller)
                .setControllerAdvice(new GlobalExceptionHandler())
                .setValidator(validator)
                .build();
    }

    @Test
    void invalidPayloadReturnsValidationErrorContract() throws Exception {
        OrdreCollecteDetailDTO invalid = new OrdreCollecteDetailDTO(
                null, null, "", "", "", "",
                "", "", "", "", "",
                "", null, null, "",
                "", null, null, null
        );

        mockMvc.perform(post("/api/ordres")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(ErrorCodes.VALIDATION_ERROR))
                .andExpect(jsonPath("$.fieldErrors.length()").value(org.hamcrest.Matchers.greaterThan(0)));
    }

    @Test
    void notFoundReturns404Contract() throws Exception {
        when(service.validate(eq(99L))).thenThrow(new NoSuchElementException("OrdreCollecte not found: 99"));

        mockMvc.perform(patch("/api/ordres/99/validate"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value(ErrorCodes.RESOURCE_NOT_FOUND))
                .andExpect(jsonPath("$.path").value("/api/ordres/99/validate"));
    }

    @Test
    void domainRuleViolationReturns422Contract() throws Exception {
        when(service.create(any())).thenThrow(new DomainRuleViolationException(
                ErrorCodes.DOMAIN_RULE_VIOLATION,
                "The selected tranche does not belong to the provided IPO reference."
        ));

        mockMvc.perform(post("/api/ordres")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validPayload())))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.code").value(ErrorCodes.DOMAIN_RULE_VIOLATION));
    }

    private OrdreCollecteDetailDTO validPayload() {
        return new OrdreCollecteDetailDTO(
                null, null, "C1", "Client 1", "ESP-1", "TIT-1",
                "INS-1", "ATW", "MA000001", "Ordre a declenchement", "Marche principal",
                "SB-1", 10L, BigDecimal.valueOf(99), "JOUR",
                "CAM0000001", 10L, null, null
        );
    }
}

