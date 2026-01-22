package com.eduride.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eduride.entity.Student;

public interface StudentRepository extends JpaRepository<Student, Long>{

	List<Student> findBySchoolId(Long schoolId);

	List<Student> findByAssignedBusId(Long busId);

	Optional<Student> findByEmail(String email);

}
