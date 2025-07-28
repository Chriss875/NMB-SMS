package com.nmbsms.scholarship_management.home;

import org.springframework.web.bind.annotation.*;
import lombok.*;
import java.util.Map;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;


@RestController
@RequestMapping(path="/api/home")
@RequiredArgsConstructor
public class DashboardController {
    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getDashboardData() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        Map<String, Object> dashboardData = dashboardService.getDashboardData(email);
        return ResponseEntity.ok(dashboardData);
    }
    
}
