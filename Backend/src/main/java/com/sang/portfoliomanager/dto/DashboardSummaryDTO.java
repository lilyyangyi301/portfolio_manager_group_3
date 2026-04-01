package com.sang.portfoliomanager.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class DashboardSummaryDTO {
    private Double portfolioValue;    // Portfolio value
    private Double unrealizedGain;    // Unrealized gain
    private Double realizedGain;      // Realized gain (Static for now)
    private Double totalGain;         // Total gain
    private List<ChartPoint> chartData;

    @Data
    @AllArgsConstructor
    public static class ChartPoint {
        private String date;
        private Double value;
        private Double performance;
    }
}