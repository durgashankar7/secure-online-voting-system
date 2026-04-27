package com.secure.online_voting.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.secure.online_voting.entity.Admin;

public interface AdminRepository extends JpaRepository<Admin, Integer> {
    // Database me email dhoondhne ke liye custom function
    Optional<Admin> findByEmail(String email);
}