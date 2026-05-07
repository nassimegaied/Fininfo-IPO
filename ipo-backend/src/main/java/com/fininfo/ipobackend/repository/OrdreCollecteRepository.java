package com.fininfo.ipobackend.repository;

import com.fininfo.ipobackend.entity.OrdreCollecte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrdreCollecteRepository extends JpaRepository<OrdreCollecte, Long> {
    List<OrdreCollecte> findByReferenceIpo(String referenceIpo);
}
