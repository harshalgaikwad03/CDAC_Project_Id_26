package com.eduride.repository;

import com.eduride.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByEmail(String email);

    List<Student> findBySchoolId(Long schoolId);

    List<Student> findByAssignedBusId(Long busId);

    long countBySchoolId(Long schoolId);
}
