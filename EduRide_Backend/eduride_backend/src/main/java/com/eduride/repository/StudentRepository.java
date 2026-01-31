package com.eduride.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.eduride.entity.Student;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByEmail(String email);

    List<Student> findBySchoolId(Long schoolId);

    List<Student> findByAssignedBusId(Long busId);

    long countBySchoolId(Long schoolId);

    long countByAssignedBusId(Long busId);

    long countByAssignedBusIdAndPassStatus(Long busId, String passStatus);

	List<Student> findByAssignedBusBusHelpersEmail(String email);

	boolean existsByEmail(@Email @NotBlank String email);
	
	
	@Query("""
		    SELECT COUNT(s)
		    FROM Student s
		    WHERE s.school.agency.id = :agencyId
		""")
		long countByAgencyId(Long agencyId);

}
