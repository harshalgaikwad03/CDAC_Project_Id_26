package com.eduride.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eduride.entity.Feedback;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    List<Feedback> findByBusId(Long busId);

    List<Feedback> findByDriverId(Long driverId);

	List<Feedback> findByBusHelper_Id(Long helperId);

}
