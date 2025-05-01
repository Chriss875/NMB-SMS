package com.nmbsms.scholarship_management;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.ComponentScan;
import com.nmbsms.configuration.FileStorageProperties;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@ComponentScan(basePackages = {"com.nmbsms.scholarship_management", "com.nmbsms.security", "com.nmbsms.configuration","com.nmbsms.handler","com.nmbsms.exception"})
@EnableConfigurationProperties(FileStorageProperties.class)
@EnableScheduling
public class ScholarshipManagementApplication {

	public static void main(String[] args) {
		SpringApplication.run(ScholarshipManagementApplication.class, args);
	}
}
