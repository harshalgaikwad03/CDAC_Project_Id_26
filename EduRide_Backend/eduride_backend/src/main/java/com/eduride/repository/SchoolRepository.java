package com.eduride.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eduride.entity.School;

public interface SchoolRepository extends JpaRepository<School, Long>{

	List<School> findByAgencyId(Long agencyId);

	Optional<School> findByEmail(String email);

}
