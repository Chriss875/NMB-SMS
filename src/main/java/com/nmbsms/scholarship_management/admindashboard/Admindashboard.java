package com.nmbsms.scholarship_management.admindashboard;
import lombok.*;
import jakarta.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "admindashboard")
public class Admindashboard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private Integer totalStudents;
    private Integer batch1;
    private Integer batch2;
    private Integer totalSubmitted;
    private Integer submittedBatch1;
    private Integer submittedBatch2;
    private Integer totalNotSubmitted;
    private Integer notSubmittedBatch1;
    private Integer notSubmittedBatch2;
    private Integer totalSubmittedFeeControlNumber;
    private Integer totalSubmittedNhifControlNumber;
    private Integer totalSubmittedFeeControlNumberBatch1;
    private Integer totalSubmittedFeeControlNumberBatch2;
    private Integer totalSubmittedNhifControlNumberBatch1;
    private Integer totalSubmittedNhifControlNumberBatch2;
    private Integer totalNotSubmittedFeeControlNumber;
    private Integer totalNotSubmittedNhifControlNumber;
    private Integer totalNotSubmittedFeeControlNumberBatch1;
    private Integer totalNotSubmittedFeeControlNumberBatch2;
    private Integer totalNotSubmittedNhifControlNumberBatch1;
    private Integer totalNotSubmittedNhifControlNumberBatch2;
}