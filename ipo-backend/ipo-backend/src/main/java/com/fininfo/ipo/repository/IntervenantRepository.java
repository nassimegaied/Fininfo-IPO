package com.fininfo.ipo.repository;

import com.fininfo.ipo.entity.Intervenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IntervenantRepository extends JpaRepository<Intervenant, Long> {
}