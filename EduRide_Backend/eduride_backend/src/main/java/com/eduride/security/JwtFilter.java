package com.eduride.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.eduride.service.CustomUserDetailsService;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain)
            throws ServletException, IOException {

        String path = request.getServletPath();
        System.out.println("DEBUG: Request received for path: " + path);

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            chain.doFilter(request, response);
            return;
        }

        // Skip public endpoints
        if (path.startsWith("/api/auth") ||
            path.equals("/api/agencies/signup") ||
            path.equals("/api/drivers/signup") ||
            path.equals("/api/students/signup") ||
            path.equals("/api/schools/signup") ||
            path.equals("/api/bus-helpers/signup") ||
            path.equals("/api/helpers/signup")) {
            chain.doFilter(request, response);
            return;
        }

        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            if (jwtUtil.isTokenValid(token)) {
                String username = jwtUtil.extractUsername(token);
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                // ── DEBUG: show what authorities are actually set ──
                System.out.println("DEBUG: Authenticated user: " + username);
                System.out.println("DEBUG: Authorities: " + userDetails.getAuthorities());

                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );
                SecurityContextHolder.getContext().setAuthentication(auth);
            } else {
                System.out.println("DEBUG: Invalid JWT token for path: " + path);
            }
        } else {
            System.out.println("DEBUG: No Authorization header for path: " + path);
        }

        chain.doFilter(request, response);
    }
}