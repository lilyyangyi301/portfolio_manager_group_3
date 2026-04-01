package com.sang.portfoliomanager.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StockDetailDTO {
    private String symbol;
    private String companyName;
    private Double currentPrice;
    private Double changePct;
    private String sector;
    private String industry;
    private String marketCap;
    private Double peRatio;
    private Double dividendYield;
    private Double week52High;
    private Double week52Low;
    private String avgVolume;
    private String exchange;
    private String description;
}
