package com.eduride.repository;

import com.eduride.entity.Driver;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DriverRepository extends JpaRepository<Driver, Long> {

	List<Driver> findByAgencyId(Long agencyId);

	Optional<Driver> findByEmail(String email);

}
