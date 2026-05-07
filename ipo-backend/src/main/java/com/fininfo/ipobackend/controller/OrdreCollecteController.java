package com.fininfo.ipobackend.controller;

import com.fininfo.ipobackend.dto.OrdreCollecteDetailDTO;
import com.fininfo.ipobackend.dto.OrdreCollecteListDTO;
import com.fininfo.ipobackend.service.OrdreCollecteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ordres")
@RequiredArgsConstructor
public class OrdreCollecteController {

    private final OrdreCollecteService service;

    /** GET /api/ordres — list all collecte orders */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public List<OrdreCollecteListDTO> getAll() {
        return service.findAll();
    }

    /** GET /api/ordres/{id} — get one ordre by ID */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OrdreCollecteDetailDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    /** POST /api/ordres — create a new collecte order */
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OrdreCollecteDetailDTO> create(@Valid @RequestBody OrdreCollecteDetailDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dto));
    }

    /** PUT /api/ordres/{id} — update a collecte order */
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OrdreCollecteDetailDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody OrdreCollecteDetailDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    /** PATCH /api/ordres/{id}/validate — validate a collecte order */
    @PatchMapping("/{id}/validate")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OrdreCollecteDetailDTO> validate(@PathVariable Long id) {
        return ResponseEntity.ok(service.validate(id));
    }
}
