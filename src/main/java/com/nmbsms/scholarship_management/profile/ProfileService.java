package com.nmbsms.scholarship_management.profile;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.nmbsms.scholarship_management.signUp.SignUp;
import lombok.RequiredArgsConstructor;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;


@Service
@RequiredArgsConstructor
public class ProfileService {
    private final ProfileRepository profileRepository;
    private final String uploadDir;

    public ProfileResponse getProfile(String email){
        SignUp student= profileRepository.findByEmail(email).orElseThrow(()->new RuntimeException("User not found"));

        ProfileResponse profileResponse= new ProfileResponse();
        profileResponse.setId(student.getId());
        profileResponse.setRole(student.getRole());
        profileResponse.setEmail(student.getEmail());
        profileResponse.setName(student.getName());
        profileResponse.setSex(student.getSex());
        profileResponse.setPhoneNumber(student.getPhoneNumber());
        profileResponse.setUniversityName(student.getUniversityName());
        profileResponse.setUniversityRegistrationId(student.getUniversityRegistrationId());
        profileResponse.setCourseProgrammeName(student.getCourseProgrammeName());
        profileResponse.setEnrolledYear(student.getEnrolledYear());
        profileResponse.setBatchNo(student.getBatchNo());
        profileResponse.setEnrollmentStatus(student.getEnrollmentStatus());
        return profileResponse;
    }

    public String updateProfile(ProfileResponse profileDTO, String email,MultipartFile avatarFile) throws IOException {
        SignUp student=profileRepository.findByEmail(email).orElseThrow(()->new RuntimeException("User not found"));

        if(profileDTO.getName()!= null){
            student.setName(profileDTO.getName());
        }
        if(profileDTO.getSex()!=null){
            student.setSex(profileDTO.getSex());
        }
        if(profileDTO.getPhoneNumber()!=null){
            student.setPhoneNumber(profileDTO.getPhoneNumber());
        }
        if(profileDTO.getUniversityName()!=null){
            student.setUniversityName(profileDTO.getUniversityName());
        }
        if(profileDTO.getUniversityRegistrationId()!=null){
            student.setUniversityRegistrationId(profileDTO.getUniversityRegistrationId());
        }
        if(profileDTO.getCourseProgrammeName()!=null){
            student.setCourseProgrammeName(profileDTO.getCourseProgrammeName());
        }

        if(profileDTO.getEnrolledYear()!=null){
            student.setEnrolledYear(profileDTO.getEnrolledYear());
        }
        if(profileDTO.getBatchNo()!=0){
            student.setBatchNo(profileDTO.getBatchNo());
        }
        if (avatarFile!=null && !avatarFile.isEmpty()){
            File dir= new File(uploadDir);
            if(!dir.exists()) dir.mkdir();
            String filename= email + "-" + avatarFile.getOriginalFilename();
            Path filePath= Paths.get(uploadDir + filename);
            Files.write(filePath, avatarFile.getBytes());
            student.setAvatar(filePath.toString());
        }

        profileRepository.save(student);
        return "Profile updated successfully";
    }


    }





