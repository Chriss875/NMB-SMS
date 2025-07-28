package com.nmbsms.scholarship_management.results;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminResultsDTO {
    private long resultId;
    private String name;
    private String universityName;
    private String phoneNumber;
    private Integer batchNo;
    private String status;
    private String filePath;
}
