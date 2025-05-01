package com.nmbsms.scholarship_management.signUp;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import org.springframework.data.repository.query.Param;


@Repository
public interface SignUpRepository extends JpaRepository<SignUp, Long> {
    Optional<SignUp> findByEmail(String email);
    Optional<SignUp> findByEmailAndToken(String email, String token);

    @Query("SELECT COUNT(s) FROM SignUp s WHERE s.role = com.nmbsms.scholarship_management.signUp.UserRoles.STUDENT")
    Integer countTotalStudents();

    @Query("SELECT COUNT(s) FROM SignUp s WHERE s.role = com.nmbsms.scholarship_management.signUp.UserRoles.STUDENT AND s.batchNo = 1")
    Integer countBatch1();

    @Query("SELECT COUNT(s) FROM SignUp s WHERE s.role = com.nmbsms.scholarship_management.signUp.UserRoles.STUDENT AND s.batchNo = 2")
    Integer countBatch2();

    @Query("SELECT COUNT(s) FROM SignUp s LEFT JOIN com.nmbsms.scholarship_management.results.Results r "+
            "ON s.name = r.student WHERE s.role = com.nmbsms.scholarship_management.signUp.UserRoles.STUDENT "+
            " AND (s.batchNo = 1 OR s.batchNo = 2) AND r.id IS NULL")
    Integer countNotSubmittedTotal();

    @Query("SELECT COUNT(s) FROM SignUp s LEFT JOIN com.nmbsms.scholarship_management.results.Results r "+
        "ON s.name = r.student WHERE s.role = com.nmbsms.scholarship_management.signUp.UserRoles.STUDENT "+
        "AND s.batchNo = 1 AND r.id IS NULL")
    Integer countNotSubmittedBatch1();

    @Query("SELECT COUNT(s) FROM SignUp s LEFT JOIN com.nmbsms.scholarship_management.results.Results r "+
        "ON s.name = r.student WHERE s.role = com.nmbsms.scholarship_management.signUp.UserRoles.STUDENT "+
        "AND s.batchNo = 2 AND r.id IS NULL")
    Integer countNotSubmittedBatch2();

    @Query("SELECT new com.nmbsms.scholarship_management.signUp.NotSubmittedDTO(s.name,s.email,s.phoneNumber,s.universityName,s.batchNo) FROM SignUp s LEFT JOIN com.nmbsms.scholarship_management.results.Results r "+
        "ON s.name = r.student WHERE s.role = com.nmbsms.scholarship_management.signUp.UserRoles.STUDENT "+
        "AND (s.batchNo = 1 OR s.batchNo = 2) AND r.id IS NULL "+
        "ORDER BY s.batchNo ASC")
    List<NotSubmittedDTO> findNotSubmitted();

    @Query("SELECT new com.nmbsms.scholarship_management.signUp.StudentResultDTO(s.name, r.filePath, r.status) " +
        "FROM SignUp s, com.nmbsms.scholarship_management.results.Results r " +
        "WHERE s.email = r.email AND s.role = com.nmbsms.scholarship_management.signUp.UserRoles.STUDENT " +
        "AND (:batchNo IS NULL OR s.batchNo = :batchNo) " +
        "AND (:status IS NULL OR r.status = :status) " +
        "ORDER BY s.batchNo ASC")
    List<StudentResultDTO> findStudentsWithResults(@Param("batchNo") Integer batchNo, @Param("status") String status);

    @Query("SELECT COUNT(s) FROM SignUp s WHERE s.feeControlNumber IS NOT NULL AND s.role=com.nmbsms.scholarship_management.signUp.UserRoles.STUDENT")
    Integer countTotalWithFeeControlNumber();

    @Query("SELECT COUNT(s) FROM SignUp s WHERE s.nhifControlNumber IS NOT NULL AND s.role=com.nmbsms.scholarship_management.signUp.UserRoles.STUDENT")
    Integer countTotalWithNhifControlNumber();

