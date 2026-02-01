package com.eduride.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.eduride.dto.SchoolSummaryDTO;
import com.eduride.entity.School;

public interface SchoolRepository extends JpaRepository<School, Long> {

    List<School> findByAgencyId(Long agencyId);

    Optional<School> findByEmail(String email);

	long countByAgencyId(Long agencyId);
	
	@Query("""
	        SELECT new com.eduride.dto.SchoolSummaryDTO(
	            s.id,
	            s.name,
	            COUNT(DISTINCT st.id),
	            COUNT(DISTINCT b.id)
	        )
	        FROM School s
	        LEFT JOIN Student st ON st.school = s
	        LEFT JOIN Bus b ON b.school = s
	        WHERE s.agency.id = :agencyId
	        GROUP BY s.id, s.name
	    """)
	    List<SchoolSummaryDTO> findSchoolsByAgencyWithCounts(
	        @Param("agencyId") Long agencyId
	    );
    
}
