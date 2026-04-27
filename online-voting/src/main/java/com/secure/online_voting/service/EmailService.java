package com.secure.online_voting.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // -----------------------------------------------------------
    // 1. VOTER LOGIN WALA FUNCTION (Aapka purana code ekdam safe hai)
    // -----------------------------------------------------------
    public void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("College Election - Your Secure OTP Code");
        message.setText("Namaste!\n\nYour secure OTP for the Online Election voting system is: " + otp + 
                        "\n\nThis OTP is valid for 5 minutes. Do not share it with anyone.");
        
        mailSender.send(message);
    }

    // -----------------------------------------------------------
    // 2. NAYA FUNCTION: ADMIN (Aur dusri custom emails) ke liye
    // -----------------------------------------------------------
    public void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        
        mailSender.send(message);
        System.out.println("Real Email Sent Successfully to: " + to);
    }
}