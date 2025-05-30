package com.techfree.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;

import com.techfree.dto.FreelancerUpdateDTO;
import com.techfree.model.Freelancer;
import com.techfree.repository.FreelancerRepository;

import java.security.Principal;
import java.util.Optional;

@RestController
@RequestMapping("/freelancer")
public class FreelancerController {
    private final FreelancerRepository freelancerRepository;

    public FreelancerController(FreelancerRepository freelancerRepository) {
        this.freelancerRepository = freelancerRepository;
    }

    @GetMapping("/perfil/verPerfil")
    @PreAuthorize("hasRole('FREELANCER')")
    public Freelancer verPerfil(Authentication authentication) {
        String email = authentication.getName(); // vem do JWT

        Optional<Freelancer> freelancer = freelancerRepository.findByEmail(email);
        return freelancer.orElseThrow(() -> new RuntimeException("Freelancer não encontrado"));
    }

    @PutMapping("/perfil")
    @PreAuthorize("hasRole('FREELANCER')")
    public ResponseEntity<Freelancer> atualizarPerfil(
            Authentication authentication,
            @RequestBody FreelancerUpdateDTO dados) {

        String email = authentication.getName();
        Freelancer freelancer = freelancerRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Freelancer não encontrado"));

        // Atualiza só os campos recebidos
        if (dados.getNome() != null) freelancer.setNome(dados.getNome());
        if (dados.getBio() != null) freelancer.setBio(dados.getBio());
        if (dados.getHabilidades() != null) freelancer.setHabilidades(dados.getHabilidades());

        freelancerRepository.save(freelancer);
        return ResponseEntity.ok(freelancer);
    }

    @DeleteMapping("/perfil")
    @PreAuthorize("hasRole('FREELANCER')")
    public ResponseEntity<Void> deletarPerfil(Authentication authentication) {
        String email = authentication.getName();
        Freelancer freelancer = freelancerRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Freelancer não encontrado"));

        freelancerRepository.delete(freelancer);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/me")
    public String getMe(Principal principal) {
        return "Usuário logado: " + principal.getName();
    }

    @GetMapping("/perfil")
    public String getPerfil(Authentication authentication) {
        String email = authentication.getName();
        var roles = authentication.getAuthorities();

        return "Email: " + email + ", Roles: " + roles.toString();
    }
}
