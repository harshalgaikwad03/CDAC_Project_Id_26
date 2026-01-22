package com.eduride.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eduride.entity.StudentStatus;

public interface StudentStatusRepository extends JpaRepository<StudentStatus, Long>{

	List<StudentStatus> findByStudentId(Long studentId);

}
