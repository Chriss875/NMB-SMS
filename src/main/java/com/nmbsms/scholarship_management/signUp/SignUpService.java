package com.nmbsms.scholarship_management.signUp;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;
import com.nmbsms.security.JwtService;
import java.util.HashMap;
import java.util.Map;

@Service
public class SignUpService {
    private final SignUpRepository signUpRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtUtil;
    private Map<String, String> tempPasswords= new HashMap<>();

    SignUpDTO signUpDTO= new SignUpDTO();

    public SignUpService(SignUpRepository signUpRepository, PasswordEncoder passwordEncoder, JwtService jwtUtil) {
        this.signUpRepository = signUpRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public String initialSignUp(SignUpDTO signUpDTO){
    Optional<SignUp> existingStudent = signUpRepository.findByEmail(signUpDTO.getEmail());
    if (existingStudent.isEmpty()) {
        return "Email not found. Contact admin for assistance.";
    }
    if (!signUpDTO.getPassword().equals(signUpDTO.getConfirmPassword())) {
        return "Passwords do not match";
    }
    String encodedPassword= passwordEncoder.encode(signUpDTO.getPassword());
    tempPasswords.put(signUpDTO.getEmail(),encodedPassword);
    return "Proceed to token verification";
    }
    
    public String verifyToken(String email, String token){
    Optional<SignUp> studentOpt = signUpRepository.findByEmailAndToken(email, token);
    if (studentOpt.isEmpty()) {
        return "Invalid token";
    }
    String encodedPassword= tempPasswords.get(email);
    SignUp student = studentOpt.get();
    student.setPassword(encodedPassword);
    student.setToken(null);
    signUpRepository.save(student);
    tempPasswords.remove(email);
    return "Token verified successfully";
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
    }
