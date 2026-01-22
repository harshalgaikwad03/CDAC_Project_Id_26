package com.eduride.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eduride.entity.BusHelper;

public interface BusHelperRepository extends JpaRepository<BusHelper, Long> {

	List<BusHelper> findBySchoolId(Long schoolId);

	List<BusHelper> findByAssignedBusId(Long busId);

	Optional<BusHelper> findByEmail(String email);

}
