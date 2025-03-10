package com.nmbsms.scholarship_management.profile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.nmbsms.scholarship_management.signUp.SignUp;
import org.springframework.beans.factory.annotation.Autowired;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;


@Service
public class ProfileService {
    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private String uploadDir;

    public ProfileDTO getProfile(String email){
        SignUp student= profileRepository.findByEmail(email).orElseThrow(()->new RuntimeException("User not found"));

        ProfileDTO profileDTO= new ProfileDTO();
        profileDTO.setEmail(student.getEmail());
        profileDTO.setName(student.getName());
        profileDTO.setSex(student.getSex());
        profileDTO.setPhoneNumber(student.getPhoneNumber());
        profileDTO.setUniversityName(student.getUniversityName());
        profileDTO.setUniversityRegistrationId(student.getUniversityRegistrationId());
        profileDTO.setCourseProgrammeName(student.getCourseProgrammeName());
        profileDTO.setEnrolledYear(student.getEnrolledYear());
        profileDTO.setBatchNo(student.getBatchNo());
        profileDTO.setEnrollmentStatus(student.getEnrollmentStatus());
        return profileDTO;
    }

    public String updateProfile(ProfileDTO profileDTO, String email,MultipartFile avatarFile) throws IOException {
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





