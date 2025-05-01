package com.nmbsms.scholarship_management.results;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;


@Repository
public interface ResultsRepository extends JpaRepository<Results,Long>{
    List<Results> findByEmail(String email);
    Optional<Results> findByFileName(String fileName);
    Optional<Results> findById(long id);

    @Query("SELECT COUNT(r) FROM Results r WHERE r.status='SUBMITTED'")
    Integer countTotalStudents();

    @Query("SELECT COUNT(r) FROM Results r JOIN com.nmbsms.scholarship_management.signUp.SignUp s " +
        "ON r.student = s.name WHERE s.role = com.nmbsms.scholarship_management.signUp.UserRoles.STUDENT " +
        "AND s.batchNo = 1 AND r.status = 'SUBMITTED'")
    Integer countSubmittedBatch1();

    @Query("SELECT COUNT(r) FROM Results r JOIN com.nmbsms.scholarship_management.signUp.SignUp s " +
        "ON r.student = s.name WHERE s.role = com.nmbsms.scholarship_management.signUp.UserRoles.STUDENT "+
        "AND s.batchNo = 2 AND r.status = 'SUBMITTED'")
    Integer countSubmittedBatch2();
}