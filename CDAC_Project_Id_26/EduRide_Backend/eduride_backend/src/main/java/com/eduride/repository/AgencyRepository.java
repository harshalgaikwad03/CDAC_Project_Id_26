package com.eduride.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eduride.entity.Agency;

public interface AgencyRepository extends JpaRepository<Agency, Long> {

	
	Optional<Agency> findByEmail(String email);

}
