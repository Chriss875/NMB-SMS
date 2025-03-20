package com.nmbsms.scholarship_management.results;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

@Service
@RequiredArgsConstructor
public class ResultService {

    private final ResultsRepository repository;

    public ResponseEntity<String> uploadResult(MultipartFile file) throws IOException {

        if (file == null){
            throw new NullPointerException("File cannot be empty");
        }
        if (!"application/pdf".equals(file.getContentType())) {
            throw new IllegalArgumentException("Only PDF files are allowed");
        }
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException("File size exceeds the maximum limit of 5MB");
        }

        Results result = repository.save(Results.builder()
                .fileName(file.getOriginalFilename())
                .fileType(file.getContentType())
                .file(ImageUtils.compressImage(file.getBytes()))
                .uploadTime(LocalDateTime.now())
                .build());

        return ResponseEntity.ok("File uploaded successfully: " + file.getOriginalFilename());
    }

    public Optional<byte[]> downloadImage(String fileName) {
        return repository.findByFileName(fileName)
                .map(result -> ImageUtils.decompressImage(result.getFile()));
    }

    public ResponseEntity<String> deleteImage(String fileName) throws IOException {
        Optional<Results> result = repository.findByFileName(fileName);
        if (result.isPresent()) {
            repository.delete(result.get());
            return ResponseEntity.ok("File deleted successfully: " + fileName);
        } else {
            throw new IOException("File not found: " + fileName);
        }
    }

    public ResponseEntity<byte[]> getResultByFileName(String fileName) {
        Optional<Results> resultOpt = repository.findByFileName(fileName);
        if (resultOpt.isPresent()) {
            Results result = resultOpt.get();
            byte[] imageData = ImageUtils.decompressImage(result.getFile());
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(result.getFileType()))
                    .body(imageData);
        }
        return ResponseEntity.notFound().build();
    }
}
