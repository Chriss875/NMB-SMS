package com.nmbsms.scholarship_management.payment;
import org.springframework.stereotype.Service;
import com.nmbsms.security.JwtService;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.Optional;
import com.nmbsms.scholarship_management.signUp.SignUp;
import com.nmbsms.scholarship_management.signUp.SignUpRepository;
import com.nmbsms.security.JwtService;


@Service
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final SignUpRepository signUpRepository;
    private final JwtService jwtService;

    public PaymentService(PaymentRepository paymentRepository, SignUpRepository signUpRepository,JwtService jwtService){
        this.paymentRepository= paymentRepository;
        this.jwtService= jwtService;
        this.signUpRepository= signUpRepository;
    }

    PaymentDTO paymentDTO= new PaymentDTO();

    public Payment submitPayment(PaymentDTO paymentDTO){
        String email= SecurityContextHolder.getContext().getAuthentication().getName();
        
        Long StudentId= fetchStudentIdByEmail(email);

        Optional<Payment> existingPayment = paymentRepository.findByStudentId(studentId);
        Payment payment;

    }

    
}
