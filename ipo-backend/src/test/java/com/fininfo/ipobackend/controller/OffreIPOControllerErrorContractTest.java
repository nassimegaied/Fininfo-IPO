package com.fininfo.ipobackend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fininfo.ipobackend.dto.OffreIPODetailDTO;
import com.fininfo.ipobackend.error.DomainRuleViolationException;
import com.fininfo.ipobackend.error.ErrorCodes;
import com.fininfo.ipobackend.error.GlobalExceptionHandler;
import com.fininfo.ipobackend.service.OffreIPOService;
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
import java.time.LocalDate;
import java.util.NoSuchElementException;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class OffreIPOControllerErrorContractTest {

    @Mock
    private OffreIPOService service;

    private final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        OffreIPOController controller = new OffreIPOController(service);
        LocalValidatorFactoryBean validator = new LocalValidatorFactoryBean();
        validator.afterPropertiesSet();

        mockMvc = MockMvcBuilders
                .standaloneSetup(controller)
                .setControllerAdvice(new GlobalExceptionHandler())
                .setValidator(validator)
                .build();
    }

    @Test
    void invalidPayloadReturnsStandardValidationError() throws Exception {
        OffreIPODetailDTO invalid = new OffreIPODetailDTO(
                null, null, "", null, "",
                null, null, null, null,
                null, null, null, null, ""
        );

        mockMvc.perform(post("/api/offres")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(ErrorCodes.VALIDATION_ERROR))
                .andExpect(jsonPath("$.fieldErrors.length()").value(org.hamcrest.Matchers.greaterThan(0)));
    }

    @Test
    void validateMissingIpoReturnsStandardNotFound() throws Exception {
        when(service.validate(eq(999L))).thenThrow(new NoSuchElementException("OffreIPO not found: 999"));

        mockMvc.perform(patch("/api/offres/999/validate"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value(ErrorCodes.RESOURCE_NOT_FOUND))
                .andExpect(jsonPath("$.message").value("OffreIPO not found: 999"))
                .andExpect(jsonPath("$.path").value("/api/offres/999/validate"));
    }

    @Test
    void invalidStatusTransitionReturns422Contract() throws Exception {
        when(service.validate(eq(1L))).thenThrow(new DomainRuleViolationException(
                ErrorCodes.DOMAIN_RULE_VIOLATION,
                "Invalid IPO status transition. Only PREVALIDE -> VALIDE is allowed."
        ));

        mockMvc.perform(patch("/api/offres/1/validate"))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.code").value(ErrorCodes.DOMAIN_RULE_VIOLATION));
    }

    @Test
    void unexpectedErrorReturns500Contract() throws Exception {
        when(service.create(any())).thenThrow(new RuntimeException("boom"));

        mockMvc.perform(post("/api/offres")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validPayload())))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.code").value(ErrorCodes.INTERNAL_ERROR))
                .andExpect(jsonPath("$.message").value("An unexpected error occurred."));
    }

    private OffreIPODetailDTO validPayload() {
        return new OffreIPODetailDTO(
                null, null, "FIXED", null, "Action",
                BigDecimal.valueOf(100), 1000L, BigDecimal.valueOf(100000),
                BigDecimal.valueOf(10), LocalDate.now(), LocalDate.now().plusDays(10),
                500L, LocalDate.now(), "AMMC-123"
        );
    }
}

