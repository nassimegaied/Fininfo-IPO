package com.fininfo.ipobackend.repository;

import com.fininfo.ipobackend.entity.OffreIPO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OffreIPORepository extends JpaRepository<OffreIPO, Long> {
    Optional<OffreIPO> findByReference(String reference);
    boolean existsByReference(String reference);
}
