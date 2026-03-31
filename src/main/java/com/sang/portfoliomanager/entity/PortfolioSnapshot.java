package com.sang.portfoliomanager.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "portfolio_snapshots")
@Data
public class PortfolioSnapshot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDate snapshotDate;
    private Double totalValue;
    private Double performancePct;
}
