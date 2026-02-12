package com.example.backend.service;

import com.example.backend.dto.request.SetPasswordRequest;

public interface PasswordSetupService {
    void setPassword(SetPasswordRequest req);
}
