package com.nmbsms.scholarship_management;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.ComponentScan;
import com.nmbsms.configuration.FileStorageProperties;

@SpringBootApplication
@ComponentScan(basePackages = {"com.nmbsms.scholarship_management", "com.nmbsms.security", "com.nmbsms.configuration"})
@EnableConfigurationProperties(FileStorageProperties.class)
public class ScholarshipManagementApplication {

	public static void main(String[] args) {
		SpringApplication.run(ScholarshipManagementApplication.class, args);
	}

}
