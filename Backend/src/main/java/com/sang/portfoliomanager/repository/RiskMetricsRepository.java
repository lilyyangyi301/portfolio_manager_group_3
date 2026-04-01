package com.sang.portfoliomanager.repository;

import com.sang.portfoliomanager.entity.RiskMetrics;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RiskMetricsRepository extends JpaRepository<RiskMetrics, Long> {

    Optional<RiskMetrics> findFirstByOrderByIdDesc();

}