package com.secure.online_voting.service; // ya service package

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.secure.online_voting.entity.Election;
import com.secure.online_voting.repository.ElectionRepository;

@Component
public class ElectionScheduler {

    @Autowired
    private ElectionRepository electionRepository;

    // Har 60 seconds (60000 ms) me ye function apne aap chalega
    @Scheduled(fixedRate = 60000)
    public void autoUpdateElectionStatus() {
        LocalDateTime now = LocalDateTime.now();
        List<Election> allElections = electionRepository.findAll();
        boolean isUpdated = false;

        for (Election election : allElections) {
            // Agar chunav UPCOMING hai aur start date aa gayi hai -> ONGOING kar do
            if ("UPCOMING".equals(election.getStatus()) && election.getStartDate() != null && now.isAfter(election.getStartDate())) {
                election.setStatus("ONGOING");
                electionRepository.save(election);
                isUpdated = true;
                System.out.println("Status Updated: " + election.getElectionTitle() + " is now ONGOING!");
            }
            // Agar chunav ONGOING hai aur end date nikal gayi hai -> COMPLETED kar do
            else if ("ONGOING".equals(election.getStatus()) && election.getEndDate() != null && now.isAfter(election.getEndDate())) {
                election.setStatus("COMPLETED");
                electionRepository.save(election);
                isUpdated = true;
                System.out.println("Status Updated: " + election.getElectionTitle() + " is now COMPLETED!");
            }
        }
        
        if (isUpdated) {
            System.out.println("Election statuses checked and automatically updated by System.");
        }
    }
}