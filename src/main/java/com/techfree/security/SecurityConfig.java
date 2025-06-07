package com.techfree.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/auth/**",
                    "/css/**",
                    "/js/**",
                    "/favicon.ico",
                    "/images/**",
                    "/assets/**",
                    "/login",
                    "/signup",
                    //"/dashboard",
                    "/resetPassword1.html",
                    "/resetPassword2.html",
                    "/inicio",
                    "/faq",
                    "/",
                    "/**"
                ).permitAll()
                .requestMatchers("/empresa/**").hasRole("EMPRESA")
                .requestMatchers("/freelancer/**").hasRole("FREELANCER")
                .requestMatchers("/certificados/**").hasRole("FREELANCER")
                .requestMatchers("/projetos/**").hasRole("EMPRESA")
                .requestMatchers("/avaliacoes/freelancer/**").hasRole("EMPRESA")
                .requestMatchers("/avaliacoes/empresa/**").hasRole("FREELANCER")
                .requestMatchers("/projetos/selecionar-freelancer").hasRole("EMPRESA")
                .requestMatchers("/roles/**").permitAll()
                .requestMatchers("/dashboard").hasRole("FREELANCER")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}