package com.sang.portfoliomanager.service;

import com.sang.portfoliomanager.dto.*;
import com.sang.portfoliomanager.entity.*;
import com.sang.portfoliomanager.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired private HoldingRepository holdingRepo;
    @Autowired private MarketQuoteRepository quoteRepo;
    @Autowired private SnapshotRepository snapshotRepo;
    @Autowired private RiskMetricsRepository riskRepo;

    //StartInSeconds
    public DashboardSummaryDTO getSummaryData() {
        // 1. Calculate top cards (Portfolio value, gains)
        List<Holding> holdings = holdingRepo.findAll();
        Map<String, MarketQuote> priceMap = quoteRepo.findAll().stream()
                .collect(Collectors.toMap(MarketQuote::getSymbol, q -> q));

        double portfolioValue = 0;
        double unrealizedGain = 0;

        for (Holding h : holdings) {
            MarketQuote quote = priceMap.get(h.getSymbol());
            double currentPrice = (quote != null) ? quote.getCurrentPrice() : 0.0;
            portfolioValue += h.getQuantity() * currentPrice;
            unrealizedGain += (currentPrice - h.getAvgPrice()) * h.getQuantity();
        }

        // 2. Fetch chart data from portfolio_snapshots
        // Using the customized query with OrderBy to ensure time sequence
        List<DashboardSummaryDTO.ChartPoint> chart = snapshotRepo.findAllByOrderBySnapshotDateAsc().stream()
                .map(s -> new DashboardSummaryDTO.ChartPoint(
                        s.getSnapshotDate().toString(),
                        s.getTotalValue(),      // For 'Value' view
                        s.getPerformancePct()   // For 'Performance' view
                ))
                .collect(Collectors.toList());

        double fixedRealizedGain = 5230.25;

        return new DashboardSummaryDTO(
                portfolioValue,
                unrealizedGain,
                fixedRealizedGain,
                unrealizedGain + fixedRealizedGain,
                chart
        );
    }
//ControlInvestment
public ControlViewDTO getControlPerformanceData() {
    List<PortfolioSnapshot> snapshots = snapshotRepo.findAllByOrderBySnapshotDateAsc();
    if (snapshots.isEmpty()) return null;

    PortfolioSnapshot latest = snapshots.get(snapshots.size() - 1);
    double currentVal = latest.getTotalValue();
    LocalDate today = latest.getSnapshotDate();

    List<ChartPointDTO> chartData = snapshots.stream()
            .map(s -> new ChartPointDTO(
                    s.getSnapshotDate().toString(),
                    s.getTotalValue(),
                    s.getPerformancePct()
            )).collect(Collectors.toList());

    PerformanceMetricsDTO metrics = new PerformanceMetricsDTO(
            calculateReturn(snapshots, currentVal, today.minusMonths(1)), // 1M
            calculateReturn(snapshots, currentVal, today.minusMonths(3)), // 3M
            calculateReturn(snapshots, currentVal, today.minusMonths(6)), // 6M
            calculateYTD(snapshots, currentVal, today.getYear()),         // YTD
            calculateReturn(snapshots, currentVal, today.minusYears(1)),  // 1Y
            calculateReturn(snapshots, currentVal, snapshots.get(0).getSnapshotDate()) // All Time
    );

    return new ControlViewDTO(chartData, metrics);
}

    private Double calculateReturn(List<PortfolioSnapshot> snapshots, double currentVal, LocalDate targetDate) {
        return snapshots.stream()
                .filter(s -> !s.getSnapshotDate().isAfter(targetDate))
                .reduce((first, second) -> second)
                .map(old -> {
                    double baseVal = old.getTotalValue();
                    if (baseVal == 0) return 0.0;
                    double rawReturn = ((currentVal - baseVal) / baseVal) * 100;
                    return roundToTwoDecimals(rawReturn); // 格式化
                })
                .orElseGet(() -> {
                    double firstVal = snapshots.get(0).getTotalValue();
                    double rawReturn = ((currentVal - firstVal) / firstVal) * 100;
                    return roundToTwoDecimals(rawReturn); // 格式化
                });
    }

    private Double calculateYTD(List<PortfolioSnapshot> snapshots, double currentVal, int year) {
        return snapshots.stream()
                .filter(s -> s.getSnapshotDate().getYear() == year)
                .findFirst()
                .map(old -> {
                    double rawReturn = ((currentVal - old.getTotalValue()) / old.getTotalValue()) * 100;
                    return roundToTwoDecimals(rawReturn); // 格式化
                })
                .orElse(0.0);
    }

    private Double roundToTwoDecimals(double value) {
        return BigDecimal.valueOf(value)
                .setScale(2, RoundingMode.HALF_UP)
                .doubleValue();
    }

