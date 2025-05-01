package com.nmbsms.scholarship_management.admindashboard;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdmindashboardRepository extends JpaRepository<Admindashboard, Long> {
    
}
