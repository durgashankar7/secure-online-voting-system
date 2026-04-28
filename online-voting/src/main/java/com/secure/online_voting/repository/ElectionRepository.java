package com.secure.online_voting.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.secure.online_voting.entity.Election;

public interface ElectionRepository extends JpaRepository<Election, Integer> {
    List<Election> findByStatus(String status);

}