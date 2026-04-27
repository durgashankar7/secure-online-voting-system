package com.secure.online_voting.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.secure.online_voting.entity.Election;
import com.secure.online_voting.repository.ElectionRepository;

@RestController
@RequestMapping("/api/elections")
@CrossOrigin(origins = "*")
public class ElectionController {

    @Autowired
    private ElectionRepository electionRepository;

    // API: Saare elections laane ke liye
    @GetMapping
    public List<Election> getAllElections() {
        return electionRepository.findAll();
    }

    // ... purana GET API ...

    // NAYA API: Admin dwara naya election create karne ke liye
    @PostMapping
    public org.springframework.http.ResponseEntity<String> createElection(@RequestBody Election election) {
        // Shuruwat me status hamesha UPCOMING rahega
        election.setStatus("UPCOMING");
        electionRepository.save(election);
        return org.springframework.http.ResponseEntity.ok("Success: Naya election system me register ho gaya hai!");
    }
    
    // NAYA API: Election delete karne ke liye
    @DeleteMapping("/{id}")
    public org.springframework.http.ResponseEntity<String> deleteElection(@PathVariable Integer id) {
        electionRepository.deleteById(id);
        return org.springframework.http.ResponseEntity.ok("Deleted successfully.");
    }
}