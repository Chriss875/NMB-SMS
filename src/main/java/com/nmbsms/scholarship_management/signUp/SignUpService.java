package com.nmbsms.scholarship_management.signUp;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;
import com.nmbsms.security.JwtService;
@Service
public class SignUpService {
    private final SignUpRepository signUpRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtUtil;

    SignUpDTO signUpDTO= new SignUpDTO();

    public SignUpService(SignUpRepository signUpRepository, PasswordEncoder passwordEncoder, JwtService jwtUtil) {
        this.signUpRepository = signUpRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public String initialSignUp(SignUpDTO signUpDTO){
        if(signUpDTO.getEmail().isEmpty() || signUpDTO.getToken().isEmpty()) {
            return "Invalid credentials";
        }
        Optional<SignUp> existingStudent=signUpRepository.findByEmailAndToken(signUpDTO.getEmail(), signUpDTO.getToken());
        if(existingStudent.isPresent()){
            SignUp student=existingStudent.get();
            student.setToken(signUpDTO.getToken());
            student.setEmail(signUpDTO.getEmail());
            signUpRepository.save(student);
            return "Authorization successful";
        }
        return "Invalid credentials";
    }

    public String setPassword(SignUpDTO signUpDTO){
        if(signUpDTO.getPassword().isEmpty()|| signUpDTO.getEmail().isEmpty()){
            return "Invalid credentials";
        }
        Optional<SignUp> existingStudent=signUpRepository.findByEmail(signUpDTO.getEmail());
        if(existingStudent.isEmpty()){
            return "Invalid credentials";
        }
        SignUp student=existingStudent.get();
        student.setPassword(passwordEncoder.encode(signUpDTO.getPassword()));
        student.setToken(null);
        signUpRepository.save(student);
        return "Password set successfully";
    }
    
    public String completeSignUp(SignUpDTO signUpDTO){
        Optional<SignUp> existingUser = signUpRepository.findByEmail(signUpDTO.getEmail());

        if(existingUser.isPresent()){
            SignUp student = existingUser.get();
            student.setEmail(signUpDTO.getEmail());
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
        } else {
            throw new IllegalArgumentException("User not found");
        }
    }

    LoginDTO loginDTO= new LoginDTO();
    public String login(LoginDTO loginDTO){
    if (loginDTO == null || loginDTO.getEmail() == null || loginDTO.getPassword() == null) {
        return "Invalid credentials";
    }
    String email = loginDTO.getEmail().trim();
    String password = loginDTO.getPassword();
    Optional<SignUp> userOptional = signUpRepository.findByEmail(email);
    if (userOptional.isEmpty()) {
        System.out.println("User not found with email: " + email);
        return "Invalid credentials";
    }
    SignUp user = userOptional.get();
    boolean passwordMatches = passwordEncoder.matches(password, user.getPassword());
    System.out.println("Password match result for user " + email + ": " + passwordMatches);
    if (passwordMatches) {
        String token = jwtUtil.generateToken(email);
        System.out.println("Generated token for user: " + email);
        return token;
    } else {
        System.out.println("Password mismatch for user: " + email);
        return "Invalid credentials";
    }
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

    public Optional<SignUp> getUserByEmail(String email) {
        return signUpRepository.findByEmail(email);
    }
}