    @Query("SELECT COUNT(s) FROM SignUp s WHERE s.feeControlNumber IS NOT NULL AND s.role=com.nmbsms.scholarship_management.signUp.UserRoles.STUDENT AND batchNo=1")
    Integer countTotalWithFeeControlNumberBatch1();

    @Query("SELECT COUNT(s) FROM SignUp s WHERE s.feeControlNumber IS NOT NULL AND s.role=com.nmbsms.scholarship_management.signUp.UserRoles.STUDENT AND batchNo=2")
    Integer countTotalWithFeeControlNumberBatch2();

    @Query("SELECT COUNT(s) FROM SignUp s WHERE s.nhifControlNumber IS NOT NULL AND s.role=com.nmbsms.scholarship_management.signUp.UserRoles.STUDENT AND batchNo=1")
    Integer countTotalWithNhifControlNumberBatch1();

    @Query("SELECT COUNT(s) FROM SignUp s WHERE s.nhifControlNumber IS NOT NULL AND s.role=com.nmbsms.scholarship_management.signUp.UserRoles.STUDENT AND batchNo=2")
    Integer countTotalWithNhifControlNumberBatch2();

    @Query("SELECT COUNT(s) FROM SignUp s WHERE s.feeControlNumber IS NULL AND s.role=com.nmbsms.scholarship_management.signUp.UserRoles.STUDENT")
    Integer countTotalNotWithFeeControlNumber();

    @Query("SELECT COUNT(s) FROM SignUp s WHERE s.nhifControlNumber IS  NULL AND s.role=com.nmbsms.scholarship_management.signUp.UserRoles.STUDENT")
    Integer countTotalNotWithNhifControlNumber();

    @Query("SELECT COUNT(s) FROM SignUp s WHERE s.feeControlNumber IS  NULL AND s.role=com.nmbsms.scholarship_management.signUp.UserRoles.STUDENT AND batchNo=1")
    Integer countTotalNotWithFeeControlNumberBatch1();

    @Query("SELECT COUNT(s) FROM SignUp s WHERE s.feeControlNumber IS  NULL AND s.role=com.nmbsms.scholarship_management.signUp.UserRoles.STUDENT AND batchNo=2")
    Integer countTotalNotWithFeeControlNumberBatch2();

    @Query("SELECT COUNT(s) FROM SignUp s WHERE s.nhifControlNumber IS  NULL AND s.role=com.nmbsms.scholarship_management.signUp.UserRoles.STUDENT AND batchNo=1")
    Integer countTotalNotWithNhifControlNumberBatch1();

    @Query("SELECT COUNT(s) FROM SignUp s WHERE s.nhifControlNumber IS  NULL AND s.role=com.nmbsms.scholarship_management.signUp.UserRoles.STUDENT AND batchNo=2")
    Integer countTotaNotlWithNhifControlNumberBatch2();

    @Query("SELECT new com.nmbsms.scholarship_management.signUp.StudentPaymentStatusDTO(s.name,s.feePaymentStatus,s.nhifPaymentStatus,s.batchNo) FROM SignUp s "+
        "WHERE s.role=com.nmbsms.scholarship_management.signUp.UserRoles.STUDENT AND s.feePaymentStatus='PAID' AND s.nhifPaymentStatus='PAID' "+
        "ORDER BY s.batchNo ASC")
    List<StudentPaymentStatusDTO> getStudentWithPaidFeesAndNhif();

    @Query("SELECT new com.nmbsms.scholarship_management.signUp.StudentPaymentStatusDTO(s.name,s.feePaymentStatus,s.nhifPaymentStatus,s.batchNo) FROM SignUp s "+
        "WHERE s.role=com.nmbsms.scholarship_management.signUp.UserRoles.STUDENT "+
        "AND (s.feePaymentStatus!= 'PAID' OR s.nhifPaymentStatus!='PAID' OR s.feePaymentStatus IS NULL OR s.nhifPaymentStatus IS NULL) "+
        "ORDER BY CASE " +
        "WHEN (s.feePaymentStatus != 'PAID' OR s.feePaymentStatus IS NULL) AND (s.nhifPaymentStatus != 'PAID' OR s.nhifPaymentStatus IS NULL) THEN 1 " +
        "WHEN s.nhifPaymentStatus = 'PAID' AND (s.feePaymentStatus != 'PAID' OR s.feePaymentStatus IS NULL) THEN 2 " +
        "WHEN s.feePaymentStatus = 'PAID' AND (s.nhifPaymentStatus != 'PAID' OR s.nhifPaymentStatus IS NULL) THEN 3 " +
        "ELSE 4 END, s.batchNo")
        List<StudentPaymentStatusDTO> getStudentsWithPendingPayments();

