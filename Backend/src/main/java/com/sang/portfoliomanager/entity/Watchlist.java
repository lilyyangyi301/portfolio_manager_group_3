package com.sang.portfoliomanager.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "watchlist")
@Data
public class Watchlist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String symbol;
}