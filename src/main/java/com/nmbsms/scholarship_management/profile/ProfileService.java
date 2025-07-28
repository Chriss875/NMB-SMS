package com.nmbsms.scholarship_management.profile;

import org.springframework.stereotype.Service;
import com.nmbsms.scholarship_management.signUp.SignUp;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProfileService {
    private final ProfileRepository profileRepository;

    public ProfileResponse getProfile(String email){
        SignUp student= profileRepository.findByEmail(email).orElseThrow(()->new EntityNotFoundException("User not found"));
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

    public String updateProfile(ProfileDTO profileDTO, String email){
        Optional<SignUp> student=profileRepository.findByEmail(email);
        if(student.isEmpty()){
            throw new EntityNotFoundException("User not found");
        }
        SignUp student1=student.get();

        if(profileDTO.getName()!= null){
            student1.setName(profileDTO.getName());
        }
        if(profileDTO.getSex()!=null){
            student1.setSex(profileDTO.getSex());
        }
        if(profileDTO.getPhoneNumber()!=null){
            student1.setPhoneNumber(profileDTO.getPhoneNumber());
        }
        if(profileDTO.getUniversityName()!=null){
            student1.setUniversityName(profileDTO.getUniversityName());
        }
        if(profileDTO.getUniversityRegistrationId()!=null){
            student1.setUniversityRegistrationId(profileDTO.getUniversityRegistrationId());
        }
        if(profileDTO.getCourseProgrammeName()!=null){
            student1.setCourseProgrammeName(profileDTO.getCourseProgrammeName());
        }

        if(profileDTO.getEnrolledYear()!=null){
            student1.setEnrolledYear(profileDTO.getEnrolledYear());
        }
        if(profileDTO.getBatchNo()!=0){
            student1.setBatchNo(profileDTO.getBatchNo());
        }
        profileRepository.save(student1);
        return "Profile updated successfully";
    }
}






