package com.sang.portfoliomanager.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "holdings")
@Data
public class Holding {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String symbol;
    private String name;
    private String assetType;
    private String sector;
    private String currency;
    private Double quantity;
    private Double avgPrice;
    @Column(name = "current_price")
    private Double currentPrice;
}
