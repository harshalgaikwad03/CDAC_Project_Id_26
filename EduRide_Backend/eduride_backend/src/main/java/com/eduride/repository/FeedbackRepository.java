package com.eduride.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eduride.entity.Feedback;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

	List<Feedback> findByDriver_Id(Long driverId);

	List<Feedback> findByBusHelper_Id(Long helperId);

	List<Feedback> findByStudent_Id(Long studentId);

	List<Feedback> findBySchool_Id(Long schoolId);

	List<Feedback> findByAgency_Id(Long agencyId);



	List<Feedback> findByDriverId(Long driverId);


}
