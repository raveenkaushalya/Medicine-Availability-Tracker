package com.example.backend.controller;

import com.example.backend.dto.request.UpdatePharmacyMeRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.entity.Pharmacy;
import com.example.backend.entity.User;
import com.example.backend.repository.PharmacyRepository;
import com.example.backend.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PatchMapping;


@RestController
@RequestMapping("/api/v1/pharmacies")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class PharmacyMeController {

    private final PharmacyRepository pharmacyRepository;
    private final UserRepository userRepository;

    public PharmacyMeController(PharmacyRepository pharmacyRepository,
                                UserRepository userRepository) {
        this.pharmacyRepository = pharmacyRepository;
        this.userRepository = userRepository;
    }

    private User requireLoggedInUser(HttpServletRequest request) {
        var session = request.getSession(false);
        if (session == null) throw new RuntimeException("Not logged in");

        Integer userId = (Integer) session.getAttribute("USER_ID");
        if (userId == null) throw new RuntimeException("Not logged in");

        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private Pharmacy requireMyPharmacy(User user) {
        return pharmacyRepository.findByEmail(user.getUsername())
                .orElseThrow(() -> new RuntimeException("Pharmacy not found"));
    }

    // ✅ Load full pharmacy details for dashboard
    @GetMapping("/me")
    public ApiResponse me(HttpServletRequest request) {
        User user = requireLoggedInUser(request);
        Pharmacy pharmacy = requireMyPharmacy(user);
        return new ApiResponse(true, "OK", pharmacy);
    }


    // ✅ Update ONLY editable fields
    @PatchMapping("/me")
    public ApiResponse updateMe(@RequestBody com.example.backend.dto.request.UpdatePharmacyMeRequest req,
                                HttpServletRequest request) {

        var session = request.getSession(false);
        if (session == null) throw new RuntimeException("Not logged in");

        Integer userId = (Integer) session.getAttribute("USER_ID");
        if (userId == null) throw new RuntimeException("Not logged in");

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Pharmacy pharmacy = pharmacyRepository.findByEmail(user.getUsername())
                .orElseThrow(() -> new RuntimeException("Pharmacy not found"));

        // ✅ Update only allowed fields (null-safe)
        if (req.getContactFullName() != null) pharmacy.setContactFullName(req.getContactFullName());
        if (req.getContactTitle() != null) pharmacy.setContactTitle(req.getContactTitle());
        if (req.getContactPhone() != null) pharmacy.setContactPhone(req.getContactPhone());
        if (req.getPharmacyPhoneNumber() != null) pharmacy.setPharmacyPhoneNumber(req.getPharmacyPhoneNumber());
        if (req.getAboutPharmacy() != null) pharmacy.setAboutPharmacy(req.getAboutPharmacy());
        if (req.getOpeningHoursJson() != null) pharmacy.setOpeningHoursJson(req.getOpeningHoursJson());

        pharmacyRepository.save(pharmacy);

        return new ApiResponse(true, "Profile updated", pharmacy);
    }


}
