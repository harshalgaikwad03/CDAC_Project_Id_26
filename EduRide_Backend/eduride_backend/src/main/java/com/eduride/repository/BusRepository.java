package com.eduride.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eduride.entity.Bus;

public interface BusRepository extends JpaRepository<Bus, Long>{

	List<Bus> findBySchoolId(Long schoolId);

	List<Bus> findByAgencyId(Long agencyId);

	Optional<Bus> findByDriverId(Long driverId);
}
