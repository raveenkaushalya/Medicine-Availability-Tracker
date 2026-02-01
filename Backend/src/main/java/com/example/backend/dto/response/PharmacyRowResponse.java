package com.example.backend.dto.response;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PharmacyRowResponse {

    private Integer id;

    private String legalEntityName;
    private String tradeName;
    private String nmraLicense;
    private String businessRegNo;

    private String addressInSriLanka;
    private String telephone;
    private String email;

    private String status;  // PENDING / APPROVED / REJECTED
}
