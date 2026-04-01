package com.sang.portfoliomanager.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DistributionDTO {
    private String categoryName;    // Name of the group (e.g., "Technology", "Stocks", "USD")
    private Double totalValue;      // Current market value of this group
    private Double allocationPct;   // Percentage of total portfolio (0.0 to 100.0)
    private Double unrealizedGain;  // Total floating profit/loss for this group
}