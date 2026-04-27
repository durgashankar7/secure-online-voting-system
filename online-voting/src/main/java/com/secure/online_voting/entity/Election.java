package com.secure.online_voting.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "elections")
public class Election {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "election_id")
    private Integer electionId;

    @Column(name = "election_title")
    private String electionTitle;

    @Column(name = "election_level")
    private String electionLevel;

    @Column(name = "election_type")
    private String electionType;

    private String region;

    @Column(name = "university_name")
    private String universityName;

    private String batch;

    private String status;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    // MAALIK DHYAAN DEIN: Yahan par Right Click karke "Source Action -> Generate Getters and Setters" 
    // zaroor kar lijiyega taaki Spring Boot is data ko read/write kar sake.

    public Integer getElectionId() {
        return electionId;
    }

    public void setElectionId(Integer electionId) {
        this.electionId = electionId;
    }

    public String getElectionTitle() {
        return electionTitle;
    }

    public void setElectionTitle(String electionTitle) {
        this.electionTitle = electionTitle;
    }

    public String getElectionLevel() {
        return electionLevel;
    }

    public void setElectionLevel(String electionLevel) {
        this.electionLevel = electionLevel;
    }

    public String getElectionType() {
        return electionType;
    }

    public void setElectionType(String electionType) {
        this.electionType = electionType;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getUniversityName() {
        return universityName;
    }

    public void setUniversityName(String universityName) {
        this.universityName = universityName;
    }

    public String getBatch() {
        return batch;
    }

    public void setBatch(String batch) {
        this.batch = batch;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }
}