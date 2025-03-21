package com.nmbsms.scholarship_management.signUp;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;
import com.nmbsms.security.JwtService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;


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

    public ResponseEntity<String> initialSignUp(InitialSignUpDTO initialSignUpDTO){
        if(initialSignUpDTO.getEmail()==null || initialSignUpDTO.getToken()==null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Invalid credentials");
        }
        Optional<SignUp> existingStudent=signUpRepository.findByEmailAndToken(initialSignUpDTO.getEmail(), initialSignUpDTO.getToken());
        if(existingStudent.isPresent()){
            SignUp student=existingStudent.get();
            student.setToken(initialSignUpDTO.getToken());
            student.setEmail(initialSignUpDTO.getEmail());
            signUpRepository.save(student);
            return ResponseEntity.ok("Authorization successful");
        }
        throw new EntityNotFoundException("User not found");
    }

    public ResponseEntity<String> setPassword(CreatePasswordDTO createPasswordDTO){
        if(createPasswordDTO.getPassword()==null|| createPasswordDTO.getEmail()==null){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Invalid credentials");
        }
        Optional<SignUp> existingStudent=signUpRepository.findByEmail(createPasswordDTO.getEmail());
        if(existingStudent.isEmpty()){
            throw new EntityNotFoundException("User not found");
        }
        SignUp student=existingStudent.get();
        student.setPassword(passwordEncoder.encode(createPasswordDTO.getPassword()));
        student.setToken(null);
        signUpRepository.save(student);
        return ResponseEntity.ok("Password set successfully");
    }
    
    public ResponseEntity<String> completeSignUp(SignUpDTO signUpDTO){
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
            return ResponseEntity.ok("Profile created successfully");
        } else {
            throw new EntityNotFoundException("User not found");
        }
    }

    LoginDTO loginDTO= new LoginDTO();

    public ResponseEntity<LoginResponseDTO> login(LoginDTO loginDTO){
    if (loginDTO == null || loginDTO.getEmail() == null || loginDTO.getPassword() == null) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Credentials can not be empty");
    }

    String email = loginDTO.getEmail().trim();
    String password = loginDTO.getPassword();
    Optional<SignUp> userOptional = signUpRepository.findByEmail(email);

    if (userOptional.isEmpty()) {
        throw new EntityNotFoundException("User not found");
    }

    SignUp user = userOptional.get();
    boolean passwordMatches = passwordEncoder.matches(password, user.getPassword());

    if (passwordMatches) {
        String token = jwtUtil.generateToken(email);
        LoginResponseDTO loginResponseDTO = new LoginResponseDTO();
        loginResponseDTO.setId(user.getId());
        loginResponseDTO.setEmail(email);
        loginResponseDTO.setToken(token);
        loginResponseDTO.setSex(user.getSex());
        loginResponseDTO.setProfileCompleted(user.isProfileCompleted());
        loginResponseDTO.setRole(user.getRole());
        return ResponseEntity.ok(loginResponseDTO);

    } else {
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Invalid credentials");
    }
}

    public ResponseEntity<String> resetPassword(ResetPasswordDTO resetPasswordDTO){
        Optional<SignUp> user= signUpRepository.findByEmail(resetPasswordDTO.getEmail());
        if(user.isEmpty()){
            throw new EntityNotFoundException("User not found");
        }
        SignUp student=user.get();
        student.setPassword(passwordEncoder.encode(resetPasswordDTO.getNewPassword()));
        signUpRepository.save(student);
        return ResponseEntity.ok("Password reset successfully");
    }
}