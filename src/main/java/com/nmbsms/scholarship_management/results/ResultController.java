package com.nmbsms.scholarship_management.results;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/api/resultpdf")
@RequiredArgsConstructor
public class ResultController {
private final ResultService resultService;

    @PostMapping
    public ResponseEntity<String> uploadResultPdf(@RequestParam("result") MultipartFile file) throws IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return resultService.uploadResult(file, email);
    }

    @GetMapping("/{fileName}")
    public ResponseEntity<byte[]> downloadResultPdf(@PathVariable String fileName) {
        return resultService.getResultByFileName(fileName);
    }

    @DeleteMapping("/{fileName}")
    public ResponseEntity<String> deleteResultPdf(@PathVariable String fileName) throws IOException {
        return resultService.deleteImage(fileName);
    }
    
}