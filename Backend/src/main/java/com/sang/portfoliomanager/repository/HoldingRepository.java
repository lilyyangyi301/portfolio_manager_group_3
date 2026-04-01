package com.sang.portfoliomanager.repository;

import com.sang.portfoliomanager.entity.Holding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HoldingRepository extends JpaRepository<Holding, Long> {
    Optional<Holding> findBySymbol(String symbol);
}