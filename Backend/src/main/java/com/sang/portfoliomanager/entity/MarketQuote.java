package com.sang.portfoliomanager.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "market_quotes")
@Data
public class MarketQuote {
    @Id
    private String symbol;
    private Double currentPrice;
    private Double changePct;
    // Support Watchlist
    @Column(name = "company_name")
    private String companyName;

    // Support Stock Finder
    private String sector;
    private String industry;
    private String marketCap;
    private Double peRatio;
    private Double dividendYield;
    @Column(name = "week_52_high")
    private Double week52High;
    @Column(name = "week_52_low")
    private Double week52Low;
    private String avgVolume;
    private String exchange;
    private String description;
}