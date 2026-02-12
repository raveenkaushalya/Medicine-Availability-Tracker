package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "medicine_master",
        indexes = {
                @Index(name = "idx_medicine_generic", columnList = "genericName"),
                @Index(name = "idx_medicine_brand", columnList = "brandName"),
                @Index(name = "idx_medicine_regno", columnList = "regNo")
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicineMaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true, length = 50)
    private String regNo;

    private String genericName;
    private String brandName;
    private String dosage;

    private String packSize;
    private String packType;
    private String manufacturer;
    private String country;
    private String agent;

    private LocalDate regDate;
    private String schedule;
    private String validation;
    private String dossierNo;

    @Enumerated(EnumType.STRING)
    private CatalogStatus status = CatalogStatus.ACTIVE;

    private LocalDateTime createdAt = LocalDateTime.now();
}
