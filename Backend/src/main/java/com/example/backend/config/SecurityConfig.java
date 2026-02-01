package com.example.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // For now (testing with Postman), disable CSRF
                .csrf(csrf -> csrf.disable())

                // Authorization rules
                .authorizeHttpRequests(auth -> auth
                        // ✅ Public endpoints
                        .requestMatchers(
                                "/api/v1/pharmacies/register",
                                "/swagger-ui/**",
                                "/v3/api-docs/**"
                        ).permitAll()

                        // ✅ Admin endpoints (protected)
                        .requestMatchers("/api/v1/admin/**").authenticated()

                        // Everything else: require login
                        .anyRequest().authenticated()
                )

                // Enable basic login (simple for Postman testing now)
                .httpBasic(Customizer.withDefaults());

        return http.build();
    }
}
