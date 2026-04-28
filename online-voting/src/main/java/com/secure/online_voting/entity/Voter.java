package com.secure.online_voting.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "voters")
@Data
public class Voter {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer voterId;

    @Column(unique = true, nullable = false)
    private String enrollmentNumber;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    private String otpCode;
    
    private LocalDateTime otpExpiry;

    @Column(columnDefinition = "boolean default false")
    private boolean isVerified;

    // NAYA: Ab boolean hatakar hum IDs ka collection bana rahe hain
    @jakarta.persistence.ElementCollection
    private java.util.Set<Integer> votedElectionIds = new java.util.HashSet<>();

    public java.util.Set<Integer> getVotedElectionIds() {
        return votedElectionIds;
    }

    public void setVotedElectionIds(java.util.Set<Integer> votedElectionIds) {
        this.votedElectionIds = votedElectionIds;
    }

    // Inko manually likhne se backend 100% name ko frontend tak bhejega

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}