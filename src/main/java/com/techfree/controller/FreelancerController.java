package com.techfree.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;

import com.techfree.dto.FreelancerUpdateDTO;
import com.techfree.dto.FreelancerVisualizacaoResponseDTO;
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

    // FREELANCER: ver o perfil do freelancer logado
    @GetMapping("/perfil/verPerfil")
    @PreAuthorize("hasRole('FREELANCER')")
    public Freelancer verPerfil(Authentication authentication) {
        String email = authentication.getName(); // vem do JWT

        Optional<Freelancer> freelancer = freelancerRepository.findByEmail(email);
        return freelancer.orElseThrow(() -> new RuntimeException("Freelancer não encontrado"));
    }

    // FREELANCER: atualizar o perfil do freelancer logado
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
        if (dados.getTecnologias() != null) freelancer.setTecnologias(dados.getTecnologias());
        if (dados.getTelefone() != null) freelancer.setTelefone(dados.getTelefone());
        if (dados.getAreaAtuacao() != null) freelancer.setAreaAtuacao(dados.getAreaAtuacao());
        if (dados.getGithub() != null) freelancer.setGithub(dados.getGithub());
        if (dados.getLinkedin() != null) freelancer.setLinkedin(dados.getLinkedin());
        if (dados.getPortfolio() != null) freelancer.setPortfolio(dados.getPortfolio());
        if(dados.getHabilidades() != null) freelancer.setHabilidades(dados.getHabilidades());

        freelancerRepository.save(freelancer);
        return ResponseEntity.ok(freelancer);
    }

    // FREELANCER: deletar o perfil do freelancer logado
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

    // EMPRESA: ver o perfil do freelancer por ID
    @GetMapping("/perfil/{id}")
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<FreelancerVisualizacaoResponseDTO> verPerfilPorId(@PathVariable Long id) {
        Optional<Freelancer> freelancer = freelancerRepository.findById(id);
        if (freelancer.isEmpty()) {
            throw new RuntimeException("Freelancer não encontrado com ID: " + id);
        }
        FreelancerVisualizacaoResponseDTO response = new FreelancerVisualizacaoResponseDTO(freelancer.get());
        return ResponseEntity.ok(response);
    }
}
