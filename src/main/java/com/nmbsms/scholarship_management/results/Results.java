package com.nmbsms.scholarship_management.results;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;




@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "results")
public class Results {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime uploadTime;
    private String fileName;
    private String fileType;

    @Lob
    private byte[] file;
    
}
