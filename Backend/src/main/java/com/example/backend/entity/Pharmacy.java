package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "pharmacy")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pharmacy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // ===== Business Details =====
    private String legalEntityName;
    private String tradeName;
    private String nmraLicense;
    private String businessRegNo;
    private String addressInSriLanka;
    private String telephone;
    private String email;
    private String entityType;

    // ===== Contact Person =====
    private String contactFullName;
    private String contactTitle;
    private String contactPhone;
    private String contactEmail;

    // ===== Declaration =====
    private LocalDate declarationDate;
    private boolean agreedToDeclaration;

    // ===== Workflow =====
    @Enumerated(EnumType.STRING)
    private PharmacyStatus status;

    private String rejectionReason;

    private LocalDateTime createdAt;
}
