package com.eduride.service;

import com.eduride.entity.User;
import com.eduride.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Autowired
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "User not found with email: " + email));

        // Ensure role exists (safety check)
        if (user.getRole() == null) {
            throw new IllegalStateException("User has no role assigned: " + email);
        }

        // Convert role enum to Spring Security authority with "ROLE_" prefix
        String roleWithPrefix = "ROLE_" + user.getRole().name();

        // Debug log (remove in production or use proper logging)
        System.out.println("DEBUG: Loading user: " + email + " → Role: " + roleWithPrefix);

        List<SimpleGrantedAuthority> authorities = List.of(
                new SimpleGrantedAuthority(roleWithPrefix)
        );

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                user.isActive(),           // accountEnabled
                true,                      // accountNonExpired
                true,                      // credentialsNonExpired
                true,                      // accountNonLocked
                authorities
        );
    }
}