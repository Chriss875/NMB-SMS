package com.nmbsms.scholarship_management.results;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.HashMap;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(path="api/results")
public class ResultController {
    private final ResultService resultService;

    @PostMapping("/upload")
    public ResponseEntity<Map<String,String>> uploadResult(@RequestParam("file") MultipartFile file){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
    || authentication instanceof AnonymousAuthenticationToken) {
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
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

    @DeleteMapping("/delete/{fileName}")
    public ResponseEntity<Map<String, String>> deleteResult(@PathVariable("fileName") String fileName) {
        Map<String, String> response = new HashMap<>();
        try {
            resultService.deleteResult(fileName);
            response.put("message", "File deleted successfully!");
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            response.put("error", "Failed to delete file: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Results>> getAllResults() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
        || authentication instanceof AnonymousAuthenticationToken) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    }
        String email = authentication.getName();
        return ResponseEntity.ok(resultService.getAllResults(email));
}

    @GetMapping("/batch/{batchNo}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AdminResultsDTO>> getResultsByBatchAndStatus(
        @PathVariable Integer batchNo,
        @RequestParam(value="status", required=false) String status){
        List<AdminResultsDTO> results = resultService.getResultsForBatchWithStatus(status,batchNo);
        return ResponseEntity.ok(results);
        }

    @PostMapping("/changeStatus/{resultId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> changeResultStatus(
        @PathVariable long resultId,
        @RequestParam(value="newStatus",required=true) String newStatus){
        resultService.updateResultStatus(resultId, newStatus);
        return ResponseEntity.ok("Status updated successfully");
        }
}
