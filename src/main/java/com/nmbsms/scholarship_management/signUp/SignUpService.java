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
    InitialSignUpDTO initialSignUpDTO= new InitialSignUpDTO();
    CreatePasswordDTO createPasswordDTO= new CreatePasswordDTO();
    ResetPasswordDTO resetPasswordDTO= new ResetPasswordDTO();

    public SignUpService(SignUpRepository signUpRepository, PasswordEncoder passwordEncoder, JwtService jwtUtil) {
        this.signUpRepository = signUpRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public String initialSignUp(InitialSignUpDTO initialSignUpDTO){
        if(initialSignUpDTO.getEmail().isEmpty() || initialSignUpDTO.getToken().isEmpty()) {
            return "Invalid credentials";
        }
        Optional<SignUp> existingStudent=signUpRepository.findByEmailAndToken(initialSignUpDTO.getEmail(), initialSignUpDTO.getToken());
        if(existingStudent.isPresent()){
            SignUp student=existingStudent.get();
            student.setToken(initialSignUpDTO.getToken());
            student.setEmail(initialSignUpDTO.getEmail());
            signUpRepository.save(student);
            return "Authorization successful";
        }
        return "Invalid credentials";
    }

    public String setPassword(CreatePasswordDTO createPasswordDTO){
        if(createPasswordDTO.getPassword().isEmpty()|| createPasswordDTO.getEmail().isEmpty()){
            return "Invalid credentials";
        }
        Optional<SignUp> existingStudent=signUpRepository.findByEmail(createPasswordDTO.getEmail());
        if(existingStudent.isEmpty()){
            return "Invalid credentials";
        }
        SignUp student=existingStudent.get();
        student.setPassword(passwordEncoder.encode(createPasswordDTO.getPassword()));
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
            student.setProfileCompleted(true);
            student.setRole(UserRoles.STUDENT);
            signUpRepository.save(student);
            return "Profile created successfully";
        } else {
            throw new IllegalArgumentException("User not found");
        }
    }

    LoginDTO loginDTO= new LoginDTO();

    public LoginResponseDTO login(LoginDTO loginDTO){
    if (loginDTO == null || loginDTO.getEmail() == null || loginDTO.getPassword() == null) {
        throw new IllegalArgumentException("Invalid credentials");
    }

    String email = loginDTO.getEmail().trim();
    String password = loginDTO.getPassword();
    Optional<SignUp> userOptional = signUpRepository.findByEmail(email);

    if (userOptional.isEmpty()) {
        throw new IllegalArgumentException("Invalid credentials");
    }

    SignUp user = userOptional.get();
    boolean passwordMatches = passwordEncoder.matches(password, user.getPassword());

    if (passwordMatches) {
        String token = jwtUtil.generateToken(email);
        return new LoginResponseDTO(token, user);
    } else {
        throw new IllegalArgumentException("Invalid credentials");
    }
}

    public String resetPassword(ResetPasswordDTO resetPasswordDTO){
        Optional<SignUp> user= signUpRepository.findByEmail(resetPasswordDTO.getEmail());
        if(user.isEmpty()){
            return "User not found";
        }
        SignUp student=user.get();
        student.setPassword(passwordEncoder.encode(resetPasswordDTO.getNewPassword()));
        signUpRepository.save(student);
        return "Password reset successfully";
    }
    }