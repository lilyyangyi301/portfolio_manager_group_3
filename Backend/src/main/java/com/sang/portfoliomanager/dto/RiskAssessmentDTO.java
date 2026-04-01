package com.sang.portfoliomanager.dto;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RiskAssessmentDTO {
    private Double beta;
    private Double sharpeRatio;
    private Double sortinoRatio;

    @Column(columnDefinition = "TEXT")
    private String riskSummary;
}