package com.nmbsms.scholarship_management.results;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.HashMap;
import org.springframework.security.core.Authentication;
import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping(path="api/results")
public class ResultController {
    private final ResultService resultService;

    @PostMapping("/upload")
    public ResponseEntity<Map<String,String>> uploadResult(@RequestParam("file") MultipartFile file){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(null);
        }
        String email = authentication.getName();
        Map<String,String> response = new HashMap<>();
        try {
            Results result = resultService.uploadResult(email,file);
            response.put("message", "File uploaded successfully!");
            response.put("fileName", result.getFileName());
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            response.put("error", "Failed to upload file: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/results/{id}")
    public ResponseEntity<Map<String, String>> deleteResult(@PathVariable("id") Long resultId) {
        Map<String, String> response = new HashMap<>();
        try {
            resultService.deleteResult(resultId);
            response.put("message", "File deleted successfully!");
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            response.put("error", "Failed to delete file: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
