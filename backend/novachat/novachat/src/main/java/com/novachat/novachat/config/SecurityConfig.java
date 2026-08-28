package com.novachat.novachat.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

	private final CorsConfigurationSource corsConfigurationSource;
	private final JwtAuthenticationFilter jwtAuthenticationFilter;

	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.csrf(csrf -> csrf.disable()).cors(cors -> cors.configurationSource(corsConfigurationSource))
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.exceptionHandling(
						exception -> exception.authenticationEntryPoint((request, response, authException) -> {
							response.setStatus(HttpStatus.UNAUTHORIZED.value());
							response.setContentType("application/json");
							response.getWriter().write("""
									{
									                   "status": 401,
									                   "error": "Unauthorized",
									                   "message": "Authentication is required",
									                   "path": "%s"
									               }
									""".formatted(request.getRequestURI()));
						}).accessDeniedHandler((request, response, accessDeniedException) -> {
							response.setStatus(HttpStatus.FORBIDDEN.value());
							response.setContentType("application/json");
							response.getWriter().write("""
									{
									                   "status": 403,
									                   "error": "Forbidden",
									                   "message": "You do not have permission to access this resource",
									                   "path": "%s"
									               }
									""".formatted(request.getRequestURI()));
						}))
				.authorizeHttpRequests(
						auth -> auth
								.requestMatchers("/api/health", "/api/auth/login", "/api/auth/refresh",
										"/api/users/register", "/api/auth/logout")
								.permitAll().anyRequest().authenticated())
				.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
		return http.build();
	}
}
