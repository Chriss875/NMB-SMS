package com.nmbsms.scholarship_management.logout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface BlackListedTokenRepository extends JpaRepository<BlackListedToken, String> {

    boolean existsByToken(String token);
    
}
