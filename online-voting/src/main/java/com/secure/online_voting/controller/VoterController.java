package com.secure.online_voting.controller;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.secure.online_voting.entity.Voter;
import com.secure.online_voting.repository.VoterRepository;

@RestController
@RequestMapping("/api/voters")
@CrossOrigin(origins = "*")
public class VoterController {

    @Autowired
    private VoterRepository voterRepository;

    // API: Admin CSV file upload karke voters add karega
    @PostMapping("/upload")
    public ResponseEntity<String> uploadVotersCSV(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Error: CSV file khali hai!");
        }

        try (BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            List<Voter> votersToSave = new ArrayList<>();
            int duplicateCount = 0; // NAYA: Kitne duplicate skip hue unki ginti
            boolean isFirstLine = true; // Header (top row) ko ignore karne ke liye

            while ((line = br.readLine()) != null) {
                if (isFirstLine) {
                    isFirstLine = false;
                    continue;
                }

                String[] data = line.split(","); // Comma se alag karna
                
                // Expecting 3 columns: EnrollmentNumber, Name, Email
                if (data.length >= 3) {
                    String enrollment = data[0].trim();
                    String name = data[1].trim();
                    String email = data[2].trim();

                    // SMART CHECK: Agar Email pehle se database me hai, toh isko ignore (skip) kar do
                    if (voterRepository.existsByEmail(email)) {
                        duplicateCount++;
                        continue; 
                    }

                    Voter voter = new Voter();
                    voter.setEnrollmentNumber(enrollment);
                    voter.setName(name);
                    voter.setEmail(email);
                    voter.setVerified(false); // Shuru me un-verified
                    voter.setHasVoted(false); // Shuru me vote nahi diya
                    
                    votersToSave.add(voter);
                }
            }
            
            // Agar koi naya voter mila hai tabhi save karo
            if (!votersToSave.isEmpty()) {
                voterRepository.saveAll(votersToSave);
            }
            
            return ResponseEntity.ok("Success: " + votersToSave.size() + " naye voters add hue. (Skipped " + duplicateCount + " duplicates).");

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: File read nahi ho paayi -> " + e.getMessage());
        }
    }

    // API: Saare voters ki list dekhne ke liye (Admin ke liye)
    @GetMapping
    public List<Voter> getAllVoters() {
        return voterRepository.findAll();
    }
}