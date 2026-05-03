package com.secure.online_voting.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.secure.online_voting.entity.Candidate;
import com.secure.online_voting.repository.CandidateRepository;
import com.secure.online_voting.repository.VoteRepository;
import com.secure.online_voting.service.PdfService;

@RestController
@RequestMapping("/api/results")
@CrossOrigin(origins = "*")
public class ResultController {

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private VoteRepository voteRepository;

    @Autowired
private PdfService pdfService;

@GetMapping("/download")
    public ResponseEntity<byte[]> downloadPdf(
            @RequestParam Integer electionId, 
            @RequestParam String title) {
        
        List<Candidate> candidates = candidateRepository.findByElectionId(electionId);
        
        List<Map<String, Object>> results = new ArrayList<>();
        for (Candidate candidate : candidates) {
            Map<String, Object> map = new HashMap<>();
            map.put("name", candidate.getName());
            map.put("department", candidate.getDepartment());
            map.put("votes", candidate.getVotes()); 
            results.add(map);
        }
        
        // Sabse zyada vote wale ko list me upar (Top) rakhne ke liye sort
        results.sort((a, b) -> Integer.compare((Integer) b.get("votes"), (Integer) a.get("votes")));

        byte[] pdfContent = pdfService.generateResultPdf(title, results);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + title.replaceAll(" ", "_") + "_Results.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfContent);
    }
    
    // API: Live results lane ke liye (Ab filtering ke sath)
    @GetMapping
    public List<Map<String, Object>> getLiveResults(
            @RequestParam(required = false) String level,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String region) {
        
        List<Candidate> candidates;

        // Agar specific chunav ki request aayi hai toh filter karo
        if (level != null && type != null && region != null) {
            candidates = candidateRepository.findByElectionLevelAndElectionTypeAndRegionOrderByVotesDesc(level, type, region);
        } else {
            // Warna saare dikha do (Admin overview ke liye)
            candidates = candidateRepository.findAll();
        }

        List<Map<String, Object>> results = new ArrayList<>();

        for (Candidate candidate : candidates) {
            long totalVotes = voteRepository.countByCandidateId(candidate.getCandidateId());
            
            Map<String, Object> map = new HashMap<>();
            map.put("id", candidate.getCandidateId());
            map.put("name", candidate.getName());
            map.put("department", candidate.getDepartment());
            map.put("votes", totalVotes);
            results.add(map);
        }
        
        return results;
    }
}