package com.sang.portfoliomanager.repository;

import com.sang.portfoliomanager.entity.Watchlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WatchlistRepository extends JpaRepository<Watchlist, Long> {
    // Custom delete method by symbol
    void deleteBySymbol(String symbol);
}