package com.fininfo.ipo.repository;

import com.fininfo.ipo.entity.OffreIPO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OffreIPORepository extends JpaRepository<OffreIPO, Long> {
}