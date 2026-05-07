package com.fininfo.ipobackend.repository;

import com.fininfo.ipobackend.entity.Tranche;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrancheRepository extends JpaRepository<Tranche, Long> {

    /** Find all tranches for a given IPO */
    List<Tranche> findByOffreIpoId(Long offreIpoId);

    /** Find by IPO reference string */
    List<Tranche> findByReferenceIpo(String referenceIpo);

    /** Check if default tranches already exist for an IPO */
    boolean existsByOffreIpoIdAndType(Long offreIpoId, String type);
}
