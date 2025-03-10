package com.nmbsms.scholarship_management;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.nmbsms.scholarship_management", "com.nmbsms.security", "com.nmbsms.configuration"})
public class ScholarshipManagementApplication {

	public static void main(String[] args) {
		SpringApplication.run(ScholarshipManagementApplication.class, args);
	}

}
