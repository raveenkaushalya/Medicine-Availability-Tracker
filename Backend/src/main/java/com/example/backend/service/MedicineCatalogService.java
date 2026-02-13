package com.example.backend.service;

import com.example.backend.dto.response.MedicineSuggestResponse;
import com.example.backend.entity.MedicineMaster;
import java.util.List;

public interface MedicineCatalogService {
    List<MedicineSuggestResponse> suggest(String q);


    MedicineMaster getOne(Integer id);

}
