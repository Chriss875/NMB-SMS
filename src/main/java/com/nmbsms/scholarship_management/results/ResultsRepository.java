package com.nmbsms.scholarship_management.results;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;


@Repository
public interface ResultsRepository extends JpaRepository<Results,Long>{
    List<Results> findByEmail(String email);
    Optional<Results> findByFileName(String fileName);

}
