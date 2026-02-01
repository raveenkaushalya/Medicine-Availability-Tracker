package com.example.backend.controller;

import com.example.backend.dto.request.PharmacyRejectRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.PharmacyRowResponse;
import com.example.backend.service.PharmacyService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/pharmacies")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminPharmacyController {

    private final PharmacyService pharmacyService;

    public AdminPharmacyController(PharmacyService pharmacyService) {
        this.pharmacyService = pharmacyService;
    }

    // Admin table list (pagination + filter + search)
    // Examples:
    // /api/v1/admin/pharmacies?status=PENDING&page=0&size=10
    // /api/v1/admin/pharmacies?status=APPROVED&q=abc&page=0&size=10
    @GetMapping
    public Page<PharmacyRowResponse> list(
            @RequestParam(defaultValue = "ALL") String status,
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return pharmacyService.getPharmaciesForAdmin(status, q, page, size);
    }

    // Approve pharmacy
    @PatchMapping("/{id}/approve")
    public ApiResponse approve(@PathVariable Integer id) {
        pharmacyService.approvePharmacy(id);
        return new ApiResponse(true, "Pharmacy approved. Credentials sent via email.", null);
    }

    // Reject pharmacy
    @PatchMapping("/{id}/reject")
    public ApiResponse reject(@PathVariable Integer id, @Valid @RequestBody PharmacyRejectRequest request) {
        pharmacyService.rejectPharmacy(id, request.getReason());
        return new ApiResponse(true, "Pharmacy rejected.", null);
    }
}
