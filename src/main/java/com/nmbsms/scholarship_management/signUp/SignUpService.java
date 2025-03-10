package com.nmbsms.scholarship_management.signUp;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;
import com.nmbsms.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class SignUpService {
    private final SignUpRepository signUpRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtUtil;

    @Autowired
    private Integer minPasswordLength;

    SignUpDTO signUpDTO= new SignUpDTO();

    public SignUpService(SignUpRepository signUpRepository, PasswordEncoder passwordEncoder, JwtService jwtUtil) {
        this.signUpRepository = signUpRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public String initialSignUp(SignUpDTO signUpDTO){
        if(signUpDTO.getPassword().length()<minPasswordLength){
            return "Password must be at least " + minPasswordLength + " characters long";
        }

        if(!signUpDTO.getPassword().equals(signUpDTO.getConfirmPassword())){
            return "Passwords do not match";
        }
        if (signUpRepository.findByEmail(signUpDTO.getEmail()).isPresent()){
            return "Email already exists";
        }
        SignUp signUp = new SignUp();
        signUp.setEmail(signUpDTO.getEmail());
        signUp.setPassword(passwordEncoder.encode(signUpDTO.getPassword()));
        signUpRepository.save(signUp);
        return "Initial SignUp successful";
    }
    
    public String verifyToken(String email, String token){
        Optional<SignUp> verification= signUpRepository.findByEmailAndToken(email,token);
        if(verification.isPresent()){
            return"Token verified successfully";
        }
        return "Invalid token";
    }

    public String completeSignUp(SignUpDTO signUpDTO){
        SignUp student=signUpRepository.findByEmail(signUpDTO.getEmail()).orElseThrow(()->new RuntimeException("User not found"));

        student.setToken(null);
        student.setName(signUpDTO.getName());
        student.setSex(signUpDTO.getSex());
        student.setPhoneNumber(signUpDTO.getPhoneNumber());
        student.setUniversityName(signUpDTO.getUniversityName());
        student.setUniversityRegistrationId(signUpDTO.getUniversityRegistrationId());
        student.setCourseProgrammeName(signUpDTO.getCourseProgrammeName());
        student.setEnrolledYear(signUpDTO.getEnrolledYear());
        student.setBatchNo(signUpDTO.getBatchNo());
        signUpRepository.save(student);
        return "Profile created successfully";
    }

    public String login(String email,String password){
        Optional<SignUp> user=signUpRepository.findByEmail(email);
        if(user.isEmpty()){
            return "Invalid credentials";
        }
        if(passwordEncoder.matches(password, user.get().getPassword())){
            String token = jwtUtil.generateToken(email);
            return "Login successful: " + token;
        }
        return "Invalid credentials";
    }

    public String resetPassword(String email, String newPassword){
        Optional<SignUp> user= signUpRepository.findByEmail(email);
        if(user.isEmpty()){
            return "User not found";
        }
        SignUp student=user.get();
        student.setPassword(passwordEncoder.encode(newPassword));
        signUpRepository.save(student);
        return "Password reset successfully";
    }
    }

