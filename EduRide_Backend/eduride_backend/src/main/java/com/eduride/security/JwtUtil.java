package com.eduride.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    // Production recommendation: Move this to application.properties or environment variable
    // For now using a strong 256-bit key (minimum for HS256)
    private static final String SECRET_KEY_STRING = "your-super-secure-secret-key-32-chars-minimum-eduride-2025-secure";
    private static final SecretKey SECRET_KEY = Keys.hmacShaKeyFor(SECRET_KEY_STRING.getBytes());

    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 24; // 24 hours (better UX than 30 min)

    /**
     * Generate JWT token with username and role (with ROLE_ prefix)
     */
    public String generateToken(String username, String roleWithPrefix) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", roleWithPrefix)  // Stored as "ROLE_SCHOOL", "ROLE_AGENCY", etc.
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Extract username (subject) from token
     */
    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    /**
     * Extract role from token (returns "ROLE_XXX" or null)
     */
    public String extractRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }

    /**
     * Validate token (signature + expiration)
     */
    public boolean isTokenValid(String token) {
        try {
            extractAllClaims(token);
            return true;
        } catch (Exception e) {
            System.out.println("DEBUG: JWT validation failed - " + e.getMessage());
            return false;
        }
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}