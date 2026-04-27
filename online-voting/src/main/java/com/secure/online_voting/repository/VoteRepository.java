package com.secure.online_voting.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.secure.online_voting.entity.Vote;

public interface VoteRepository extends JpaRepository<Vote, Integer> {
    // Ek specific candidate ko kitne votes mile, ye count karne ke liye
    long countByCandidateId(Integer candidateId);
}