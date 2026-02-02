package com.example.backend.service;

import com.example.backend.dto.response.MedicineSuggestResponse;

import java.util.List;

public interface MedicineCatalogService {
    List<MedicineSuggestResponse> suggest(String q);
}
