package com.fininfo.ipobackend.service;

import com.fininfo.ipobackend.dto.OrdreCollecteDetailDTO;
import com.fininfo.ipobackend.dto.OrdreCollecteListDTO;
import com.fininfo.ipobackend.entity.OrdreCollecte;
import com.fininfo.ipobackend.entity.Tranche;
import com.fininfo.ipobackend.error.DomainRuleViolationException;
import com.fininfo.ipobackend.error.ErrorCodes;
import com.fininfo.ipobackend.repository.OrdreCollecteRepository;
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
public class OrdreCollecteService {

    private final OrdreCollecteRepository repo;
    private final TrancheRepository       trancheRepo;

    // ── List ──────────────────────────────────────────────────────────────────
    public List<OrdreCollecteListDTO> findAll() {
        return repo.findAll().stream()
                .map(this::toListDTO)
                .collect(Collectors.toList());
    }

    // ── Get by id ─────────────────────────────────────────────────────────────
    public OrdreCollecteDetailDTO findById(Long id) {
        OrdreCollecte entity = repo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("OrdreCollecte not found: " + id));
        return toDetailDTO(entity);
    }

    // ── Create ────────────────────────────────────────────────────────────────
    @Transactional
    public OrdreCollecteDetailDTO create(OrdreCollecteDetailDTO dto) {
        validateTrancheConsistency(dto);
        OrdreCollecte entity = fromDetailDTO(dto);
        entity.setId(null);
        entity.setReference(generateTemporaryReference("ORD"));
        entity.setStatus("EN_ATTENTE");
        OrdreCollecte saved = repo.saveAndFlush(entity);
        saved.setReference(generateReference(saved.getId()));
        saved = repo.save(saved);
        return toDetailDTO(saved);
    }

    // ── Update ────────────────────────────────────────────────────────────────
    @Transactional
    public OrdreCollecteDetailDTO update(Long id, OrdreCollecteDetailDTO dto) {
        OrdreCollecte entity = repo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("OrdreCollecte not found: " + id));
        validateTrancheConsistency(dto);
        applyUpdate(entity, dto);
        return toDetailDTO(repo.save(entity));
    }

    // ── Validate ──────────────────────────────────────────────────────────────
    @Transactional
    public OrdreCollecteDetailDTO validate(Long id) {
        OrdreCollecte entity = repo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("OrdreCollecte not found: " + id));
        if (!"EN_ATTENTE".equals(entity.getStatus())) {
            throw new DomainRuleViolationException(
                    ErrorCodes.DOMAIN_RULE_VIOLATION,
                    "Invalid order status transition. Only EN_ATTENTE -> VALIDE is allowed."
            );
        }
        entity.setStatus("VALIDE");
        return toDetailDTO(repo.save(entity));
    }

    // ── Mapping ───────────────────────────────────────────────────────────────
    private OrdreCollecteListDTO toListDTO(OrdreCollecte e) {
        return new OrdreCollecteListDTO(
                e.getId(), e.getReference(), e.getQuantite(),
                e.getClientLabel(), e.getSocieteBourse(), e.getStatus(), e.getCreatedAt()
        );
    }

    private OrdreCollecteDetailDTO toDetailDTO(OrdreCollecte e) {
        // Resolve offreIpoId from the saved trancheId so the frontend can
        // restore the IPO dropdown when opening an order in edit/view mode.
        Long offreIpoId = null;
        if (e.getTrancheId() != null) {
            offreIpoId = trancheRepo.findById(e.getTrancheId())
                    .map(Tranche::getOffreIpo)
                    .map(ipo -> ipo.getId())
                    .orElse(null);
        }

        return new OrdreCollecteDetailDTO(
                e.getId(), e.getReference(), e.getClientId(), e.getClientLabel(),
                e.getCompteEspeces(), e.getCompteTitres(), e.getInstrumentId(),
                e.getMnemonique(), e.getIsin(), e.getTypeOrdre(), e.getTypeMarche(),
                e.getSocieteBourse(), e.getQuantite(), e.getPrix(), e.getValidite(),
                e.getReferenceIpo(), e.getTrancheId(), offreIpoId, e.getStatus()
        );
    }

    private OrdreCollecte fromDetailDTO(OrdreCollecteDetailDTO dto) {
        return OrdreCollecte.builder()
                .clientId(dto.clientId())
                .clientLabel(dto.clientLabel())
                .compteEspeces(dto.compteEspeces())
                .compteTitres(dto.compteTitres())
                .instrumentId(dto.instrumentId())
                .mnemonique(dto.mnemonique())
                .isin(dto.isin())
                .typeOrdre(dto.typeOrdre())
                .typeMarche(dto.typeMarche())
                .societeBourse(dto.societeBourse())
                .quantite(dto.quantite())
                .prix(dto.prix())
                .validite(dto.validite())
                .referenceIpo(dto.referenceIpo())
                .trancheId(dto.trancheId())
                .build();
    }

    private void applyUpdate(OrdreCollecte e, OrdreCollecteDetailDTO dto) {
        e.setClientId(dto.clientId());
        e.setClientLabel(dto.clientLabel());
        e.setCompteEspeces(dto.compteEspeces());
        e.setCompteTitres(dto.compteTitres());
        e.setInstrumentId(dto.instrumentId());
        e.setMnemonique(dto.mnemonique());
        e.setIsin(dto.isin());
        e.setTypeOrdre(dto.typeOrdre());
        e.setTypeMarche(dto.typeMarche());
        e.setSocieteBourse(dto.societeBourse());
        e.setQuantite(dto.quantite());
        e.setPrix(dto.prix());
        e.setValidite(dto.validite());
        e.setReferenceIpo(dto.referenceIpo());
        e.setTrancheId(dto.trancheId());
    }

    private String generateReference(Long id) {
        return String.format("ORD%07d", id);
    }

    private String generateTemporaryReference(String prefix) {
        return prefix + "-TMP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private void validateTrancheConsistency(OrdreCollecteDetailDTO dto) {
        Tranche tranche = trancheRepo.findById(dto.trancheId())
                .orElseThrow(() -> new NoSuchElementException("Tranche not found: " + dto.trancheId()));

        if (dto.referenceIpo() != null && !dto.referenceIpo().equals(tranche.getReferenceIpo())) {
            throw new DomainRuleViolationException(
                    ErrorCodes.DOMAIN_RULE_VIOLATION,
                    "The selected tranche does not belong to the provided IPO reference."
            );
        }
    }
}
