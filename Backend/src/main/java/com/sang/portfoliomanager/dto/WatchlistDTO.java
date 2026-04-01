package com.sang.portfoliomanager.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class WatchlistDTO {
    private String symbol;
    private String companyName;
    private Double currentPrice;
    private Double changeAmount; // Absolute price movement (e.g., +1.42 or -3.33)
    private Double changePct;    // Percentage movement (e.g., +0.83 or -1.38)
}