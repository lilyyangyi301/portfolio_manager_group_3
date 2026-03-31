package com.sang.portfoliomanager.repository;

import com.sang.portfoliomanager.entity.AccountBalance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AccountBalanceRepository extends JpaRepository<AccountBalance, Integer> {
    Optional<AccountBalance> findFirstByOrderByIdDesc();
}