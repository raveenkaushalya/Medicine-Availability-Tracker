package com.example.backend.service;

import com.example.backend.dto.request.PharmacyRegisterRequest;
import com.example.backend.dto.response.PharmacyRowResponse;
import org.springframework.data.domain.Page;

public interface PharmacyService {

    Integer register(PharmacyRegisterRequest request);

    Page<PharmacyRowResponse> getPharmaciesForAdmin(String status, String q, int page, int size);

    void approvePharmacy(Integer pharmacyId);

    void rejectPharmacy(Integer pharmacyId, String reason);
}
