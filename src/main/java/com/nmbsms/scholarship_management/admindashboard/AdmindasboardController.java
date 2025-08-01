package com.nmbsms.scholarship_management.admindashboard;
import lombok.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.nmbsms.scholarship_management.signUp.NotSubmittedDTO;
import com.nmbsms.scholarship_management.signUp.StudentPaymentStatusDTO;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import com.nmbsms.scholarship_management.signUp.StudentResultDTO;


@RestController
@RequiredArgsConstructor
@RequestMapping(path= "api/v1/admin")
public class AdmindasboardController {
    private final AdmindashboardService admindashboardService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Admindashboard> getDashboard() {
        Admindashboard dashboard = admindashboardService.getDashboard();
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/not-submitted-results")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<NotSubmittedDTO>> getNotSubmittedStudents() {
        List<NotSubmittedDTO> notSubmitted = admindashboardService.getNotSubmitted();
        return ResponseEntity.ok(notSubmitted);
    }

    @GetMapping("/students-with-results")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<StudentResultDTO>> getSubmittedStudentAndStatus(
        @RequestParam(value = "batchNo", required = false) Integer batchNo,
        @RequestParam(value = "status", required = false) String status
    ){
        List<StudentResultDTO> students = admindashboardService.getSubmittedStudentAndStatus(batchNo, status);
        return ResponseEntity.ok(students);
    }

    @GetMapping("/paid-fees-and-nhif")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<StudentPaymentStatusDTO>> getStudentWithPaidFeeAndNhif(){
        List<StudentPaymentStatusDTO> students = admindashboardService.getStudentWithPaidFeeAndNhif();
        return ResponseEntity.ok(students);
    }

    @GetMapping("/pending-payments")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<StudentPaymentStatusDTO>> getStudentsWithPendingPayments(
        @RequestParam(value = "filterType", required = false) String filterType) {
        List<StudentPaymentStatusDTO> students = admindashboardService.getStudentsWithPendingPayments(filterType);
        return ResponseEntity.ok(students);
    }

    @GetMapping("/unsubmitted-payments")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<StudentPaymentStatusDTO>> getStudentsWithoutControlNumber(
        @RequestParam(value="filterType", required= true) String filterType){
        List<StudentPaymentStatusDTO> students= admindashboardService.getStudentsWithoutControlNumber(filterType);
        return ResponseEntity.ok(students);
        }
}
