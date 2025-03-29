package com.nmbsms.scholarship_management.results;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.HashMap;
import org.springframework.http.HttpHeaders;
import java.util.Optional;
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

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, String>> deleteResult(@PathVariable("id") long id) {
        Map<String, String> response = new HashMap<>();
        try {
            resultService.deleteResult(id);
            response.put("message", "File deleted successfully!");
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            response.put("error", "Failed to delete file: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/download/{fileName}")
    public ResponseEntity<byte[]> downloadResult(@PathVariable String fileName) {
        Optional<byte[]> fileData = resultService.downloadResult(fileName);

        if (fileData.isPresent()) {
            byte[] fileContent = fileData.get();
            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Disposition", "attachment; filename=\"" + fileName + "\"");
            headers.add("Content-Type", "application/pdf");
            return new ResponseEntity<>(fileContent, headers, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
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
}
