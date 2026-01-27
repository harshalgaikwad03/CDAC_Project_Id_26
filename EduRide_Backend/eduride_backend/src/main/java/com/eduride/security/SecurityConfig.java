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
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // 1. Public Infrastructure & Preflight
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()

                // 2. Public Auth & Signup
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/*/signup").permitAll()

                // 3. Public Dropdowns for Registration
                .requestMatchers(HttpMethod.GET, "/api/agencies").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/schools").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/buses").permitAll()

                // 4. Dashboards (Role-Specific)
                .requestMatchers("/api/schools/dashboard/**").hasRole("SCHOOL")
                .requestMatchers("/api/agencies/dashboard/**").hasRole("AGENCY")
                
                .requestMatchers("/api/schools/agency/**").hasRole("AGENCY")
                .requestMatchers("/api/drivers/agency/**").hasRole("AGENCY")

                // 5. Critical: Helper Assignment (Allow School and Agency)
                .requestMatchers(HttpMethod.PUT, "/api/buses/*/assign-helper/*").hasAnyRole("SCHOOL", "AGENCY")

                // 6. General Role-Based Access
                
                .requestMatchers("/api/agencies/**").hasRole("AGENCY")
                .requestMatchers("/api/schools/agency/**").hasRole("AGENCY")
                .requestMatchers("/api/schools/**").hasRole("SCHOOL")
             // Drivers
                .requestMatchers("/api/drivers/agency/**").hasRole("AGENCY")
                .requestMatchers("/api/drivers/dashboard/**").hasRole("DRIVER")
                .requestMatchers("/api/drivers/**").hasAnyRole("AGENCY", "DRIVER")

                //.requestMatchers("/api/drivers/**").hasRole("DRIVER")
                .requestMatchers("/api/helpers/**", "/api/bus-helpers/**").hasAnyRole("AGENCY", "SCHOOL", "HELPER")
                .requestMatchers("/api/students/**").hasAnyRole("STUDENT", "AGENCY", "SCHOOL")
               
                // 7. Bus Access (GET is shared, other methods are Agency only)
                .requestMatchers(HttpMethod.GET, "/api/buses/agency/**").hasRole("AGENCY")
                .requestMatchers(HttpMethod.GET, "/api/buses/**").hasAnyRole("AGENCY", "SCHOOL")
                .requestMatchers("/api/buses/**").hasRole("AGENCY")

                .anyRequest().authenticated()
            );

        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

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

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}