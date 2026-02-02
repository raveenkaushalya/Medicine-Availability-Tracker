package com.example.backend.repository;

import com.example.backend.entity.MedicineMaster;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MedicineMasterRepository extends JpaRepository<MedicineMaster, Integer> {

    Optional<MedicineMaster> findByRegNo(String regNo);

    // Autocomplete (top 10)
    List<MedicineMaster> findTop10ByGenericNameStartingWithIgnoreCaseOrBrandNameStartingWithIgnoreCase(
            String genericName,
            String brandName
    );
}
