package com.sang.portfoliomanager.service;

import com.sang.portfoliomanager.entity.Finnhub;
import com.sang.portfoliomanager.repository.FinnhubRepository;
import com.sang.portfoliomanager.repository.HoldingRepository;
import com.sang.portfoliomanager.repository.MarketQuoteRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Service
public class StockPriceService {

    @Autowired
    private FinnhubRepository finnhubRepository;

    @Autowired
    private MarketQuoteRepository quoteRepo; // 注入行情仓库

    @Autowired
    private HoldingRepository holdingRepo;   // 注入持仓仓库

    @Value("${finnhub.api.key}")
    private String apiKey;

    @Value("${finnhub.base.url}")
    private String baseUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @Scheduled(fixedRate = 60000)
    @Transactional
    public void scheduledPriceUpdate() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        System.out.println("\n" + "=".repeat(60));
        System.out.println(">>> [SCHEDULED TASK] Triple-Table Sync Started | Time: " + timestamp);

        List<Finnhub> records = finnhubRepository.findAll();

        if (records.isEmpty()) {
            System.out.println("WARNING: No portfolio records found in database.");
        }

        for (Finnhub record : records) {
            updateAndLogStock(record);
            // Rate limit protection
            try { Thread.sleep(50); } catch (InterruptedException e) { e.printStackTrace(); }
        }

        System.out.println(">>> [SCHEDULED TASK] Sync Completed");
        System.out.println("=".repeat(60) + "\n");
    }

    private void updateAndLogStock(Finnhub record) {
        String url = String.format("%s/quote?symbol=%s&token=%s", baseUrl, record.getSymbol(), apiKey);

        try {
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);

            if (response != null && response.containsKey("c")) {
                Double latestPrice = Double.valueOf(response.get("c").toString());
                String symbol = record.getSymbol();

                record.setCurrentPrice(latestPrice);
                record.setMarketValue(record.getQuantity() * latestPrice);
                record.setTotalProfit((latestPrice - record.getAvgCost()) * record.getQuantity());
                finnhubRepository.save(record);

                quoteRepo.findById(symbol).ifPresent(quote -> {
                    quote.setCurrentPrice(latestPrice);

                    quoteRepo.save(quote);
                });

                holdingRepo.findBySymbol(symbol).ifPresent(holding -> {
                    holding.setCurrentPrice(latestPrice);

                    holding.setAvgPrice(record.getAvgCost());

                    holdingRepo.save(holding);
                });

                System.out.printf("[%s] Sync OK | Price: $%.2f | Profit: $%.2f%n",
                        symbol, latestPrice, record.getTotalProfit());
            }
        } catch (Exception e) {
            System.err.println("ERROR: Sync failed for " + record.getSymbol() + " -> " + e.getMessage());
        }
    }
}