package com.nmbsms.scholarship_management.results;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;


@Repository
public interface ResultsRepository extends JpaRepository<Results,Long>{
    Optional<Results> findByFileName(String fileName);
}
