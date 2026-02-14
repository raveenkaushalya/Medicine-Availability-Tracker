package com.example.backend.controller;

import com.example.backend.dto.request.SetPasswordRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.service.PasswordSetupService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/pharmacies")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
public class PharmacyPasswordController {

    private final PasswordSetupService passwordSetupService;

    public PharmacyPasswordController(PasswordSetupService passwordSetupService) {
        this.passwordSetupService = passwordSetupService;
    }

    @PostMapping("/set-password")
    public ApiResponse setPassword(@Valid @RequestBody SetPasswordRequest req) {
        passwordSetupService.setPassword(req);
        return new ApiResponse(true, "Password set successfully. You can now login.", null);
    }
}
