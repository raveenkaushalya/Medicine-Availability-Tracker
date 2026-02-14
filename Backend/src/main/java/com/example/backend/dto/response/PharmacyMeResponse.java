package com.example.backend.dto.response;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PharmacyMeResponse {
    private Integer id;

    // business (read-only mostly)
    private String legalEntityName;
    private String tradeName;
    private String nmraLicense;
    private String businessRegNo;
    private String addressInSriLanka;
    private String telephone;
    private String email;
    private String entityType;

    // editable
    private String contactFullName;
    private String contactTitle;
    private String contactPhone;

    private String aboutPharmacy;
    private String openingHoursJson;

    // status
    private String status;
}
