package com.sang.portfoliomanager.dto;

import lombok.Data;

@Data
public class TradeRequest {
    private String symbol;      // 股票代码 (如 AAPL)
    private Integer quantity;   // 交易数量 (买入为正, 卖出为负)
    private Double price;       // 交易价格 (即弹窗里的 $182.45)
    private String assetType;   // 资产类型 (如 Stocks, Crypto)
    private String sector;      // 所属板块
    private String action;    // 新增字段: "BUY" 或 "SELL"
}