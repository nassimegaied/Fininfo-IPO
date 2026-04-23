package com.fininfo.ipo.controller;

import com.fininfo.ipo.entity.TranchePersonnelCorporate;
import com.fininfo.ipo.service.TrancheService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/offres/{offreId}/tranches/corporate")
@CrossOrigin(origins = "http://localhost:5173")   // You can also keep it in the global CorsConfig
public class TranchePersonnelCorporateController {

    @Autowired
    private TrancheService trancheService;

    @PostMapping
    public TranchePersonnelCorporate create(@PathVariable Long offreId,
                                            @RequestBody TranchePersonnelCorporate tranche) {
        return trancheService.createCorporateTranche(offreId, tranche);
    }
}