package com.fininfo.ipo.service;

import com.fininfo.ipo.entity.OffreIPO;
import com.fininfo.ipo.entity.TranchePersonnelCorporate;
import com.fininfo.ipo.repository.OffreIPORepository;
import com.fininfo.ipo.repository.TrancheRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
}