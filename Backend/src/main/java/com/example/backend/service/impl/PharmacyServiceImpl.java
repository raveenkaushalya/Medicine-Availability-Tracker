package com.example.backend.service.impl;

import com.example.backend.dto.request.PharmacyRegisterRequest;
import com.example.backend.dto.response.PharmacyRowResponse;
import com.example.backend.entity.Pharmacy;
import com.example.backend.entity.PharmacyStatus;
import com.example.backend.entity.User;
import com.example.backend.repository.PharmacyRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.EmailService;
import com.example.backend.service.PharmacyService;
import org.springframework.data.domain.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
public class PharmacyServiceImpl implements PharmacyService {

    private final PharmacyRepository pharmacyRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    public PharmacyServiceImpl(
            PharmacyRepository pharmacyRepository,
            UserRepository userRepository,
            EmailService emailService,
            PasswordEncoder passwordEncoder
    ) {
        this.pharmacyRepository = pharmacyRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    // ✅ Register pharmacy (PENDING)
    @Override
    public Integer register(PharmacyRegisterRequest request) {

        if (pharmacyRepository.existsByNmraLicense(request.getNmraLicense())) {
            throw new RuntimeException("NMRA License already exists!");
        }

        if (!request.isAgreedToDeclaration()) {
            throw new RuntimeException("Declaration must be accepted!");
        }

        Pharmacy pharmacy = new Pharmacy();
        // business
        pharmacy.setLegalEntityName(request.getLegalEntityName());
        pharmacy.setTradeName(request.getTradeName());
        pharmacy.setNmraLicense(request.getNmraLicense());
        pharmacy.setBusinessRegNo(request.getBusinessRegNo());
        pharmacy.setAddressInSriLanka(request.getAddressInSriLanka());
        pharmacy.setTelephone(request.getTelephone());
        pharmacy.setEmail(request.getEmail());
        pharmacy.setEntityType(request.getEntityType());

        // contact
        pharmacy.setContactFullName(request.getContactFullName());
        pharmacy.setContactTitle(request.getContactTitle());
        pharmacy.setContactPhone(request.getContactPhone());
        pharmacy.setContactEmail(request.getContactEmail());

        // declaration
        pharmacy.setDeclarationDate(request.getDeclarationDate());
        pharmacy.setAgreedToDeclaration(request.isAgreedToDeclaration());

        // ✅ Step 4 defaults (THIS is where you add it)
        pharmacy.setStatus(PharmacyStatus.PENDING);
        pharmacy.setCreatedAt(LocalDateTime.now());

        return pharmacyRepository.save(pharmacy).getId();
    }

    // ✅ Admin list with pagination + filters
    @Override
    public Page<PharmacyRowResponse> getPharmaciesForAdmin(String status, String q, int page, int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        boolean hasQ = q != null && !q.isBlank();
        boolean hasStatus = status != null && !status.equalsIgnoreCase("ALL");

        Page<Pharmacy> result;

        if (hasStatus) {
            PharmacyStatus st = PharmacyStatus.valueOf(status.toUpperCase());
            result = hasQ
                    ? pharmacyRepository.findByStatusAndLegalEntityNameContainingIgnoreCase(st, q, pageable)
                    : pharmacyRepository.findByStatus(st, pageable);
        } else {
            result = hasQ
                    ? pharmacyRepository.findByLegalEntityNameContainingIgnoreCase(q, pageable)
                    : pharmacyRepository.findAll(pageable);
        }

        return result.map(this::toRowResponse);
    }

    // ✅ Approve pharmacy: set APPROVED + create login + email
    @Override
    public void approvePharmacy(Integer pharmacyId) {

        Pharmacy pharmacy = pharmacyRepository.findById(pharmacyId)
                .orElseThrow(() -> new RuntimeException("Pharmacy not found!"));

        if (pharmacy.getStatus() != PharmacyStatus.PENDING) {
            throw new RuntimeException("Only PENDING pharmacies can be approved!");
        }

        // update status
        pharmacy.setStatus(PharmacyStatus.APPROVED);

        // create credentials
        String username = generateUsername(pharmacy);
        String rawPassword = generatePassword(10);

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setRole("PHARMACY");
        user.setPharmacy(pharmacy);
        user.setEnabled(true);

        userRepository.save(user);
        pharmacyRepository.save(pharmacy);

        // send mail
        emailService.sendCredentials(pharmacy.getContactEmail(), username, rawPassword);
    }

    // ✅ Reject pharmacy
    @Override
    public void rejectPharmacy(Integer pharmacyId, String reason) {

        Pharmacy pharmacy = pharmacyRepository.findById(pharmacyId)
                .orElseThrow(() -> new RuntimeException("Pharmacy not found!"));

        if (pharmacy.getStatus() != PharmacyStatus.PENDING) {
            throw new RuntimeException("Only PENDING pharmacies can be rejected!");
        }

        pharmacy.setStatus(PharmacyStatus.REJECTED);
        pharmacy.setRejectionReason(reason);

        pharmacyRepository.save(pharmacy);
    }

    // ===== Helpers =====

    private PharmacyRowResponse toRowResponse(Pharmacy p) {
        return new PharmacyRowResponse(
                p.getId(),
                p.getLegalEntityName(),
                p.getTradeName(),
                p.getNmraLicense(),
                p.getBusinessRegNo(),
                p.getAddressInSriLanka(),
                p.getTelephone(),
                p.getEmail(),
                p.getStatus().name()
        );
    }

    private String generateUsername(Pharmacy p) {
        // example: "abcpharma12"
        String base = p.getLegalEntityName()
                .toLowerCase()
                .replaceAll("[^a-z0-9]", "");

        if (base.length() > 10) base = base.substring(0, 10);

        String candidate = base + p.getId();

        if (!userRepository.existsByUsername(candidate)) return candidate;

        return candidate + (System.currentTimeMillis() % 1000);
    }

    private String generatePassword(int length) {
        String chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@#";
        SecureRandom rnd = new SecureRandom();

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < length; i++) {
            sb.append(chars.charAt(rnd.nextInt(chars.length())));
        }
        return sb.toString();
    }
}
