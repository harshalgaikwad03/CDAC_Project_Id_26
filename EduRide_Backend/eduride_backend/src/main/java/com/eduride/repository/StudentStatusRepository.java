package com.eduride.repository;

import com.eduride.entity.StudentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

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
	

}