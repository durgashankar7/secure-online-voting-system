package com.secure.online_voting.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.secure.online_voting.service.VoterService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // React se connect karne ke liye zaroori
public class AuthController {

    @Autowired
    private VoterService voterService;

    // API: OTP Bhejne ke liye
    @PostMapping("/request-otp")
    public ResponseEntity<String> requestOtp(@RequestParam String enrollmentNumber) {
        String response = voterService.initiateLogin(enrollmentNumber);
        if(response.startsWith("Success")) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().body(response);
    }

    // API: OTP Verify karne ke liye
    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestParam String enrollmentNumber, @RequestParam String otp) {
        String response = voterService.verifyOTP(enrollmentNumber, otp);
        if(response.startsWith("Success")) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().body(response);
    }
}