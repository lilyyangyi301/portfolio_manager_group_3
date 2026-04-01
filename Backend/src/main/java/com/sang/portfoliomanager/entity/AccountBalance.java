package com.sang.portfoliomanager.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "account_balance")
@Data
public class AccountBalance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Double balance;

    @Column(name = "last_updated", insertable = false, updatable = false)
    private LocalDateTime lastUpdated;
}