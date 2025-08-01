package com.nmbsms.scholarship_management.home;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;
import lombok.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;


@RestController
@RequestMapping(path="/api/home")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Endpoints for student dashboard")
public class DashboardController {
    private final DashboardService dashboardService;

    @Operation(
            summary = "Get student dashboard data",
            description = "Retrieves dashboard data for the currently authenticated student, including announcements, payments, result status, and enrollment status"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Dashboard data retrieved successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = DashboardDTO.class)
                    )
            ),
            @ApiResponse(responseCode = "404", description = "User not found", content = @Content)
    })
    @GetMapping
    public ResponseEntity<DashboardDTO> getDashboardData() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        DashboardDTO dashboardData = dashboardService.getDashboardData(email);
        return ResponseEntity.ok(dashboardData);
    }
}
