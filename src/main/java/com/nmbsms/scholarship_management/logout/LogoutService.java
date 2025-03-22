package com.nmbsms.scholarship_management.logout;
import org.springframework.stereotype.Service;
import lombok.*;
import java.util.Date;
import com.nmbsms.security.JwtService;

@Service
@RequiredArgsConstructor
public class LogoutService {
    private final BlackListedTokenRepository blackListedTokenRepository;
    private final JwtService jwtService;

    public void logout(String token) {
        Date expirationDate = jwtService.extractExpiration(token);
        long expiryStamp=expirationDate.getTime();

        BlackListedToken blacklistedToken = new BlackListedToken();
        blacklistedToken.setToken(token);
        blacklistedToken.setExpiryDate(expiryStamp);
        blackListedTokenRepository.save(blacklistedToken);
    }

    public boolean isTokenBlacklisted(String token) {
        return blackListedTokenRepository.existsByToken(token);
    }

    
}
