package com.sang.portfoliomanager.controller;

import com.sang.portfoliomanager.dto.*;
import com.sang.portfoliomanager.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {
    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/StartInSeconds")
    public ResponseEntity<DashboardSummaryDTO> getSummary() {
        return ResponseEntity.ok(dashboardService.getSummaryData());
    }
    @GetMapping("/ControlInvestment")
    public ResponseEntity<ControlViewDTO> getControlView() {
        return ResponseEntity.ok(dashboardService.getControlPerformanceData());
    }
    @GetMapping("/MeasurePotential")
    public ResponseEntity<List<HoldingPerformanceDTO>> getHoldingsPerformance() {
        return ResponseEntity.ok(dashboardService.getHoldingsPerformance());
    }

    @GetMapping("/ManageDiversification/{type}")
    public ResponseEntity<List<DistributionDTO>> getDistribution(@PathVariable String type) {
        // This endpoint feeds the Pie/Donut charts and the distribution tables
        return ResponseEntity.ok(dashboardService.getDiversificationData(type));
    }

    @GetMapping("/RiskAssessment")
    public ResponseEntity<RiskAssessmentDTO> getRiskAssessment() {
        // This replaces the previous static database read with real calculation logic
        return ResponseEntity.ok(dashboardService.getRiskAssessment());
    }

    // GET all watchlist items
    @GetMapping("/Watchlist/AllStocks")
    public ResponseEntity<List<WatchlistDTO>> getWatchlist() {
        return ResponseEntity.ok(dashboardService.getWatchlistData());
    }

    // DELETE a specific item by symbol
    @DeleteMapping("/Watchlist/{symbol}")
    public ResponseEntity<Void> deleteFromWatchlist(@PathVariable String symbol) {
        dashboardService.removeFromWatchlist(symbol);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/StockFinder/SearchForTickerOrCompanyname")
    public ResponseEntity<List<StockDetailDTO>> searchStocks(@RequestParam String query) {
        return ResponseEntity.ok(dashboardService.searchStocks(query));
    }

    @GetMapping("/StockFinder/AllStocks")
    public ResponseEntity<List<StockDetailDTO>> getAllStocks() {
        return ResponseEntity.ok(dashboardService.getAllStockDetails());
    }

    @PostMapping("/Watchlist/{symbol}")
    public ResponseEntity<Void> addToWatchlist(@PathVariable String symbol) {
        dashboardService.addToWatchlist(symbol);
        return ResponseEntity.ok().build();
    }
}