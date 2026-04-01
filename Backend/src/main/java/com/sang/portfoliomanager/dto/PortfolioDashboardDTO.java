package com.sang.portfoliomanager.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PortfolioDashboardDTO {
    // 顶部汇总数值
    private Double portfolioValue;
    private Double unrealizedGain;
    private Double realizedGain;
    private Double totalGain;

    // 右侧六个时间周期的指标
    private PerformanceMetricsDTO performanceMetrics;

    // 中间折线图数据
    private List<ChartDataDTO> chartData;
}

@Data
@AllArgsConstructor
@NoArgsConstructor
class ChartDataDTO {
    private String date;      // 横轴日期
    private Double value;     // Value 视图数值
    private Double performance; // Performance 视图百分比
}