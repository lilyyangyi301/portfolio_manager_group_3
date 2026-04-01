package com.sang.portfoliomanager.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ControlViewDTO {
    // 中间折线图：支持 Value 和 Performance 切换
    private List<ChartPointDTO> chartData;

    // 右侧性能指标：1M, 3M, 6M, YTD, 1Y, All
    private PerformanceMetricsDTO performanceMetrics;
}
