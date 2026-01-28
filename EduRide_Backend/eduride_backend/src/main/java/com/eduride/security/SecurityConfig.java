package com.eduride.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth

                // ─── 1. PREFLIGHT & PUBLIC INFRA ─────────────────────────────
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()

                // ─── 2. AUTH & SIGNUP ───────────────────────────────────────
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/*/signup").permitAll()

                // ─── 3. LOGGED-IN PROFILE (VERY IMPORTANT: MUST BE EARLY) ───
                .requestMatchers("/api/*/me")
                .hasAnyRole("STUDENT", "SCHOOL", "AGENCY", "DRIVER", "HELPER")

                // ─── 4. PUBLIC DROPDOWNS FOR REGISTRATION ──────────────────
                .requestMatchers(HttpMethod.GET, "/api/agencies").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/schools").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/buses").permitAll()

                // ─── 5. DASHBOARDS ─────────────────────────────────────────
                .requestMatchers("/api/schools/dashboard/**").hasRole("SCHOOL")
                .requestMatchers("/api/agencies/dashboard/**").hasRole("AGENCY")
                .requestMatchers("/api/drivers/dashboard/**").hasRole("DRIVER")

                // ─── 6. AGENCY-SPECIFIC ────────────────────────────────────
                .requestMatchers("/api/agencies/**").hasRole("AGENCY")
                .requestMatchers("/api/schools/agency/**").hasRole("AGENCY")
                .requestMatchers("/api/drivers/agency/**").hasRole("AGENCY")

                // ─── 7. SCHOOL-SPECIFIC ────────────────────────────────────
                .requestMatchers("/api/schools/**").hasRole("SCHOOL")

                // ─── 8. DRIVER ACCESS ──────────────────────────────────────
                .requestMatchers("/api/drivers/**")
                .hasAnyRole("AGENCY", "DRIVER")

                // ─── 9. HELPER ACCESS ──────────────────────────────────────
                .requestMatchers("/api/helpers/**", "/api/bus-helpers/**")
                .hasAnyRole("AGENCY", "SCHOOL", "HELPER")

                // ─── 10. STUDENT ACCESS ────────────────────────────────────
                .requestMatchers("/api/students/**")
                .hasAnyRole("STUDENT", "AGENCY", "SCHOOL")

                // ─── 11. BUS ACCESS ────────────────────────────────────────
                .requestMatchers(HttpMethod.GET, "/api/buses/agency/**")
                .hasRole("AGENCY")

                .requestMatchers(HttpMethod.GET, "/api/buses/**")
                .hasAnyRole("AGENCY", "SCHOOL")

                .requestMatchers("/api/buses/**")
                .hasRole("AGENCY")

                // ─── 12. STUDENT STATUS (CRITICAL FOR HELPER RELOAD) ───────
                .requestMatchers("/api/student-status/**")
                .hasAnyRole("AGENCY", "SCHOOL", "STUDENT", "HELPER")

                // ─── 13. EVERYTHING ELSE ──────────────────────────────────
                .anyRequest().authenticated()
            );

        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    // ─── CORS CONFIG ────────────────────────────────────────────────────
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    // ─── PASSWORD ENCODER ───────────────────────────────────────────────
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    // ─── AUTH MANAGER ───────────────────────────────────────────────────
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config
    ) throws Exception {
        return config.getAuthenticationManager();
    }
}
