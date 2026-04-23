package com.fininfo.ipo.controller;

import com.fininfo.ipo.entity.OffreIPO;
import com.fininfo.ipo.repository.OffreIPORepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/offres")
public class OffreIPOController {

    @Autowired
    private OffreIPORepository repository;

    @GetMapping
    public List<OffreIPO> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public OffreIPO create(@RequestBody OffreIPO offre) {
        return repository.save(offre);
    }
}