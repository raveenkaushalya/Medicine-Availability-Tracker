package com.example.backend.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdatePharmacyMeRequest {


    @Size(max = 100)
    private String contactFullName;

    @Size(max = 100)
    private String contactTitle;

    @Size(max = 30)
    private String contactPhone;

    @Size(max = 30)
    private String telephone;

    @Size(max = 2000)
    private String aboutPharmacy;

    private String openingHoursJson;
}
