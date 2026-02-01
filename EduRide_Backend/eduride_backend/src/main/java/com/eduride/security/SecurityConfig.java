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
            // ─────────────────────────────────────────────
            // CORS + CSRF
            // ─────────────────────────────────────────────
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())

            // ─────────────────────────────────────────────
            // Stateless JWT authentication
            // ─────────────────────────────────────────────
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            // ─────────────────────────────────────────────
            // AUTHORIZATION RULES
            // ─────────────────────────────────────────────
            .authorizeHttpRequests(auth -> auth

                // 1️⃣ PREFLIGHT & SWAGGER
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()

                // 2️⃣ AUTH & SIGNUP
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/*/signup").permitAll()

                // 3️⃣ PROFILE (/me)
                .requestMatchers("/api/*/me")
                .hasAnyRole("STUDENT", "SCHOOL", "AGENCY", "DRIVER", "HELPER")

                // 4️⃣ PUBLIC DROPDOWNS
                .requestMatchers(HttpMethod.GET, "/api/agencies").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/schools").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/buses").permitAll()

                // 5️⃣ DASHBOARDS
                .requestMatchers("/api/schools/dashboard/**").hasRole("SCHOOL")
                .requestMatchers("/api/agencies/dashboard/**").hasRole("AGENCY")
                .requestMatchers("/api/drivers/dashboard/**").hasRole("DRIVER")

                // 6️⃣ STUDENTS
             // 6️⃣ STUDENTS

             // School-only: own students
             .requestMatchers(HttpMethod.GET, "/api/students/school/me")
             .hasRole("SCHOOL")

             // Read students
             .requestMatchers(HttpMethod.GET, "/api/students/**")
             .hasAnyRole("SCHOOL", "AGENCY")

             // Update students
//             .requestMatchers(HttpMethod.PUT, "/api/students/**")
//             .hasAnyRole("STUDENT", "SCHOOL", "AGENCY")

             // Other student APIs
             .requestMatchers(HttpMethod.GET, "/api/students/*")
             .hasAnyRole("STUDENT", "SCHOOL", "AGENCY")

             .requestMatchers(HttpMethod.GET, "/api/students")
             .hasAnyRole("SCHOOL", "AGENCY")



                // 7️⃣ SCHOOLS
                .requestMatchers("/api/schools/agency/**").hasRole("AGENCY")
                .requestMatchers("/api/schools/**").hasRole("SCHOOL")

                // 8️⃣ AGENCY
                .requestMatchers(HttpMethod.GET, "/api/agencies/schools")
                .hasRole("AGENCY")
                .requestMatchers(HttpMethod.PUT, "/api/agencies/schools/*/release")
                .hasRole("AGENCY")
                .requestMatchers("/api/agencies/**").hasRole("AGENCY")

                // ─────────────────────────────────────────────
                // 9️⃣ DRIVERS  🔴 ORDER IS CRITICAL
                // ─────────────────────────────────────────────

                // ✅ DELETE driver → ONLY AGENCY
                // MUST come BEFORE generic /api/drivers/**
                .requestMatchers(HttpMethod.DELETE, "/api/drivers/**")
                .hasRole("AGENCY")

                // Agency-specific driver APIs
                .requestMatchers("/api/drivers/agency/**")
                .hasRole("AGENCY")

                // Driver self profile
                .requestMatchers("/api/drivers/me")
                .hasRole("DRIVER")

                // General driver access (GET / PUT)
                .requestMatchers("/api/drivers/**")
                .hasAnyRole("AGENCY", "DRIVER")

                // 🔟 HELPERS
             // 🔟 HELPERS (EDIT – SCHOOL / AGENCY ONLY)
             // 🔟 HELPERS

             // Helper: view assigned students
             .requestMatchers(HttpMethod.GET, "/api/helpers/students")
             .hasRole("HELPER")

             // Helper: mark student status
             .requestMatchers(HttpMethod.POST, "/api/helpers/student-status")
             .hasRole("HELPER")

             // Edit helper (School / Agency)
             .requestMatchers(HttpMethod.GET, "/api/helpers/*/edit")
             .hasAnyRole("SCHOOL", "AGENCY")

             // Generic helper access
             .requestMatchers("/api/helpers/**", "/api/bus-helpers/**")
             .hasAnyRole("AGENCY", "SCHOOL", "HELPER")


                // ─────────────────────────────────────────────
                // 1️⃣1️⃣ BUSES  ✅ FIXED SECTION
                // ─────────────────────────────────────────────

                // ✅ School can access its own buses
             // ✅ School + Agency can assign helper
                .requestMatchers(HttpMethod.PUT, "/api/buses/*/assign-helper/*")
                .hasAnyRole("SCHOOL", "AGENCY")

                // ❌ Agency-only for all other PUTs
                .requestMatchers(HttpMethod.PUT, "/api/buses/**")
                .hasRole("AGENCY")

                .requestMatchers(HttpMethod.GET, "/api/buses/school/**")
                .hasRole("SCHOOL")

                // ✅ Agency + School can READ buses
                .requestMatchers(HttpMethod.GET, "/api/buses/**")
                .hasAnyRole("AGENCY", "SCHOOL")

                // ❌ PROBLEMATIC RULE (COMMENTED — DO NOT REMOVE)
                // This rule was blocking SCHOOL access to /api/buses/school/me
                // .requestMatchers("/api/buses/**")
                // .hasRole("AGENCY")

                // ✅ FIX: Agency-only for WRITE operations
                .requestMatchers(HttpMethod.POST, "/api/buses/**")
                .hasRole("AGENCY")

                .requestMatchers(HttpMethod.PUT, "/api/buses/**")
                .hasRole("AGENCY")

                .requestMatchers(HttpMethod.DELETE, "/api/buses/**")
                .hasRole("AGENCY")

                // 1️⃣2️⃣ STUDENT STATUS
//                .requestMatchers("/api/student-status/**")
//                .hasAnyRole("AGENCY", "SCHOOL", "STUDENT", "HELPER")
                .requestMatchers("/api/student-status/**")
                .authenticated()
                
             // 1️⃣4️⃣ FEEDBACK (STUDENT ONLY)
                .requestMatchers(HttpMethod.POST, "/api/feedback")
                .hasAnyRole("STUDENT", "DRIVER", "HELPER", "SCHOOL", "AGENCY")




                // 1️⃣3️⃣ EVERYTHING ELSE
                .anyRequest().authenticated()
            );

        // JWT FILTER
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // ─────────────────────────────────────────────
    // CORS CONFIG
    // ─────────────────────────────────────────────
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

    // ─────────────────────────────────────────────
    // PASSWORD ENCODER
    // ─────────────────────────────────────────────
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    // ─────────────────────────────────────────────
    // AUTH MANAGER
    // ─────────────────────────────────────────────
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config
    ) throws Exception {
        return config.getAuthenticationManager();
    }
}
