package com.example.backend.controller;

import com.example.backend.dto.request.AdminMedicineCreateRequest;
import com.example.backend.dto.request.AdminMedicineUpdateRequest;
import com.example.backend.dto.response.AdminMedicineRowResponse;
import com.example.backend.service.AdminMedicineService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import com.example.backend.dto.response.AdminMedicineSuggestItem;
import java.util.List;


@RestController
@RequestMapping("/api/v1/admin/medicines")
@CrossOrigin(
        origins = {"http://localhost:5173", "http://localhost:3000"},
        allowCredentials = "true"
)
public class AdminMedicineController {

    private final AdminMedicineService service;

    public AdminMedicineController(AdminMedicineService service) {
        this.service = service;
    }

    @GetMapping
    public Page<AdminMedicineRowResponse> list(
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "ALL") String status,
            @RequestParam(required = false) String manufacturer,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) String brandName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String sort
    ) {
        return service.list(q, status, manufacturer, country, brandName, page, size, sort);
    }

    @GetMapping("/filters/manufacturers")
    public List<String> manufacturers() {
        return service.manufacturers();
    }

    @GetMapping("/filters/brands")
    public List<String> brands() {
        return service.brands();
    }

    @PostMapping
    public AdminMedicineRowResponse create(@Valid @RequestBody AdminMedicineCreateRequest req) {
        return service.create(req);
    }

    @PutMapping("/{id}")
    public AdminMedicineRowResponse update(@PathVariable Integer id, @Valid @RequestBody AdminMedicineUpdateRequest req) {
        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
    @GetMapping("/{id}")
    public AdminMedicineRowResponse getOne(@PathVariable Integer id) {
        return service.getOne(id);
    }

    @GetMapping("/suggest")
    public List<AdminMedicineSuggestItem> suggest(@RequestParam String q) {
        return service.suggest(q);
    }

}
