package com.nmbsms.scholarship_management.settings;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import lombok.RequiredArgsConstructor;
import com.nmbsms.scholarship_management.signUp.SignUpRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import jakarta.persistence.EntityNotFoundException;
import com.nmbsms.scholarship_management.signUp.SignUp;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SecurityService {
    private final SignUpRepository signUpRepository;
    private final PasswordEncoder passwordEncoder;

    public void changePassword(String email, SecurityDTO securityDTO) {
        Optional<SignUp> student=signUpRepository.findByEmail(email);
        if(student.isEmpty()){
            throw new EntityNotFoundException("User not found");
        }
        SignUp user=student.get();
        if(!passwordEncoder.matches(securityDTO.getCurrentPassword(), user.getPassword())){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Invalid credentials");
        }
        user.setPassword(passwordEncoder.encode(securityDTO.getNewPassword()));
        signUpRepository.save(user);
    }
}