//    MeasurePotential
    public List<HoldingPerformanceDTO> getHoldingsPerformance() {
        List<Holding> holdings = holdingRepo.findAll();

        Map<String, MarketQuote> quoteMap = quoteRepo.findAll().stream()
                .collect(Collectors.toMap(MarketQuote::getSymbol, q -> q));

        return holdings.stream().map(h -> {
            MarketQuote quote = quoteMap.get(h.getSymbol());
            double currentPrice = (quote != null) ? quote.getCurrentPrice() : 0.0;
            double changePct = (quote != null) ? quote.getChangePct() : 0.0;
            double totalValue = h.getQuantity() * currentPrice;

            return new HoldingPerformanceDTO(
                    h.getSymbol(),
                    h.getName(),
                    totalValue,
                    changePct
            );
        }).collect(Collectors.toList());
    }

    //Manage Diversification
    public List<DistributionDTO> getDiversificationData(String type) {
        List<Holding> holdings = holdingRepo.findAll();
        Map<String, MarketQuote> quoteMap = quoteRepo.findAll().stream()
                .collect(Collectors.toMap(MarketQuote::getSymbol, q -> q));

        Map<String, List<Holding>> groupedMap;
        switch (type.toLowerCase()) {
            case "sectors":
            case "asset-types":
                groupedMap = holdings.stream().collect(Collectors.groupingBy(Holding::getSector));
                break;
            case "currency":
                groupedMap = holdings.stream().collect(Collectors.groupingBy(Holding::getCurrency));
                break;
            default:
                groupedMap = holdings.stream().collect(Collectors.groupingBy(Holding::getAssetType));
                break;
        }

        double portfolioGrandTotal = holdings.stream()
                .mapToDouble(h -> h.getQuantity() * quoteMap.get(h.getSymbol()).getCurrentPrice())
                .sum();

        return groupedMap.entrySet().stream().map(entry -> {
            double categoryValue = 0;
            double categoryGain = 0;

            for (Holding h : entry.getValue()) {
                double currentPrice = quoteMap.get(h.getSymbol()).getCurrentPrice();
                categoryValue += h.getQuantity() * currentPrice;
                categoryGain += (currentPrice - h.getAvgPrice()) * h.getQuantity();
            }

            double weight = (portfolioGrandTotal > 0) ? (categoryValue / portfolioGrandTotal) * 100 : 0;

            String formattedName = formatCategoryName(entry.getKey());

            return new DistributionDTO(
                    formattedName,
                    round(categoryValue),
                    round(weight),
                    round(categoryGain)
            );
        }).collect(Collectors.toList());
    }

    private String formatCategoryName(String name) {
        if (name == null || name.isEmpty()) return name;
        if (name.equalsIgnoreCase("ETF")) return "ETFs";

        return name.substring(0, 1).toUpperCase() + name.substring(1).toLowerCase();
    }

//    RiskAssessment
    public RiskAssessmentDTO getRiskAssessment() {
        RiskMetrics latestMetric = riskRepo.findFirstByOrderByIdDesc()
                .orElse(null);

        // 2. 获取快照用于数学计算
        List<PortfolioSnapshot> snapshots = snapshotRepo.findAllByOrderBySnapshotDateAsc();

        // 数据不足处理
        if (snapshots.size() < 2) {
            return new RiskAssessmentDTO(0.0, 0.0, 0.0, "Insufficient Data", "Insufficient Data", "Insufficient Data", "Insufficient portfolio history.");
        }

        // --- A. 计算每日收益率 ---
        List<Double> dailyReturns = new ArrayList<>();
        for (int i = 1; i < snapshots.size(); i++) {
            double prevValue = snapshots.get(i - 1).getTotalValue();
            double currValue = snapshots.get(i).getTotalValue();
            if (prevValue != 0) {
                dailyReturns.add((currValue - prevValue) / prevValue);
            }
        }

        // --- B. 基础统计量计算 ---
        double avgReturn = dailyReturns.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);

        // 标准差 (Volatility)
        double sumSquaredDiff = dailyReturns.stream()
                .mapToDouble(r -> Math.pow(r - avgReturn, 2))
                .sum();
        double stdDev = Math.sqrt(sumSquaredDiff / dailyReturns.size());

        // 下行偏差 (Downside Deviation)
        double sumSquaredNegativeDiff = dailyReturns.stream()
                .filter(r -> r < 0)
                .mapToDouble(r -> Math.pow(r, 2))
                .sum();
        double downsideDev = Math.sqrt(sumSquaredNegativeDiff / dailyReturns.size());

        // --- C. 核心指标计算 ---
        double dailyRf = 0.00008; // 模拟无风险利率
        double sharpe = (stdDev != 0) ? (avgReturn - dailyRf) / stdDev : 0.0;
        double sortino = (downsideDev != 0) ? (avgReturn - dailyRf) / downsideDev : 0.0;
        double marketStdDev = 0.01;
        double beta = (marketStdDev != 0) ? stdDev / marketStdDev : 0.0;

        // --- D. 判定状态文字 (Status Strings) ---
        String betaStatus = (beta > 1.1) ? "More volatile than market" : "Lower volatility than market";
        String sharpeStatus = (sharpe * 10 > 1.2) ? "Good risk-adjusted returns" : "Suboptimal risk-adjusted returns";
        String sortinoStatus = (sortino * 10 > 1.8) ? "Excellent downside protection" : "Moderate downside protection";

        // --- E. 获取数据库中的 Summary ---
        String finalSummary = (latestMetric != null && latestMetric.getSummary() != null)
                ? latestMetric.getSummary()
                : "No detailed analysis available in database.";

        // 3. 严格按照 DTO 的 7 个参数顺序返回
        return new RiskAssessmentDTO(
                round(beta),          // 1. beta
                round(sharpe * 10),   // 2. sharpeRatio
                round(sortino * 10),  // 3. sortinoRatio
                betaStatus,           // 4. betaStatus
                sharpeStatus,         // 5. sharpeStatus
                sortinoStatus,        // 6. sortinoStatus
                finalSummary          // 7. riskSummary
        );
}
    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }

}
