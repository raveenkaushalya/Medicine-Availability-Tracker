package com.example.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SetPasswordRequest {

    @NotBlank
    private String token;

    @NotBlank
    private String newPassword;

    @NotBlank
    private String confirmPassword;
    @NotNull(message = "Please pin pharmacy location on the map")
    private Double latitude;

    @NotNull(message = "Please pin pharmacy location on the map")
    private Double longitude;
}
