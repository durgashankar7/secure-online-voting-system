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

    @Column(columnDefinition = "boolean default false")
    private boolean hasVoted;
}