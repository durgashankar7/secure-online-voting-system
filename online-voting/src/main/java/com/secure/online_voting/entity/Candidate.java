package com.secure.online_voting.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "candidates")
@Data
public class Candidate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer candidateId;

    @Column(name = "election_level")
    private String electionLevel;

    @Column(name = "election_type")
    private String electionType;

    private String region;

    @Column(name = "university_name")
    private String universityName;

    private String batch;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String department;

    @Column(columnDefinition = "TEXT")
    private String manifesto;

    // --------------------------------------------------------
    // NAYA CODE: Votes ko track karne ke liye
    // --------------------------------------------------------
    @Column(name = "votes", columnDefinition = "integer default 0")
    private int votes = 0;

    // Maven ko koi takleef na ho isliye explicitly Getter/Setter daal diye hain
    public int getVotes() {
        return votes;
    }

    public void setVotes(int votes) {
        this.votes = votes;
    }
    // --------------------------------------------------------
    private Integer electionId;

    public Integer getElectionId() {
        return electionId;
    }

    public void setElectionId(Integer electionId) {
        this.electionId = electionId;
    }
}