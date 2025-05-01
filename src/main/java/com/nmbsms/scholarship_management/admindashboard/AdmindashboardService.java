package com.nmbsms.scholarship_management.admindashboard;
import org.springframework.stereotype.Service;
import com.nmbsms.scholarship_management.signUp.SignUpRepository;
import com.nmbsms.scholarship_management.results.ResultsRepository;
import lombok.*;
import java.util.List;
import com.nmbsms.scholarship_management.signUp.NotSubmittedDTO;
import com.nmbsms.scholarship_management.signUp.StudentResultDTO;
import jakarta.persistence.EntityNotFoundException;
import com.nmbsms.scholarship_management.signUp.StudentPaymentStatusDTO;


@Service
@RequiredArgsConstructor
public class AdmindashboardService {
    private final SignUpRepository signUpRepository;
    private final AdmindashboardRepository dashboardRepository;
    private final ResultsRepository resultsRepository;

    public Admindashboard getDashboard() {
        Integer totalStudents = signUpRepository.countTotalStudents();
        Integer batch1 = signUpRepository.countBatch1();
        Integer batch2 = signUpRepository.countBatch2();
        Integer totalSubmitted = resultsRepository.countTotalStudents();
        Integer submittedBatch1 = resultsRepository.countSubmittedBatch1();
        Integer submittedBatch2 = resultsRepository.countSubmittedBatch2();
        Integer totalNotSubmitted = signUpRepository.countNotSubmittedTotal();
        Integer notSubmittedBatch1 = signUpRepository.countNotSubmittedBatch1();
        Integer notSubmittedBatch2 = signUpRepository.countNotSubmittedBatch2();

        Admindashboard dashboard = new Admindashboard();
        dashboard.setTotalStudents(totalStudents);
        dashboard.setBatch1(batch1);
        dashboard.setBatch2(batch2);
        dashboard.setTotalSubmitted(totalSubmitted);
        dashboard.setSubmittedBatch1(submittedBatch1);
        dashboard.setSubmittedBatch2(submittedBatch2);
        dashboard.setTotalNotSubmitted(totalNotSubmitted);
        dashboard.setNotSubmittedBatch1(notSubmittedBatch1);
        dashboard.setNotSubmittedBatch2(notSubmittedBatch2);
        dashboard.setTotalSubmittedFeeControlNumber(signUpRepository.countTotalWithFeeControlNumber());
        dashboard.setTotalSubmittedNhifControlNumber(signUpRepository.countTotalWithNhifControlNumberBatch2());
        dashboard.setTotalSubmittedFeeControlNumberBatch1(signUpRepository.countTotalWithFeeControlNumberBatch1());
        dashboard.setTotalSubmittedFeeControlNumberBatch2(signUpRepository.countTotalWithFeeControlNumberBatch2());
        dashboard.setTotalSubmittedNhifControlNumberBatch1(signUpRepository.countTotalWithNhifControlNumberBatch1());
        dashboard.setTotalSubmittedNhifControlNumberBatch2(signUpRepository.countTotalWithNhifControlNumberBatch2());
        dashboard.setTotalNotSubmittedFeeControlNumber(signUpRepository.countTotalNotWithFeeControlNumber());
        dashboard.setTotalNotSubmittedNhifControlNumber(signUpRepository.countTotalNotWithNhifControlNumber());
        dashboard.setTotalNotSubmittedFeeControlNumberBatch1(signUpRepository.countTotalNotWithFeeControlNumberBatch1());
        dashboard.setTotalNotSubmittedFeeControlNumberBatch2(signUpRepository.countTotalNotWithFeeControlNumberBatch2());
        dashboard.setTotalNotSubmittedNhifControlNumberBatch1(signUpRepository.countTotalNotWithNhifControlNumberBatch1());
        dashboard.setTotalNotSubmittedNhifControlNumberBatch2(signUpRepository.countTotaNotlWithNhifControlNumberBatch2());
        dashboardRepository.save(dashboard);
        return dashboard;
    }

    public List<NotSubmittedDTO> getNotSubmitted() {
        List<NotSubmittedDTO> notSubmitted=signUpRepository.findNotSubmitted();
        if(notSubmitted.isEmpty()){
            throw new EntityNotFoundException("No student who has not submitted results");
        }
        return notSubmitted;
    }

    public List<StudentResultDTO> getSubmittedStudentAndStatus(Integer batchNo, String status) {
        List <StudentResultDTO> studentsResults= signUpRepository.findStudentsWithResults(batchNo, status);
        if(studentsResults.isEmpty()){
            throw new EntityNotFoundException("No student found with submitted results");
        }
        return studentsResults;
        
    }

    public List<StudentPaymentStatusDTO> getStudentWithPaidFeeAndNhif(){
        List<StudentPaymentStatusDTO> studentsPayments= signUpRepository.getStudentWithPaidFeesAndNhif();
        if (studentsPayments.isEmpty()){
            throw new EntityNotFoundException("No student found with paid fees and NHIF");
        }
        return studentsPayments;
    }

    public List <StudentPaymentStatusDTO> getStudentsWithPendingPayments(String filterType){
        List<StudentPaymentStatusDTO> students;
        if (filterType == null || filterType.trim().isEmpty()) {
            students = signUpRepository.getStudentsWithPendingPayments();
        } else {
            switch (filterType.toLowerCase()) {
                case "both":
                    students = signUpRepository.getStudentsWithBothPending();
                    break;
                case "fee":
                    students = signUpRepository.getStudentsWithFeePending();
                    break;
                case "nhif":
                    students = signUpRepository.getStudentsWithNhifPending();
                    break;
                default:
                    students = signUpRepository.getStudentsWithPendingPayments();
                    break;
            }
        }
        if (students.isEmpty()) {
            throw new EntityNotFoundException("No students found with pending payments for filterType: " + (filterType != null ? filterType : "none"));
        }
        return students;
    }

    public List<StudentPaymentStatusDTO> getStudentsWithoutControlNumber(String filterType){
        List<StudentPaymentStatusDTO> students;
        switch(filterType.toLowerCase()){
            case "both":
                students= signUpRepository.getStudentsWithBothNull();
                break;
            case "fee":
                students= signUpRepository.getStudentsWithFeeNull();
                break;
            case "nhif":
                students= signUpRepository.getStudentsWithNhifnull();
                break;
            default:
            throw new IllegalArgumentException("Invalid filter type: " + filterType);
        }
        if (students.isEmpty()){
            throw new EntityNotFoundException("No student with unsubmitted control number");
        }
        return students;
    }
}

