package com.secure.online_voting.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.secure.online_voting.entity.Candidate;
import com.secure.online_voting.entity.Vote;
import com.secure.online_voting.entity.Voter;
import com.secure.online_voting.repository.CandidateRepository;
import com.secure.online_voting.repository.VoteRepository;
import com.secure.online_voting.repository.VoterRepository;

import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/api/vote")
@CrossOrigin(origins = "*")
public class VoteController {

    @Autowired
    private VoterRepository voterRepository;

    @Autowired
    private VoteRepository voteRepository;

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate; 

    // API: Vote Cast karne ke liye
    @PostMapping
    @Transactional // ACID properties maintain karne ke liye
    public ResponseEntity<String> castVote(@RequestParam String enrollmentNumber, @RequestParam Integer candidateId) {
        Optional<Voter> voterOpt = voterRepository.findByEnrollmentNumber(enrollmentNumber);
        
        if (voterOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Error: Voter not found");
        }

        Voter voter = voterOpt.get();
        
        // Security Checks
        if (!voter.isVerified()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error: Voter is not verified (Login required)");
        }
        if (voter.isHasVoted()) {
            return ResponseEntity.badRequest().body("Error: You have already cast your vote!");
        }

        // 1. Vote table me anonymous entry save karo (voter_id nahi daalenge)
        Vote vote = new Vote();
        vote.setCandidateId(candidateId);
        voteRepository.save(vote);

        // 2. Voter ko mark karo ki usne vote de diya hai
        voter.setHasVoted(true);
        voterRepository.save(voter);

        // ---------------------------------------------------------
        // 3. CANDIDATE KE KHATE ME +1 VOTE JODNA (Yehi miss tha!)
        // ---------------------------------------------------------
        Candidate candidate = candidateRepository.findById(candidateId).orElse(null);
        if (candidate != null) {
            
            // YAHI HAI WO NAYI LINE: Pehle wale votes me 1 jod do
            candidate.setVotes(candidate.getVotes() + 1);
            candidateRepository.save(candidate);

            // 4. THE MAGIC (WEBSOCKET BROADCAST)
            String message = "UPDATE_" + candidate.getElectionLevel() + "_" + candidate.getElectionType() + "_" + candidate.getRegion();
            messagingTemplate.convertAndSend("/topic/results", message);
            System.out.println("Live Score Broadcasted: " + message);
        }

        return ResponseEntity.ok("Success: Your vote has been securely cast!");
    }
}