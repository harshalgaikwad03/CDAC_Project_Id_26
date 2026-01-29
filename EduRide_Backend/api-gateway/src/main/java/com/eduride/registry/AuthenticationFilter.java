package com.eduride.registry;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.stereotype.Component;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpMethod;

@Component
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {

    public AuthenticationFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();

            // DEBUG LOG: Tells you exactly what is hitting the Gateway
            System.out.println("GATEWAY REQUEST: " + request.getMethod() + " " + request.getPath());

            // 1. BYPASS OPTIONS (PRE-FLIGHT) REQUESTS
            // Fixes the 403 error by letting the browser ask "Can I connect?"
            if (request.getMethod() == HttpMethod.OPTIONS) {
                return chain.filter(exchange);
            }

            // 2. CHECK HEADER
            if (!request.getHeaders().containsKey("Authorization")) {
                System.out.println("❌ Blocked: No Authorization Header");
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete(); 
            }

            // 3. CHECK TOKEN
            String token = request.getHeaders().getOrEmpty("Authorization").get(0);
            if (!"secret123".equals(token)) {
                System.out.println("❌ Blocked: Invalid Token");
                exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                return exchange.getResponse().setComplete(); 
            }

            // 4. Success
            System.out.println("✅ Allowed: Valid Token");
            return chain.filter(exchange);
        };
    }

    public static class Config {
    }
}