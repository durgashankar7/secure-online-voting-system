package com.secure.online_voting.controller;

import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping; // NAYA IMPORT: Thread safety ke liye
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.secure.online_voting.entity.Admin;
import com.secure.online_voting.repository.AdminRepository;
import com.secure.online_voting.service.EmailService;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private EmailService emailService;

    @Autowired
    private AdminRepository adminRepository;

    // YAHAN FIX KIYA HAI: 'final' lagaya aur 'ConcurrentHashMap' use kiya
    private final Map<String, String> otpStorage = new ConcurrentHashMap<>();

    @PostMapping("/send-otp")
    public String sendAdminOtp(@RequestParam String email) {
        
        Optional<Admin> adminOpt = adminRepository.findByEmail(email);
        
        if (adminOpt.isEmpty()) {
            return "ERROR: You are not an authorized Admin! Access Denied.";
        }

        String otp = String.valueOf(new Random().nextInt(899999) + 100000);
        otpStorage.put(email, otp);
        
        emailService.sendEmail(email, "Admin Access OTP", "Hello " + adminOpt.get().getName() + ",\nYour secure Admin Login OTP is: " + otp);
        
        System.out.println("OTP for " + email + " is: " + otp);
        
        return "SUCCESS: OTP sent to your admin email.";
    }

    @PostMapping("/verify-otp")
    public boolean verifyAdminOtp(@RequestParam String email, @RequestParam String otp) {
        return otp.equals(otpStorage.get(email));
    }
}