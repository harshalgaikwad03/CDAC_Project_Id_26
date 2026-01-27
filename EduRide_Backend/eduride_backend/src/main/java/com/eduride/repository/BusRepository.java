package com.eduride.repository;

import com.eduride.entity.Bus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BusRepository extends JpaRepository<Bus, Long> {

    List<Bus> findBySchoolId(Long schoolId);

    List<Bus> findByAgencyId(Long agencyId);

    Optional<Bus> findByDriverId(Long driverId);

    long countBySchoolId(Long schoolId);
}
