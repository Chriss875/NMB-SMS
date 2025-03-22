package com.nmbsms.scholarship_management.logout;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Service
@RequiredArgsConstructor
public class TokenCleanUpService {
    private final BlackListedTokenRepository blackListedTokenRepository;
    private static final Logger log = LoggerFactory.getLogger(TokenCleanUpService.class);


    @Scheduled(fixedRate = 1000 * 60 * 60)
    @Transactional
    public void cleanupExpiredTokens() {
        try {
            long currentTime = System.currentTimeMillis();
            int deletedCount = blackListedTokenRepository.deleteExpiredTokens(currentTime);

            if (deletedCount > 0) {
                log.info("Cleaned up {} expired blacklisted tokens.", deletedCount);
            } else {
                log.debug("No expired blacklisted tokens to clean up.");
            }
        } catch (Exception e) {
            log.error("Error during token cleanup: {}", e.getMessage(), e);
        }
    }
}
