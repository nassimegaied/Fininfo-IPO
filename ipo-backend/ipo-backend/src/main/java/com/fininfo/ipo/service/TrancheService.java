package com.fininfo.ipo.service;

import com.fininfo.ipo.dto.InvestisseurProfile;
import com.fininfo.ipo.entity.*;
import com.fininfo.ipo.repository.OffreIPORepository;
import com.fininfo.ipo.repository.TrancheRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TrancheService {

    @Autowired
    private OffreIPORepository offreIPORepository;

    @Autowired
    private TrancheRepository trancheRepository;

    @Transactional
    public TranchePersonnelCorporate createCorporateTranche(Long offreId, TranchePersonnelCorporate tranche) {
        OffreIPO offre = offreIPORepository.findById(offreId)
                .orElseThrow(() -> new RuntimeException("Offre not found with id: " + offreId));
        tranche.setOffreIPO(offre);
        return trancheRepository.save(tranche);
    }

    public List<Tranche> findCompatibleTranches(Long offreId, InvestisseurProfile profile) {
        OffreIPO offre = offreIPORepository.findById(offreId)
                .orElseThrow(() -> new RuntimeException("Offre not found with id: " + offreId));

        List<Tranche> tranches = offre.getTranches();

        return tranches.stream()
                .filter(tranche -> isCompatible(tranche, profile))
                .collect(Collectors.toList());
    }

    private boolean isCompatible(Tranche tranche, InvestisseurProfile profile) {
        if (tranche instanceof TranchePersonnelCorporate corporate) {
            return matches(profile.getTypePersonne(), corporate.getTypePersonne()) &&
                    matches(profile.getResidence(), corporate.getResidence()) &&
                    matches(profile.getNationalite(), corporate.getNationalite()) &&
                    matches(profile.getRegimeRemuneration(), corporate.getRegimeRemuneration()) &&
                    matches(profile.getConditionEligibilite(), corporate.getConditionEligibilite()) &&
                    matches(profile.getAnciennete(), corporate.getAnciennete()) &&
                    matches(profile.getMineur(), corporate.getMineur());
        } else if (tranche instanceof TranchePersonnelSyndicat syndicat) {
            return matches(profile.getTypePersonne(), syndicat.getTypePersonne()) &&
                    matches(profile.getResidence(), syndicat.getResidence()) &&
                    matches(profile.getNationalite(), syndicat.getNationalite()) &&
                    matches(profile.getTitulaire(), syndicat.getTitulaire()) &&
                    matches(profile.getMineur(), syndicat.getMineur()) &&
                    matches(profile.getInscritListeSyndicat(), syndicat.getInscritListeSyndicat());
        }
        // If an unknown subclass, by default exclude it (or you could include)
        return false;
    }

    // Helper: if profile value is null, it's a wildcard (always matches)
    private boolean matches(Object profileValue, Object trancheValue) {
        if (profileValue == null) {
            return true; // no constraint from investor side
        }
        return profileValue.equals(trancheValue);
    }
    @Transactional
    public TranchePersonnelSyndicat createSyndicatTranche(Long offreId, TranchePersonnelSyndicat tranche) {
        OffreIPO offre = offreIPORepository.findById(offreId)
                .orElseThrow(() -> new RuntimeException("Offre not found with id: " + offreId));
        tranche.setOffreIPO(offre);
        return trancheRepository.save(tranche);
    }
}
