package com.eduride.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.eduride.entity.Bus;
import com.eduride.entity.School;

public interface BusRepository extends JpaRepository<Bus, Long> {

    List<Bus> findBySchoolId(Long schoolId);

    List<Bus> findByAgencyId(Long agencyId);

    Optional<Bus> findByDriverId(Long driverId);

    long countBySchoolId(Long schoolId);

    @Query("""
            SELECT b FROM Bus b
            LEFT JOIN FETCH b.school
            WHERE b.driver.id = :driverId
        """)
        Optional<Bus> findByDriverIdWithSchool(Long driverId);

	Optional<Bus> findByBusNumber(String busNumber);
    
}
