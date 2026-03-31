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
    private String betaStatus;
    private String sharpeStatus;
    private String sortinoStatus;

    @Column(columnDefinition = "TEXT")
    private String riskSummary;
}