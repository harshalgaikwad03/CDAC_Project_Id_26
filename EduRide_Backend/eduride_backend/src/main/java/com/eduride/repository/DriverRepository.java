package com.eduride.repository;

import com.eduride.entity.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface DriverRepository extends JpaRepository<Driver, Long> {

    List<Driver> findByAgencyId(Long agencyId);

    Optional<Driver> findByEmail(String email);

    @Query("""
        SELECT d FROM Driver d
        WHERE d.agency.id = :agencyId
          AND d.id NOT IN (
              SELECT b.driver.id FROM Bus b WHERE b.driver IS NOT NULL
          )
    """)
    List<Driver> findUnassignedDriversByAgency(Long agencyId);
}
