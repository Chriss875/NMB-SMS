package com.nmbsms.scholarship_management.results;
import java.io.IOException;
import java.nio.file.Paths;
import java.nio.file.Files;
import java.nio.file.Path;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import com.nmbsms.configuration.FileStorageConfig;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Collections;
import com.nmbsms.scholarship_management.signUp.SignUpRepository;
import com.nmbsms.scholarship_management.signUp.SignUp;



@Service
@RequiredArgsConstructor
public class ResultService {
    private final ResultsRepository resultsRepository;
    private final FileStorageConfig fileStorageConfig;
    private final SignUpRepository signUpRepository;

    public void validateFileType(MultipartFile file){
        String contentType=file.getContentType();
        if(contentType==null||!contentType.startsWith("application/pdf")){
            throw new IllegalArgumentException("Invalid file type. Only PDF files are allowed.");
        }
        if(file.getSize()>(5*1024*1024)){
            throw new IllegalArgumentException("File size exceeds 5MB.");
        }
    }

    public String storeFile(MultipartFile file) throws IOException{
        if(file==null || file.isEmpty()){
            throw new IllegalArgumentException("File is empty.");
        }
        String uploadDirectory = fileStorageConfig.getUploadDir();
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        if (fileName.contains("..")) {
            throw new IllegalArgumentException("Invalid file format");
        }
        Path uploadPath = Paths.get(uploadDirectory);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        return filePath.toString();
    }

    public Results uploadResult(String email, MultipartFile file) throws IOException {
        validateFileType(file);
        String filePath = storeFile(file);
        Optional<SignUp> user = signUpRepository.findByEmail(email);
        SignUp student= user.get();
        Results result = new Results();
        result.setStudent(student.getName());
        result.setEmail(email);
        result.setFileName(file.getOriginalFilename());
        result.setFilePath(filePath);
        result.setUploadTime(LocalDateTime.now());
        result.setStatus("Submitted");
        resultsRepository.save(result);
        return result;
    }

    public void deleteResult(String fileName) throws IOException {
        Results result = resultsRepository.findByFileName(fileName).orElseThrow(() -> new IllegalArgumentException("Result not found"));
        Files.deleteIfExists(Paths.get(result.getFilePath()));
        resultsRepository.delete(result);
    }

    public Results getResultByFileName(String fileName) {
        return resultsRepository.findByFileName(fileName)
                .orElseThrow(() -> new IllegalArgumentException("Result not found."));
    }

    public List<Results> getAllResults(String email) {
        return resultsRepository.findByEmail(email);
    }

    public List<String> getResultStatus(String email) {
        List<Results> results = resultsRepository.findByEmail(email);
        if (results.isEmpty()) {
            return Collections.singletonList("Not Submitted");
        }
        return results.stream()
        .map(Results::getStatus)
        .distinct()
        .toList();
    }

    public Optional<byte[]> downloadResult(String fileName) {
        return resultsRepository.findByFileName(fileName)
                .map(result -> {
                    try {
                        Path filePath = Paths.get(result.getFilePath());
                        return Files.readAllBytes(filePath);
                    } catch (IOException e) {
                        throw new RuntimeException("Error reading file: " + fileName, e);
                    }
                });
    }
}
