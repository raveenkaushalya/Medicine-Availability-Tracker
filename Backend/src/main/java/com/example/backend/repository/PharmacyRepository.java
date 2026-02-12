package com.example.backend.repository;

import com.example.backend.entity.Pharmacy;
import com.example.backend.entity.PharmacyStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.example.backend.entity.Pharmacy; // (or your package)


public interface PharmacyRepository extends JpaRepository<Pharmacy, Integer> {

    boolean existsByNmraLicense(String nmraLicense);
    boolean existsByEmail(String email);
    boolean existsByBusinessRegNo(String businessRegNo);


    Page<Pharmacy> findByStatus(PharmacyStatus status, Pageable pageable);

    Page<Pharmacy> findByLegalEntityNameContainingIgnoreCase(String q, Pageable pageable);

    Page<Pharmacy> findByStatusAndLegalEntityNameContainingIgnoreCase(
            PharmacyStatus status, String q, Pageable pageable
    );

}
