package com.example.backend.controller;

import com.example.backend.dto.response.MedicineSuggestResponse;
import com.example.backend.service.MedicineCatalogService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicines")
@RequiredArgsConstructor
public class MedicineCatalogController {

    private final MedicineCatalogService medicineCatalogService;

    // Example: /api/medicines/suggest?q=para
    @GetMapping("/suggest")
    public List<MedicineSuggestResponse> suggest(@RequestParam String q) {
        return medicineCatalogService.suggest(q);
    }
}
