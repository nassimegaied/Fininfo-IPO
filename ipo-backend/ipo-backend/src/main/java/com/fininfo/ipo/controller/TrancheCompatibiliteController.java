package com.fininfo.ipo.controller;

import com.fininfo.ipo.dto.InvestisseurProfile;
import com.fininfo.ipo.entity.Tranche;
import com.fininfo.ipo.service.TrancheService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/offres/{offreId}/tranches/compatibles")
@CrossOrigin(origins = "http://localhost:5173")
public class TrancheCompatibiliteController {

    @Autowired
    private TrancheService trancheService;

    @PostMapping
    public List<Tranche> getCompatibleTranches(@PathVariable Long offreId,
                                               @RequestBody InvestisseurProfile profile) {
        return trancheService.findCompatibleTranches(offreId, profile);
    }
}