package com.sang.portfoliomanager.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChartPointDTO {
    private String date;
    private Double value;       // 对应 Value 轴 (如 140000, 105000)
    private Double performance; // 对应 Performance 轴 (如 +25.43%)
}