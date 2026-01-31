package com.eduride.repository;

import com.eduride.entity.StudentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface StudentStatusRepository extends JpaRepository<StudentStatus, Long> {

    List<StudentStatus> findByStudentId(Long studentId);

    // Recommended: find today's status efficiently
    Optional<StudentStatus> findByStudentIdAndDate(Long studentId, LocalDate date);
    
    long countByStudent_School_IdAndDate(Long schoolId, LocalDate date);

    long countByStudent_School_IdAndDateAndPickupStatus(Long schoolId, LocalDate date, String pickupStatus);

	long countByStudentSchoolIdAndDateAndPickupStatus(Long schoolId, LocalDate today, String string);

	long countByStudentSchoolIdAndDate(Long schoolId, LocalDate today);

	List<StudentStatus> findByStudentSchoolIdAndDate(Long schoolId, LocalDate date);

	int countByStudent_AssignedBus_IdAndDateAndPickupStatus(Long busId,LocalDate date,String pickupStatus);

	@Query("""
	        SELECT COUNT(ss)
	        FROM StudentStatus ss
	        WHERE ss.student.assignedBus.id = :busId
	          AND ss.date = CURRENT_DATE
	          AND ss.pickupStatus = :status
	    """)
	    int countByBusAndStatus(Long busId, String status);
	
	

}