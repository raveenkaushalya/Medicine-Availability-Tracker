package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "pharmacy_inventory",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"pharmacy_id", "medicine_id"})
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PharmacyInventoryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Which pharmacy owns this inventory row
    @ManyToOne(optional = false)
    @JoinColumn(name = "pharmacy_id")
    private Pharmacy pharmacy;

    // Which medicine from medicine_master
    @ManyToOne(optional = false)
    @JoinColumn(name = "medicine_id")
    private MedicineMaster medicine;

    @Column(nullable = false)
    private Integer stock;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
