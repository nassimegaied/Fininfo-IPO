package com.fininfo.ipo.repository;

import com.fininfo.ipo.entity.Tranche;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrancheRepository extends JpaRepository<Tranche, Long> {
}