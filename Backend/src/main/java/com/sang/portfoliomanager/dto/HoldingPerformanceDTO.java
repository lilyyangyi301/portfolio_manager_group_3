package com.sang.portfoliomanager.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class HoldingPerformanceDTO {
    private String symbol;
    private String name;
    private Double value;      // Total value of this holding
    private Double changePct;  // From market_quotes table
}