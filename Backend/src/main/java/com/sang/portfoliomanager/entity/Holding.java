package com.sang.portfoliomanager.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "holdings")
@Data
public class Holding {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Unique identifier for the holding
    private String symbol;
    private String name;
    private String assetType;
    private String sector; 
    private String currency; //
    private Double quantity;
    private Double avgPrice; 
}
