package com.fininfo.ipo.controller;

import com.fininfo.ipo.entity.TranchePersonnelSyndicat;
import com.fininfo.ipo.service.TrancheService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/offres/{offreId}/tranches/syndicat")
@CrossOrigin(origins = "http://localhost:5173")
public class TranchePersonnelSyndicatController {

    @Autowired
    private TrancheService trancheService;

    @PostMapping
    public TranchePersonnelSyndicat create(@PathVariable Long offreId,
                                           @RequestBody TranchePersonnelSyndicat tranche) {
        return trancheService.createSyndicatTranche(offreId, tranche);
    }
}