package com.sang.portfoliomanager.service;

import com.sang.portfoliomanager.dto.TradeRequest;
import com.sang.portfoliomanager.entity.AccountBalance;
import com.sang.portfoliomanager.entity.Holding;
import com.sang.portfoliomanager.repository.AccountBalanceRepository;
import com.sang.portfoliomanager.repository.HoldingRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {

    @InjectMocks
    private DashboardService dashboardService;

    @Mock
    private HoldingRepository holdingRepo;

    @Mock
    private AccountBalanceRepository balanceRepo;

    @Test
    void testBuyTradeSuccess() {
        TradeRequest req = new TradeRequest();
        req.setAction("BUY");
        req.setSymbol("AAPL");
        req.setQuantity(10);
        req.setPrice(100.0);

        AccountBalance ab = new AccountBalance();
        ab.setBalance(2000.0);

        when(balanceRepo.findFirstByOrderByIdDesc()).thenReturn(Optional.of(ab));

        String result = dashboardService.executeTrade(req);

        assertTrue(result.contains("Trade Successful"));
        verify(balanceRepo, times(1)).save(any(AccountBalance.class));
    }

    @Test
    void testBuyTradeInsufficientFunds() {
        TradeRequest req = new TradeRequest();
        req.setAction("BUY");
        req.setSymbol("AAPL");
        req.setQuantity(10);
        req.setPrice(100.0);

        AccountBalance ab = new AccountBalance();
        ab.setBalance(500.0);

        when(balanceRepo.findFirstByOrderByIdDesc()).thenReturn(Optional.of(ab));

        String result = dashboardService.executeTrade(req);

        assertTrue(result.contains("Insufficient funds"));
        verify(balanceRepo, never()).save(any(AccountBalance.class));
    }

    @Test
    void testSellTradeSuccess() {
        TradeRequest req = new TradeRequest();
        req.setAction("SELL");
        req.setSymbol("AAPL");
        req.setQuantity(5);
        req.setPrice(100.0);

        AccountBalance ab = new AccountBalance();
        ab.setBalance(1000.0);

        Holding holding = new Holding();
        holding.setSymbol("AAPL");
        holding.setQuantity(10.0);

        when(balanceRepo.findFirstByOrderByIdDesc()).thenReturn(Optional.of(ab));
        when(holdingRepo.findBySymbol("AAPL")).thenReturn(Optional.of(holding));

        String result = dashboardService.executeTrade(req);

        assertTrue(result.contains("Trade Successful"));
        verify(balanceRepo, times(1)).save(any(AccountBalance.class));
    }

    @Test
    void testSellTradeNoHolding() {
        TradeRequest req = new TradeRequest();
        req.setAction("SELL");
        req.setSymbol("AAPL");
        req.setQuantity(5);
        req.setPrice(100.0);

        AccountBalance ab = new AccountBalance();
        ab.setBalance(1000.0);

        when(balanceRepo.findFirstByOrderByIdDesc()).thenReturn(Optional.of(ab));
        when(holdingRepo.findBySymbol("AAPL")).thenReturn(Optional.empty());

        String result = dashboardService.executeTrade(req);

        assertTrue(result.contains("You do not own this stock"));
        verify(balanceRepo, never()).save(any(AccountBalance.class));
    }

    @Test
    void testSellTradeInsufficientQuantity() {
        TradeRequest req = new TradeRequest();
        req.setAction("SELL");
        req.setSymbol("AAPL");
        req.setQuantity(20);
        req.setPrice(100.0);

        AccountBalance ab = new AccountBalance();
        ab.setBalance(1000.0);

        Holding holding = new Holding();
        holding.setSymbol("AAPL");
        holding.setQuantity(5.0);

        when(balanceRepo.findFirstByOrderByIdDesc()).thenReturn(Optional.of(ab));
        when(holdingRepo.findBySymbol("AAPL")).thenReturn(Optional.of(holding));

        String result = dashboardService.executeTrade(req);

        assertTrue(result.contains("Not enough shares to sell"));
        verify(balanceRepo, never()).save(any(AccountBalance.class));
    }
}
