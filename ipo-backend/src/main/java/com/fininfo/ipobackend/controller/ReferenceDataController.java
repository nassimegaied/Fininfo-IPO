package com.fininfo.ipobackend.controller;

import com.fininfo.ipobackend.entity.Client;
import com.fininfo.ipobackend.entity.Instrument;
import com.fininfo.ipobackend.repository.ClientRepository;
import com.fininfo.ipobackend.repository.InstrumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ReferenceDataController {

    private final ClientRepository clientRepository;
    private final InstrumentRepository instrumentRepository;

    @GetMapping("/clients")
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    @GetMapping("/instruments")
    public List<Instrument> getAllInstruments() {
        return instrumentRepository.findAll();
    }
}
