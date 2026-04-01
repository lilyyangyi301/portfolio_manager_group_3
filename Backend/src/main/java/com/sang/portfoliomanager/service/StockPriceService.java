package com.sang.portfoliomanager.service;

import com.sang.portfoliomanager.entity.Finnhub;
import com.sang.portfoliomanager.repository.FinnhubRepository;
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

    @Value("${finnhub.api.key}")
    private String apiKey;

    @Value("${finnhub.base.url}")
    private String baseUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @Transactional
    public void updateAllPortfolioPrices() {
        List<Finnhub> records = finnhubRepository.findAll();

        for (Finnhub record : records) {
            String url = String.format("%s/quote?symbol=%s&token=%s", baseUrl, record.getSymbol(), apiKey);

            try {
                Map<String, Object> response = restTemplate.getForObject(url, Map.class);

                if (response != null && response.containsKey("c")) {
                    Double latestPrice = Double.valueOf(response.get("c").toString());

                    record.setCurrentPrice(latestPrice);
                    record.setMarketValue(record.getQuantity() * latestPrice);
                    record.setTotalProfit((latestPrice - record.getAvgCost()) * record.getQuantity());

                    finnhubRepository.save(record);
                }
            } catch (Exception e) {
                System.err.println("Failed refresh:: " + record.getSymbol() + " -> " + e.getMessage());
            }
        }
    }
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void scheduledPriceUpdate() {
        // Formatter for a clean timestamp
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        System.out.println("\n" + "=".repeat(60));
        System.out.println(">>> [SCHEDULED TASK] Price Refresh Started | Time: " + timestamp);

        List<Finnhub> records = finnhubRepository.findAll();

        if (records.isEmpty()) {
            System.out.println("WARNING: No portfolio records found in database.");
        }

        for (Finnhub record : records) {
            updateAndLogStock(record);

            // 50ms delay to respect rate limits
            try { Thread.sleep(50); } catch (InterruptedException e) { e.printStackTrace(); }
        }

        System.out.println(">>> [SCHEDULED TASK] Refresh Completed");
        System.out.println("=".repeat(60) + "\n");
    }

    private void updateAndLogStock(Finnhub record) {
        String url = String.format("%s/quote?symbol=%s&token=%s", baseUrl, record.getSymbol(), apiKey);

        try {
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);

            if (response != null && response.containsKey("c")) {
                Double oldPrice = record.getCurrentPrice() != null ? record.getCurrentPrice() : 0.0;
                Double latestPrice = Double.valueOf(response.get("c").toString());

                // Update logic
                record.setCurrentPrice(latestPrice);
                record.setMarketValue(record.getQuantity() * latestPrice);
                record.setTotalProfit((latestPrice - record.getAvgCost()) * record.getQuantity());

                finnhubRepository.save(record);

                // English Console Output
                System.out.printf("[%s] Prev: $%.2f | New: $%.2f | Total Profit: $%.2f%n",
                        record.getSymbol(), oldPrice, latestPrice, record.getTotalProfit());
            }
        } catch (Exception e) {
            System.err.println("ERROR: Failed to update " + record.getSymbol() + " -> " + e.getMessage());
        }
    }
}