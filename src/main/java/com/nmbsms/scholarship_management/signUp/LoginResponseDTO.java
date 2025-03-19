package com.nmbsms.scholarship_management.signUp;

public class LoginResponseDTO {
    private SignUp user;
    private String token;

    public LoginResponseDTO(String token, SignUp user) {
        this.token = token;
        this.user = user;
    }

    public SignUp getUser() { return user; }
    public void setUser(SignUp user) { this.user = user; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}

