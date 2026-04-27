package com.secure.online_voting.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.secure.online_voting.entity.Candidate; 

public interface CandidateRepository extends JpaRepository<Candidate, Integer> {
    
    // YE LINE MISSING THI MAALIK! 
    // Ye Spring Data JPA ko batati hai ki in 3 columns ke hisaab se filter karna hai
    List<Candidate> findByElectionLevelAndElectionTypeAndRegionOrderByVotesDesc(String electionLevel, String electionType, String region);

}