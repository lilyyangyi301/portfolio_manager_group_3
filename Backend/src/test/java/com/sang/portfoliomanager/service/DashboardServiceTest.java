package com.sang.portfoliomanager.service;
import com.sang.portfoliomanager.dto.TradeRequest;
import com.sang.portfoliomanager.entity.AccountBalance;
import com.sang.portfoliomanager.entity.Holding;
import com.sang.portfoliomanager.repository.AccountBalanceRepository;
import com.sang.portfoliomanager.repository.HoldingRepository;
import com.sang.portfoliomanager.service.DashboardService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.*;

import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class) // 2. 替代 MockitoAnnotations.openMocks，自动初始化 @Mock
class DashboardServiceTest {

    @InjectMocks
    private DashboardService dashboardService;

    @Mock
    private HoldingRepository holdingRepo;

    @Mock
    private AccountBalanceRepository balanceRepo;


    @Test
    void testBuyTrade_Success() {
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
    void testBuyTrade_InsufficientFunds() {
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
        verify(balanceRepo, never()).save(ArgumentMatchers.any(AccountBalance.class));
    }

    @Test
    void testSellTrade_Success() {
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
        verify(balanceRepo, times(1)).save(ArgumentMatchers.any(AccountBalance.class));
    }

    @Test
    void testSellTrade_NoHolding() {
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

        assertTrue(result.contains("You do not own this stock")); // 这里的 String 必须和你 Service 里的报错文字完全一致
        verify(balanceRepo, never()).save(ArgumentMatchers.any(AccountBalance.class));
    }

    @Test
    void testSellTrade_InsufficientQuantity() {
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
        verify(balanceRepo, never()).save(ArgumentMatchers.any(AccountBalance.class));
    }
}