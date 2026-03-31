package com.sang.portfoliomanager.repository;

import com.sang.portfoliomanager.entity.MarketQuote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MarketQuoteRepository extends JpaRepository<MarketQuote, String> {
    // Spring Data JPA magic: search by symbol OR company name (case-insensitive)
    List<MarketQuote> findBySymbolContainingIgnoreCaseOrCompanyNameContainingIgnoreCase(String symbol, String companyName);
}
