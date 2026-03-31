package com.sang.portfoliomanager.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PerformanceMetricsDTO {
    // 对应右侧 6 个白色卡片的百分比数据
    private Double oneMonth;   // 1 month
    private Double threeMonth; // 3 month
    private Double sixMonth;   // 6 month
    private Double ytd;        // Year To Date (年初至今)
    private Double oneYear;    // 1 year
    private Double allTime;    // All time
}