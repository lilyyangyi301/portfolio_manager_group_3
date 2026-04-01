package com.sang.portfoliomanager.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Finnhub {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String symbol;      // 股票代码，如 "AAPL"
    private Integer quantity;   // 持有数量
    private Double avgPrice;    // 买入平均成本

    // 以下是我们要通过 API 刷新的字段
    private Double currentPrice;  // 当前价
    private Double marketValue;   // 当前市值 (quantity * currentPrice)
    private Double totalProfit;;    // 盈亏 (marketValue - cost)
}
