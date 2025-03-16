package com.nmbsms.scholarship_management.results;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResultsDTO {
    private Long id;
    private LocalDateTime uploadTime;
    private String fileName;
    private String fileType;
    private Long fileSize;
}

