package com.nmbsms.scholarship_management.admindashboard;
import org.springframework.stereotype.Service;
import lombok.*;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.SimpleMailMessage;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    public void sendStatusUpdate(String to, String status){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Result Status Update");
        message.setText("Your result status has been updated to: " + status);
        mailSender.send(message);
    }
    
}
