package com.nmbsms.scholarship_management.configuration;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.beans.factory.annotation.Value;
import java.io.File;


@Configuration
public class FileStorageConfig implements WebMvcConfigurer {

    @Value("${file.upload-dir}")
    private String baseUploadDir;

    public String getUploadDir() {
        return baseUploadDir + "/results/";
    }

    public FileStorageConfig() {
        File directory = new File(getUploadDir());
        if (!directory.exists()) {
            directory.mkdirs();
        }
    }
}


