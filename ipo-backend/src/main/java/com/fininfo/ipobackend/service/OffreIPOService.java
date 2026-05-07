package com.fininfo.ipobackend.service;

import com.fininfo.ipobackend.dto.OffreIPODetailDTO;
import com.fininfo.ipobackend.dto.OffreIPOListDTO;
import com.fininfo.ipobackend.dto.TrancheDTO;
import com.fininfo.ipobackend.entity.OffreIPO;
import com.fininfo.ipobackend.entity.Tranche;
import com.fininfo.ipobackend.error.DomainRuleViolationException;
import com.fininfo.ipobackend.error.ErrorCodes;
import com.fininfo.ipobackend.repository.OffreIPORepository;
import com.fininfo.ipobackend.repository.TrancheRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OffreIPOService {

    private final OffreIPORepository repo;
    private final TrancheRepository  trancheRepo;

    // ── List ──────────────────────────────────────────────────────────────────
    public List<OffreIPOListDTO> findAll() {
        return repo.findAll().stream()
                .map(this::toListDTO)
                .collect(Collectors.toList());
    }

    // ── Get by id ─────────────────────────────────────────────────────────────
    public OffreIPODetailDTO findById(Long id) {
        OffreIPO entity = repo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("OffreIPO not found: " + id));
        return toDetailDTO(entity);
    }

    // ── Create ────────────────────────────────────────────────────────────────
    @Transactional
    public OffreIPODetailDTO create(OffreIPODetailDTO dto) {
        OffreIPO entity = fromDetailDTO(dto);
        entity.setId(null);
        entity.setReference(generateTemporaryReference("CAM"));
        entity.setStatus("PREVALIDE");
        OffreIPO saved = repo.saveAndFlush(entity);
        saved.setReference(generateReference(saved.getId()));
        saved = repo.save(saved);

        // Auto-create default tranches: Corporate + Syndicale
        createDefaultTranches(saved);

        return toDetailDTO(saved);
    }

    // ── Update ────────────────────────────────────────────────────────────────
    @Transactional
    public OffreIPODetailDTO update(Long id, OffreIPODetailDTO dto) {
        OffreIPO entity = repo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("OffreIPO not found: " + id));
        applyUpdate(entity, dto);
        return toDetailDTO(repo.save(entity));
    }

    // ── Validate ──────────────────────────────────────────────────────────────
    @Transactional
    public OffreIPODetailDTO validate(Long id) {
        OffreIPO entity = repo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("OffreIPO not found: " + id));
        if (!"PREVALIDE".equals(entity.getStatus())) {
            throw new DomainRuleViolationException(
                    ErrorCodes.DOMAIN_RULE_VIOLATION,
                    "Invalid IPO status transition. Only PREVALIDE -> VALIDE is allowed."
            );
        }
        entity.setStatus("VALIDE");
        return toDetailDTO(repo.save(entity));
    }

    // ── Get tranches for an IPO ───────────────────────────────────────────────
    public List<TrancheDTO> findTranches(Long ipoId) {
        // Ensure the IPO exists
        OffreIPO ipo = repo.findById(ipoId)
                .orElseThrow(() -> new NoSuchElementException("OffreIPO not found: " + ipoId));

        // Lazily create default tranches if they don't exist yet (for IPOs created before this feature)
        if (!trancheRepo.existsByOffreIpoIdAndType(ipoId, "CORPORATE")) {
            createDefaultTranches(ipo);
        }

        return trancheRepo.findByOffreIpoId(ipoId).stream()
                .map(this::toTrancheDTO)
                .collect(Collectors.toList());
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    /**
     * Creates the two default tranches for every new IPO:
     * - Tranche Corporate
     * - Tranche Syndicale
     * Idempotent: skips if they already exist.
     */
    private void createDefaultTranches(OffreIPO ipo) {
        if (!trancheRepo.existsByOffreIpoIdAndType(ipo.getId(), "CORPORATE")) {
            trancheRepo.save(new Tranche("Tranche Corporate", "CORPORATE", ipo.getReference(), ipo));
        }
        if (!trancheRepo.existsByOffreIpoIdAndType(ipo.getId(), "SYNDICAL")) {
            trancheRepo.save(new Tranche("Tranche Syndicale", "SYNDICAL", ipo.getReference(), ipo));
        }
    }

    private TrancheDTO toTrancheDTO(Tranche t) {
        return new TrancheDTO(t.getId(), t.getLabel(), t.getType(),
                              t.getReferenceIpo(), t.getOffreIpo().getId());
    }

    // ── Entity ↔ DTO mapping ─────────────────────────────────────────────────
    private OffreIPOListDTO toListDTO(OffreIPO e) {
        return new OffreIPOListDTO(
                e.getId(), e.getReference(), e.getPrixSouscription(),
                e.getTypeOffre(), e.getStatus(), e.getCreatedAt()
        );
    }

    private OffreIPODetailDTO toDetailDTO(OffreIPO e) {
        return new OffreIPODetailDTO(
                e.getId(), e.getReference(), e.getTypeOffre(), e.getStatus(),
                e.getNatureTitre(), e.getPrixSouscription(), e.getNbNouvellesActions(),
                e.getMontantGlobalOperation(), e.getValeurNominale(),
                e.getPeriodeDebutSouscription(), e.getPeriodeFinSouscription(),
                e.getNbActionsCeder(), e.getDateVisaAmmc(), e.getReferenceVisaAmmc()
        );
    }

    private OffreIPO fromDetailDTO(OffreIPODetailDTO dto) {
        return OffreIPO.builder()
                .typeOffre(dto.typeOffre())
                .natureTitre(dto.natureTitre())
                .prixSouscription(dto.prixSouscription())
                .nbNouvellesActions(dto.nbNouvellesActions())
                .montantGlobalOperation(dto.montantGlobalOperation())
                .valeurNominale(dto.valeurNominale())
                .periodeDebutSouscription(dto.periodeDebutSouscription())
                .periodeFinSouscription(dto.periodeFinSouscription())
                .nbActionsCeder(dto.nbActionsCeder())
                .dateVisaAmmc(dto.dateVisaAmmc())
                .referenceVisaAmmc(dto.referenceVisaAmmc())
                .build();
    }

    private void applyUpdate(OffreIPO e, OffreIPODetailDTO dto) {
        e.setTypeOffre(dto.typeOffre());
        e.setNatureTitre(dto.natureTitre());
        e.setPrixSouscription(dto.prixSouscription());
        e.setNbNouvellesActions(dto.nbNouvellesActions());
        e.setMontantGlobalOperation(dto.montantGlobalOperation());
        e.setValeurNominale(dto.valeurNominale());
        e.setPeriodeDebutSouscription(dto.periodeDebutSouscription());
        e.setPeriodeFinSouscription(dto.periodeFinSouscription());
        e.setNbActionsCeder(dto.nbActionsCeder());
        e.setDateVisaAmmc(dto.dateVisaAmmc());
        e.setReferenceVisaAmmc(dto.referenceVisaAmmc());
    }

    /** Generates deterministic reference from DB identity to avoid collisions under concurrency. */
    private String generateReference(Long id) {
        return String.format("CAM%07d", id);
    }

    /**
     * Temporary unique value used to satisfy NOT NULL + UNIQUE before we can derive
     * the final reference from the generated DB identity.
     */
    private String generateTemporaryReference(String prefix) {
        return prefix + "-TMP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
