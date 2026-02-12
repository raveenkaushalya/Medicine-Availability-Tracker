package com.example.backend.service.impl;

import com.example.backend.dto.request.SetPasswordRequest;
import com.example.backend.entity.PasswordSetupToken;
import com.example.backend.entity.User;
import com.example.backend.repository.PasswordSetupTokenRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.PasswordSetupService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;

@Service
public class PasswordSetupServiceImpl implements PasswordSetupService {

    private final PasswordSetupTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public PasswordSetupServiceImpl(
            PasswordSetupTokenRepository tokenRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.tokenRepository = tokenRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void setPassword(SetPasswordRequest req) {

        if (!req.getNewPassword().equals(req.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match!");
        }

        // Basic password rules (simple)
        if (req.getNewPassword().length() < 8) {
            throw new RuntimeException("Password must be at least 8 characters!");
        }

        // Hash raw token and lookup
        String tokenHash = sha256Hex(req.getToken());

        PasswordSetupToken token = tokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new RuntimeException("Invalid setup token!"));

        if (token.getUsedAt() != null) {
            throw new RuntimeException("This setup link has already been used!");
        }

        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("This setup link has expired!");
        }

        User user = token.getUser();

        // Set password + enable account
        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        user.setEnabled(true);
        userRepository.save(user);

        // Mark token used
        token.setUsedAt(LocalDateTime.now());
        tokenRepository.save(token);
    }

    private String sha256Hex(String raw) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(raw.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 not available", e);
        }
    }
}
