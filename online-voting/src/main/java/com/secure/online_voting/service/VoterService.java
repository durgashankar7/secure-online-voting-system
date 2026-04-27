package com.secure.online_voting.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.secure.online_voting.entity.Voter;
import com.secure.online_voting.repository.VoterRepository;

@Service
public class VoterService {

    @Autowired
    private VoterRepository voterRepository;

    @Autowired
    private EmailService emailService;

    // 6-digit random OTP generate karne ka function
    private String generateOTP() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    // Step 1: User jab apna enrollment number dalega
    public String initiateLogin(String enrollmentNumber) {
        Optional<Voter> voterOpt = voterRepository.findByEnrollmentNumber(enrollmentNumber);
        
        if (voterOpt.isPresent()) {
            Voter voter = voterOpt.get();
            String otp = generateOTP();
            
            // Database me OTP aur 5 minute aage ki expiry time save karna
            voter.setOtpCode(otp);
            voter.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
            voterRepository.save(voter);

            // OTP ko email par bhejna
            emailService.sendOtpEmail(voter.getEmail(), otp);
            return "Success: OTP sent to registered email.";
        }
        return "Error: Enrollment number not found in the whitelist.";
    }

    // Step 2: User jab OTP enter karega
    public String verifyOTP(String enrollmentNumber, String enteredOtp) {
        Optional<Voter> voterOpt = voterRepository.findByEnrollmentNumber(enrollmentNumber);
        
        if (voterOpt.isPresent()) {
            Voter voter = voterOpt.get();
            
            // Check expiry
            if (voter.getOtpExpiry() == null || voter.getOtpExpiry().isBefore(LocalDateTime.now())) {
                return "Error: OTP has expired. Please request a new one.";
            }
            
            // Check OTP match
            if (enteredOtp.equals(voter.getOtpCode())) {
                voter.setVerified(true);
                // Security: OTP verify hone ke baad use database se mita dena chahiye
                voter.setOtpCode(null);
                voter.setOtpExpiry(null);
                voterRepository.save(voter);
                return "Success: Login successful!";
            } else {
                return "Error: Invalid OTP.";
            }
        }
        return "Error: Voter not found.";
    }
}