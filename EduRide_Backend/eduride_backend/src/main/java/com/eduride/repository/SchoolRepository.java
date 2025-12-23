package com.eduride.repository;

import com.eduride.entity.School;
import org.springframework.data.jpa.repository.JpaRepository;

 main
import java.util.Optional;

public interface SchoolRepository extends JpaRepository<School, Long> {
    Optional<School> findByEmail(String email);

public interface SchoolRepository extends JpaRepository<School, Long> {
 master
}
