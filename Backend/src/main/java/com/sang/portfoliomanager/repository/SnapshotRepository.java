package com.sang.portfoliomanager.repository;

import com.sang.portfoliomanager.entity.PortfolioSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SnapshotRepository extends JpaRepository<PortfolioSnapshot, Long> {
    // 只有当你需要特殊的排序（比如按日期升序）时，才需要加这一行
    List<PortfolioSnapshot> findAllByOrderBySnapshotDateAsc();
}