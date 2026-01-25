package com.eduride.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eduride.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
}
