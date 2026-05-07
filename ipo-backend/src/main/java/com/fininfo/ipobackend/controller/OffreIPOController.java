package com.fininfo.ipobackend.controller;

import com.fininfo.ipobackend.dto.OffreIPODetailDTO;
import com.fininfo.ipobackend.dto.OffreIPOListDTO;
import com.fininfo.ipobackend.dto.TrancheDTO;
import com.fininfo.ipobackend.service.OffreIPOService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/offres")
@RequiredArgsConstructor
public class OffreIPOController {

    private final OffreIPOService service;

    /** GET /api/offres — list all IPO offers */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public List<OffreIPOListDTO> getAll() {
        return service.findAll();
    }

    /** GET /api/offres/{id} — get one offer by ID */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OffreIPODetailDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    /** GET /api/offres/{id}/tranches — get tranches for an IPO (for Collecte form dropdown) */
    @GetMapping("/{id}/tranches")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TrancheDTO>> getTranches(@PathVariable Long id) {
        return ResponseEntity.ok(service.findTranches(id));
    }

    /** POST /api/offres — create a new IPO offer */
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OffreIPODetailDTO> create(@Valid @RequestBody OffreIPODetailDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dto));
    }

    /** PUT /api/offres/{id} — update an existing IPO offer */
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OffreIPODetailDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody OffreIPODetailDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    /** PATCH /api/offres/{id}/validate — validate an IPO offer */
    @PatchMapping("/{id}/validate")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OffreIPODetailDTO> validate(@PathVariable Long id) {
        return ResponseEntity.ok(service.validate(id));
    }
}
