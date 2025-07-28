package com.nmbsms.scholarship_management.signUp;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import java.util.HashMap;
import org.springframework.http.HttpHeaders;
import java.util.Map;

@RestController
@RequestMapping(path="/api/auth")
public class SignUpController {
    private final SignUpService signupService;

    public SignUpController(SignUpService signupService) {
        this.signupService = signupService;
    }

    @PostMapping("/signup/initial")
    public ResponseEntity<String> initialSignUp(@RequestBody InitialSignUpDTO initialSignUpDTO){
        return signupService.initialSignUp(initialSignUpDTO);
    }

    @PostMapping("/signup/set-password")
    public ResponseEntity<String> setPassword(@RequestBody CreatePasswordDTO createPasswordDTO){
        return signupService.setPassword(createPasswordDTO);
    }

    @PostMapping("/signup/complete")
    public ResponseEntity<String> completeSignUp(@RequestBody SignUpDTO signUpDTO){
        return signupService.completeSignUp(signUpDTO);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
        LoginResponseDTO responseBody = signupService.login(loginDTO).getBody();

    ResponseCookie jwtCookie = ResponseCookie.from("jwt", responseBody.getToken())
            .httpOnly(true)
            .secure(true)
            .path("/")
            .maxAge(24 * 60 * 60)
            .sameSite("Strict")
            .build();

    Map<String, Object> response = new HashMap<>();
    response.put("message", "Login successful");
    response.put("loginResponseDTO", responseBody);

    return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
            .body(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordDTO resetPasswordDTO){
        return signupService.resetPassword(resetPasswordDTO);
}
}

