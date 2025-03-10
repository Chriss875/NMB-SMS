package com.nmbsms.scholarship_management.signUp;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/auth")
public class SignUpController {
    private final SignUpService signupService;

    public SignUpController(SignUpService signupService) {
        this.signupService = signupService;
    }

    @PostMapping("/signup/initial")
    public ResponseEntity<String> initialSignUp(@RequestBody SignUpDTO signUpDTO){
        String result= signupService.initialSignUp(signUpDTO);
        if(result.contains("Initial SignUp successful")){
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }

    @PostMapping("/signup/verify-token")
    public ResponseEntity<String> verifyToken(@RequestParam String email, @RequestParam String token){
        String result= signupService.verifyToken(email,token);
        if(result.contains("Token verified successfully")){
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }

    @PostMapping("/signup/complete")
    public ResponseEntity<String> completeSignUp(@RequestBody SignUpDTO signUpDTO){
        String result= signupService.completeSignUp(signUpDTO);
        if(result.contains("Profile created successfully")){
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestParam String email, @RequestParam String password){
        String result= signupService.login(email,password);
        if(result.contains("Login successful")){
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String email, @RequestParam String newPassword){
        String result= signupService.resetPassword(email,newPassword);
        if(result.contains("Password reset successfully")){
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }

    @GetMapping("/system-dashboard")
    public ResponseEntity<String> systemDashboard(){
        return ResponseEntity.ok("System Dashboard");
    }

}
