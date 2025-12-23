package com.eduride.repository;

import com.eduride.entity.Agency;
import org.springframework.data.jpa.repository.JpaRepository;

 main
import java.util.Optional;

public interface AgencyRepository extends JpaRepository<Agency, Long> {
    Optional<Agency> findByEmail(String email);

public interface AgencyRepository extends JpaRepository<Agency, Long> {
 master
}
