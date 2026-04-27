package com.secure.online_voting.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.secure.online_voting.entity.Election;

public interface ElectionRepository extends JpaRepository<Election, Integer> {

}