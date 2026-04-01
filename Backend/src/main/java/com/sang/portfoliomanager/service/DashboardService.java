package com.sang.portfoliomanager.service;

import com.sang.portfoliomanager.dto.*;
import com.sang.portfoliomanager.entity.*;
import com.sang.portfoliomanager.repository.*;
import com.sang.portfoliomanager.entity.Holding;
import com.sang.portfoliomanager.entity.MarketQuote;
import com.sang.portfoliomanager.entity.PortfolioSnapshot;
import com.sang.portfoliomanager.entity.Watchlist;
import com.sang.portfoliomanager.repository.HoldingRepository;
import com.sang.portfoliomanager.repository.MarketQuoteRepository;
import com.sang.portfoliomanager.repository.SnapshotRepository;
import com.sang.portfoliomanager.repository.WatchlistRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private static final String DEFAULT_SUMMARY = "Local Ollama model is unavailable.";
    private static final String INSUFFICIENT_DATA_SUMMARY = "Insufficient data to generate portfolio risk summary.";
    private static final String UNCATEGORIZED_LABEL = "Uncategorized";

    @Autowired private HoldingRepository holdingRepo;
    @Autowired private MarketQuoteRepository quoteRepo;
    @Autowired private SnapshotRepository snapshotRepo;
    @Autowired private WatchlistRepository watchlistRepo;
    @Autowired private RiskMetricsRepository riskRepo;
    @Autowired private AccountBalanceRepository balanceRepo;

    @Value("${ollama.base-url:http://localhost:11434}")
    private String ollamaBaseUrl;

    @Value("${ollama.model:llama3.2}")
    private String ollamaModel;

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

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
        // 1. Fetch all holdings and current market quotes
        List<Holding> holdings = holdingRepo.findAll();
        Map<String, MarketQuote> quoteMap = quoteRepo.findAll().stream()
                .collect(Collectors.toMap(MarketQuote::getSymbol, q -> q));

        // 2. Determine the grouping strategy based on the 'type' parameter
        Map<String, List<Holding>> groupedMap;
        switch (type.toLowerCase()) {
            case "sectors":
            case "asset-types": // Supports Screenshot 8 and 9
                groupedMap = holdings.stream().collect(Collectors.groupingBy(h -> safeGroupingKey(h.getSector())));
                break;
            case "currency": // Supports Screenshot 10
                groupedMap = holdings.stream().collect(Collectors.groupingBy(h -> safeGroupingKey(h.getCurrency())));
                break;
            default: // Defaults to Screenshot 7 (Stocks, Crypto, ETFs, Bonds)
                groupedMap = holdings.stream().collect(Collectors.groupingBy(h -> safeGroupingKey(h.getAssetType())));
                break;
        }

        // 3. Calculate the absolute total value of the entire portfolio for percentage calculation
        double portfolioGrandTotal = holdings.stream()
                .mapToDouble(h -> getHoldingMarketValue(h, quoteMap))
                .sum();

        // 4. Transform grouped data into DTOs
        return groupedMap.entrySet().stream().map(entry -> {
            double categoryValue = 0;
            double categoryGain = 0;

            for (Holding h : entry.getValue()) {
                double currentPrice = getCurrentPrice(h, quoteMap);
                categoryValue += h.getQuantity() * currentPrice;
                categoryGain += (currentPrice - h.getAvgPrice()) * h.getQuantity();
            }

            // Calculate weight percentage
            double weight = (portfolioGrandTotal > 0) ? (categoryValue / portfolioGrandTotal) * 100 : 0;
            String formattedName = formatCategoryName(entry.getKey());
            return new DistributionDTO(
                    formattedName,      // The category name from groupingBy
                    categoryValue,      // Summed value
                    weight,             // Calculated percentage
                    categoryGain        // Summed gain
            );
        }).collect(Collectors.toList());
    }

    private String safeGroupingKey(String value) {
        if (value == null || value.isBlank()) {
            return UNCATEGORIZED_LABEL;
        }
        return value.trim();
    }

    private double getHoldingMarketValue(Holding holding, Map<String, MarketQuote> quoteMap) {
        return holding.getQuantity() * getCurrentPrice(holding, quoteMap);
    }

    private double getCurrentPrice(Holding holding, Map<String, MarketQuote> quoteMap) {
        MarketQuote quote = quoteMap.get(holding.getSymbol());
        if (quote != null && quote.getCurrentPrice() != null) {
            return quote.getCurrentPrice();
        }
        return holding.getCurrentPrice() != null ? holding.getCurrentPrice() : 0.0;
    }

    private String formatCategoryName(String name) {
        if (name == null || name.isEmpty()) return name;
        if (name.equalsIgnoreCase("ETF")) return "ETFs";

        return name.substring(0, 1).toUpperCase() + name.substring(1).toLowerCase();
    }//    RiskAssessment
    public RiskAssessmentDTO getRiskAssessment() {
        RiskMetrics latestMetric = riskRepo.findFirstByOrderByIdDesc()
        .orElse(null);
        List<PortfolioSnapshot> snapshots = snapshotRepo.findAllByOrderBySnapshotDateAsc();

        // Need at least 2 days of data to calculate returns
        if (snapshots.size() < 2) {
            return new RiskAssessmentDTO(0.0, 0.0, 0.0, INSUFFICIENT_DATA_SUMMARY);
        }

        // 2. Calculate Daily Returns
        List<Double> dailyReturns = new ArrayList<>();
        for (int i = 1; i < snapshots.size(); i++) {
            double prevValue = snapshots.get(i - 1).getTotalValue();
            double currValue = snapshots.get(i).getTotalValue();
            if (prevValue != 0) {
                dailyReturns.add((currValue - prevValue) / prevValue);
            }
        }

        // 3. Basic Stats: Average Return
        double avgReturn = dailyReturns.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);

        // 4. Standard Deviation (Volatility) for Sharpe Ratio
        double sumSquaredDiff = dailyReturns.stream()
                .mapToDouble(r -> Math.pow(r - avgReturn, 2))
                .sum();
        double stdDev = Math.sqrt(sumSquaredDiff / dailyReturns.size());

        // 5. Downside Deviation (Only negative returns) for Sortino Ratio
        double sumSquaredNegativeDiff = dailyReturns.stream()
                .filter(r -> r < 0)
                .mapToDouble(r -> Math.pow(r, 2)) // Assuming target return is 0
                .sum();
        double downsideDev = Math.sqrt(sumSquaredNegativeDiff / dailyReturns.size());

        // 6. Annualized Calculations (Simplified for simulation)
        // Simulated Risk-Free Rate (e.g., 2% annual -> approx 0.00008 daily)
        double dailyRf = 0.00008;

        // Sharpe = (Avg Return - Rf) / StdDev
        double sharpe = (stdDev != 0) ? (avgReturn - dailyRf) / stdDev : 0.0;

        // Sortino = (Avg Return - Rf) / DownsideDev
        double sortino = (downsideDev != 0) ? (avgReturn - dailyRf) / downsideDev : 0.0;

        // Beta Simulation (Portfolio Volatility / Market Volatility)
        // Assume Market standard deviation is 0.01 (1%) for simulation
        double marketStdDev = 0.01;
        double beta = stdDev / marketStdDev;

        double roundedBeta = round(beta);
        double roundedSharpe = round(sharpe * 10);
        double roundedSortino = round(sortino * 10);
        String riskSummary = generateRiskSummary(roundedBeta, roundedSharpe, roundedSortino);

        return new RiskAssessmentDTO(
            roundedBeta,
            roundedSharpe,
            roundedSortino,
                riskSummary
        );
    }

        private String generateRiskSummary(double beta, double sharpeRatio, double sortinoRatio) {
        try {
            String requestBody = objectMapper.writeValueAsString(Map.of(
                    "model", ollamaModel,
                "prompt", buildRiskPrompt(beta, sharpeRatio, sortinoRatio),
                    "stream", false
            ));

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(ollamaBaseUrl + "/api/generate"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                return DEFAULT_SUMMARY;
            }

            JsonNode responseJson = objectMapper.readTree(response.body());
            String riskSummary = responseJson.path("response").asText(DEFAULT_SUMMARY).trim();
            return riskSummary.isEmpty() ? DEFAULT_SUMMARY : riskSummary;
        } catch (Exception exception) {
            return DEFAULT_SUMMARY;
        }
    }

    // build the prompt for the Ollama model based on the calculated metrics
    private String buildRiskPrompt(double beta, double sharpeRatio, double sortinoRatio) {
        return "You are a financial portfolio risk analyst. Based on the following metrics, write a concise 2-3 sentence risk summary for an investor. " +
                "Explain overall risk level, risk-adjusted return quality, and downside protection in plain English without bullet points. " +
                "Metrics: beta=" + beta + ", sharpeRatio=" + sharpeRatio + ", sortinoRatio=" + sortinoRatio + "."+
                "You don't need to add any additional explanation for your output, just provide the summary directly starting with 'Your portfolio...' and avoid starting with phrases like 'Based on the metrics...'.";
    }

    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }

    public AccountBalanceDTO getCurrentCashBalance() {
        double balance = balanceRepo.findFirstByOrderByIdDesc()
                .map(AccountBalance::getBalance)
                .orElse(0.0);
        return new AccountBalanceDTO(round(balance));
    }

    //Watchlist
    public List<WatchlistDTO> getWatchlistData() {
        List<Watchlist> watchlist = watchlistRepo.findAll();
        Map<String, MarketQuote> quoteMap = quoteRepo.findAll().stream()
                .collect(Collectors.toMap(MarketQuote::getSymbol, q -> q));

        Random random = new Random();

        return watchlist.stream().map(w -> {
            MarketQuote q = quoteMap.get(w.getSymbol());

            // Base data from DB
            double price = (q != null) ? q.getCurrentPrice() : 100.0;
            String name = (q != null) ? q.getCompanyName() : "Unknown Corp";

            // Simulation Logic: Generate random fluctuations (both positive and negative)
            // Gaussian distribution centered at 0 ensures ~50% up and ~50% down
            double volatility = 0.02; // 2% standard deviation
            double simulatedChangePct = random.nextGaussian() * volatility * 100;
            double changeAmount = price * (simulatedChangePct / 100);

            return new WatchlistDTO(
                    w.getSymbol(),
                    name,
                    price + changeAmount, // Price after fluctuation
                    changeAmount,
                    simulatedChangePct
            );
        }).collect(Collectors.toList());
    }

    /**
     * Removes a stock from the watchlist.
     */
    @Transactional
    public void removeFromWatchlist(String symbol) {
        watchlistRepo.deleteBySymbol(symbol);
    }

    /**
     * Search stocks by symbol or company name for Stock Finder.
     */
    public List<StockDetailDTO> searchStocks(String query) {
        List<MarketQuote> results = quoteRepo.findBySymbolContainingIgnoreCaseOrCompanyNameContainingIgnoreCase(query, query);

        return results.stream()
                .map(this::convertToDetailDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get full details of a single stock.
     */
    public List<StockDetailDTO> getAllStockDetails() {
        List<MarketQuote> allQuotes = quoteRepo.findAll();

        return allQuotes.stream()
                .map(this::convertToDetailDTO)
                .collect(Collectors.toList());
    }

    /**
     * Add a stock to the user's watchlist.
     */
    @Transactional
    public void addToWatchlist(String symbol) {
        if (!watchlistRepo.findAll().stream().anyMatch(w -> w.getSymbol().equals(symbol))) {
            Watchlist newItem = new Watchlist();
            newItem.setSymbol(symbol);
            watchlistRepo.save(newItem);
        }
    }

    // Helper method to map Entity to DTO
    private StockDetailDTO convertToDetailDTO(MarketQuote q) {
        return new StockDetailDTO(
                q.getSymbol(), q.getCompanyName(), q.getCurrentPrice(), q.getChangePct(),
                q.getSector(), q.getIndustry(), q.getMarketCap(), q.getPeRatio(),
                q.getDividendYield(), q.getWeek52High(), q.getWeek52Low(),
                q.getAvgVolume(), q.getExchange(), q.getDescription()
        );
    }
    @Transactional
    public String executeTrade(TradeRequest request) {

        String actionStr = (request.getAction() != null) ? request.getAction().trim() : "";
        boolean isSell = "SELL".equalsIgnoreCase(actionStr) || "-1".equals(actionStr);

        if (isSell) {
            request.setQuantity(-Math.abs(request.getQuantity()));
        } else {
            request.setQuantity(Math.abs(request.getQuantity()));
        }

        AccountBalance latestAccount = balanceRepo.findFirstByOrderByIdDesc()
                .orElseThrow(() -> new RuntimeException("No balance record found"));

        double currentBalance = latestAccount.getBalance();
        double totalValue = request.getPrice() * Math.abs(request.getQuantity());
        double newBalance;

        if (request.getQuantity() > 0) {
            if (currentBalance < totalValue) {
                return "Trade Failed: Insufficient funds.";
            }
            newBalance = currentBalance - totalValue;
            System.out.println(">>> [LOG] BUY validated. New Balance will be: " + (currentBalance - totalValue));

        } else {
            Holding holding = holdingRepo.findBySymbol(request.getSymbol()).orElse(null);

            if (holding == null || holding.getQuantity() <= 0) {
                System.out.println("[INTERCEPTED] No holding found for: " + request.getSymbol());
                return "Trade Failed: You do not own this stock.";
            }

            if (holding.getQuantity() < Math.abs(request.getQuantity())) {
                System.out.println("[INTERCEPTED] Insufficient quantity for: " + request.getSymbol());
                return "Trade Failed: Not enough shares to sell.";
            }

            newBalance = currentBalance + totalValue;
            System.out.println(">>> [LOG] SELL validated. New Balance will be: " + (currentBalance + totalValue));
        }

        updateHolding(request);

        AccountBalance newBalanceRecord = new AccountBalance();
        newBalanceRecord.setBalance(round(newBalance));
        balanceRepo.save(newBalanceRecord);

        return "Trade Successful! Balance: $" + round(newBalance);
    }
    private void updateHolding(TradeRequest req) {
        Holding holding = holdingRepo.findBySymbol(req.getSymbol()).orElse(null);

        double tradeQty = req.getQuantity().doubleValue();

        if (tradeQty > 0) {
            if (holding == null) {
                holding = new Holding();
                holding.setSymbol(req.getSymbol());
                holding.setQuantity(tradeQty);
                holding.setAvgPrice(req.getPrice());
                holding.setAssetType(formatCategoryName(req.getAssetType()));
                holding.setSector(formatCategoryName(req.getSector()));
            } else {
                double currentTotalValue = holding.getQuantity() * holding.getAvgPrice();
                double newPurchaseValue = tradeQty * req.getPrice();
                double newTotalQty = holding.getQuantity() + tradeQty;

                holding.setQuantity(newTotalQty);
                holding.setAvgPrice((currentTotalValue + newPurchaseValue) / newTotalQty);
            }
            holdingRepo.save(holding);
        }
        else if (tradeQty < 0) {
            if (holding != null) {
                double remainingQty = holding.getQuantity() + tradeQty; // tradeQty 是负数
                if (remainingQty <= 0) {
                    holdingRepo.delete(holding);
                } else {
                    holding.setQuantity(remainingQty);
                    holdingRepo.save(holding);
                }
            }
        }
    }
}