    @Query("SELECT new com.nmbsms.scholarship_management.signUp.StudentPaymentStatusDTO(s.name, s.feePaymentStatus, s.nhifPaymentStatus, s.batchNo) " +
        "FROM SignUp s " +
        "WHERE s.role = com.nmbsms.scholarship_management.signUp.UserRoles.STUDENT " +
        "AND (s.feePaymentStatus != 'PAID' OR s.feePaymentStatus IS NULL) " +
        "AND (s.nhifPaymentStatus != 'PAID' OR s.nhifPaymentStatus IS NULL) " +
        "ORDER BY s.batchNo ASC")
    List<StudentPaymentStatusDTO> getStudentsWithBothPending();

    @Query("SELECT new com.nmbsms.scholarship_management.signUp.StudentPaymentStatusDTO(s.name, s.feePaymentStatus, s.nhifPaymentStatus, s.batchNo) " +
        "FROM SignUp s " +
        "WHERE s.role = com.nmbsms.scholarship_management.signUp.UserRoles.STUDENT " +
        "AND s.nhifPaymentStatus = 'PAID' " +
        "AND (s.feePaymentStatus != 'PAID' OR s.feePaymentStatus IS NULL) " +
        "ORDER BY s.batchNo ASC")
    List<StudentPaymentStatusDTO> getStudentsWithFeePending();

    @Query("SELECT new com.nmbsms.scholarship_management.signUp.StudentPaymentStatusDTO(s.name, s.feePaymentStatus, s.nhifPaymentStatus, s.batchNo) " +
        "FROM SignUp s " +
        "WHERE s.role = com.nmbsms.scholarship_management.signUp.UserRoles.STUDENT " +
        "AND s.feePaymentStatus = 'PAID' " +
        "AND (s.nhifPaymentStatus != 'PAID' OR s.nhifPaymentStatus IS NULL) " +
        "ORDER BY s.batchNo ASC")
    List<StudentPaymentStatusDTO> getStudentsWithNhifPending();

    @Query("SELECT new com.nmbsms.scholarship_management.signUp.StudentNameDTO(s.name) " +
        "FROM SignUp s " +
        "WHERE s.role = com.nmbsms.scholarship_management.signUp.UserRoles.STUDENT " +
        "AND (s.feePaymentStatus IS NULL AND s.nhifPaymentStatus IS NULL)  " +
        "ORDER BY s.batchNo ASC")
    List<StudentPaymentStatusDTO> getStudentsWithBothNull();

    @Query("SELECT new com.nmbsms.scholarship_management.signUp.StudentNameDTO(s.name) " +
        "FROM SignUp s " +
        "WHERE s.role = com.nmbsms.scholarship_management.signUp.UserRoles.STUDENT " +
        "AND s.feePaymentStatus IS NULL " +
        "ORDER BY s.batchNo ASC")
    List<StudentPaymentStatusDTO> getStudentsWithFeeNull();

    @Query("SELECT new com.nmbsms.scholarship_management.signUp.StudentNameDTO(s.name) " +
        "FROM SignUp s " +
        "WHERE s.role = com.nmbsms.scholarship_management.signUp.UserRoles.STUDENT " +
        "AND s.nhifPaymentStatus IS NULL " +
        "ORDER BY s.batchNo ASC")
    List<StudentPaymentStatusDTO> getStudentsWithNhifnull();
}
