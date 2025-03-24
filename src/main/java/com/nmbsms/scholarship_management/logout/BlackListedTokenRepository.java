package com.nmbsms.scholarship_management.logout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


@Repository
public interface BlackListedTokenRepository extends JpaRepository<BlackListedToken,Long> {

    boolean existsByToken(String token);

    @Modifying
    @Query("DELETE FROM BlackListedToken t WHERE t.expiryDate < :currentTime")
    int deleteExpiredTokens(Long currentTime);
    
}
