package com.secure.online_voting.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.secure.online_voting.entity.Voter;

public interface VoterRepository extends JpaRepository<Voter, Integer> {
    
    // Ye custom function humein OTP login ke time kaam aayega
    Optional<Voter> findByEnrollmentNumber(String enrollmentNumber);

    // NAYI LINE: Check karne ke liye ki email database me pehle se hai ya nahi
    // Isse hamara Bulk CSV Upload duplicates ko skip kar payega!
    boolean existsByEmail(String email);
}