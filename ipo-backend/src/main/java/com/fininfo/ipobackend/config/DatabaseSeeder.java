package com.fininfo.ipobackend.config;

import com.fininfo.ipobackend.entity.Client;
import com.fininfo.ipobackend.entity.Instrument;
import com.fininfo.ipobackend.repository.ClientRepository;
import com.fininfo.ipobackend.repository.InstrumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final ClientRepository clientRepo;
    private final InstrumentRepository instrumentRepo;

    @Override
    public void run(String... args) throws Exception {
        if (clientRepo.count() == 0) {
            clientRepo.saveAll(List.of(
                    Client.builder()
                            .label("John Doe")
                            .compteEspeces("ESP-000123")
                            .compteTitres("TIT-000123")
                            .devise("MAD")
                            .build(),
                    Client.builder()
                            .label("Acme Corp")
                            .compteEspeces("ESP-000456")
                            .compteTitres("TIT-000456")
                            .devise("MAD")
                            .build(),
                    Client.builder()
                            .label("Jane Smith")
                            .compteEspeces("ESP-000789")
                            .compteTitres("TIT-000789")
                            .devise("EUR")
                            .build()
            ));
        }

        if (instrumentRepo.count() == 0) {
            instrumentRepo.saveAll(List.of(
                    Instrument.builder()
                            .mnemonique("ATW")
                            .isin("MA0000011445")
                            .codeValeur("100")
                            .description("Attijariwafa Bank")
                            .groupeCotation("01")
                            .placeDenouement("MAROCLEAR")
                            .build(),
                    Instrument.builder()
                            .mnemonique("BCP")
                            .isin("MA0000011486")
                            .codeValeur("200")
                            .description("Banque Centrale Populaire")
                            .groupeCotation("01")
                            .placeDenouement("MAROCLEAR")
                            .build(),
                    Instrument.builder()
                            .mnemonique("IAM")
                            .isin("MA0000011488")
                            .codeValeur("300")
                            .description("Maroc Telecom")
                            .groupeCotation("02")
                            .placeDenouement("MAROCLEAR")
                            .build()
            ));
        }
    }
}
