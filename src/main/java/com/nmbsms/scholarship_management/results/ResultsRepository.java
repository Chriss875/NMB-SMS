package com.nmbsms.scholarship_management.results;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;


@Repository
public interface ResultsRepository extends JpaRepository<Results,Long>{
    List<Results> findByEmail(String email);
    Optional<Results> findByFileName(String fileName);
    Optional<Results> findByResultId(long resultId);

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

    @Query("SELECT new com.nmbsms.scholarship_management.results.AdminResultsDTO(r.resultId,s.name,s.universityName,s.phoneNumber,s.batchNo,r.status,r.filePath) FROM Results r LEFT JOIN com.nmbsms.scholarship_management.signUp.SignUp s "+
        "ON r.student=s.name WHERE (:status IS NOT NULL AND (:status IS NULL or r.status= :status)) "+
        "AND s.batchNo = :batchNo ")
    List<AdminResultsDTO> getResultsForBatch(@Param("status") String status,@Param("batchNo") Integer batchNo);

   @Query("SELECT new com.nmbsms.scholarship_management.results.AdminResultsDTO(r.resultId,s.name,s.universityName,s.phoneNumber,s.batchNo,r.status,r.filePath) FROM Results r LEFT JOIN com.nmbsms.scholarship_management.signUp.SignUp s "+
        "ON r.student=s.name WHERE r.status='REJECTED' "+
        "AND r.student NOT IN (SELECT r2.student FROM Results r2 WHERE r2.status IN('SUBMITTED','APPROVED')) "+
        "GROUP BY r.student")
   List<AdminResultsDTO> getRejectedStudents();
}