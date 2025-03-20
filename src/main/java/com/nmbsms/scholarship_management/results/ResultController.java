package com.nmbsms.scholarship_management.results;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

@RestController
@RequestMapping("/api/resultpdf")
@RequiredArgsConstructor
public class ResultController {
private final ResultService resultService;

    @PostMapping
    public ResponseEntity<String> uploadResultPdf(@RequestParam("result") MultipartFile file) throws IOException {
        return resultService.uploadResult(file);
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