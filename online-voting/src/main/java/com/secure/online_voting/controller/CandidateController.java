package com.secure.online_voting.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.secure.online_voting.entity.Candidate;
import com.secure.online_voting.repository.CandidateRepository;

@RestController
@RequestMapping("/api/candidates")
@CrossOrigin(origins = "*")
public class CandidateController {

    @Autowired
    private CandidateRepository candidateRepository;

    // 1. API: Saare candidates ki list dekhne ke liye (Voters aur Admin dono ke liye)
    @GetMapping
    public List<Candidate> getCandidates(
            @RequestParam(required = false) String level,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String region,
            @RequestParam(required = false) String university,
            @RequestParam(required = false) String batch) {
        
        // Agar Voter page se request aayi hai
        if (level != null && type != null && region != null) {
            List<Candidate> filteredCandidates = candidateRepository.findByElectionLevelAndElectionTypeAndRegionOrderByVotesDesc(level, type, region);
            
            // Agar College level hai toh University aur Batch se bhi filter karenge
            if (university != null && !university.isEmpty()) {
                filteredCandidates = filteredCandidates.stream()
                        .filter(c -> university.equalsIgnoreCase(c.getUniversityName()))
                        .toList();
            }
            if (batch != null && !batch.isEmpty()) {
                filteredCandidates = filteredCandidates.stream()
                        .filter(c -> batch.equalsIgnoreCase(c.getBatch()))
                        .toList();
            }
            return filteredCandidates;
        }
        
        // Agar Admin page se request aayi hai (kuch nahi bheja)
        return candidateRepository.findAll();
    }

    // 2. API: Naya Candidate Add karne ke liye (Sirf Admin ke liye)
    @PostMapping
    public ResponseEntity<String> addCandidate(@RequestBody Candidate candidate) {
        candidateRepository.save(candidate);
        return ResponseEntity.ok("Success: Naya candidate database me add ho gaya!");
    }

    // 3. API: Kisi Candidate ko hatane ke liye (Sirf Admin ke liye)
    @DeleteMapping("/{id}")
    public ResponseEntity<String> removeCandidate(@PathVariable Integer id) {
        if(candidateRepository.existsById(id)) {
            candidateRepository.deleteById(id);
            return ResponseEntity.ok("Success: Candidate ko database se hata diya gaya!");
        }
        return ResponseEntity.badRequest().body("Error: Candidate nahi mila!");
    }

    @GetMapping("/election/{electionId}")
    public ResponseEntity<List<Candidate>> getCandidatesByElectionId(@PathVariable Integer electionId) {
        return ResponseEntity.ok(candidateRepository.findByElectionId(electionId));
    }
}