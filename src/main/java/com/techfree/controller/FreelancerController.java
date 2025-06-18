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
import com.techfree.model.ExperienciaAcademica;
import com.techfree.model.ExperienciaProfissional;
import com.techfree.repository.FreelancerRepository;
import com.techfree.model.Usuario;
import com.techfree.repository.UsuarioRepository;
import com.techfree.dto.FreelancerAutoVisualizacaoResponseDTO;

import java.security.Principal;
import java.util.ArrayList;
import java.util.Optional;

@RestController
@RequestMapping("/freelancer")
public class FreelancerController {
    private final FreelancerRepository freelancerRepository;

    private final UsuarioRepository usuarioRepository;

    public FreelancerController(FreelancerRepository freelancerRepository, UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
        this.freelancerRepository = freelancerRepository;
    }

    // FREELANCER: ver o perfil do freelancer logado
    @GetMapping("/perfil/verPerfil")
    @PreAuthorize("hasRole('FREELANCER')")
    public FreelancerAutoVisualizacaoResponseDTO verPerfil(Authentication authentication) {
        String email = authentication.getName(); // vem do JWT
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Freelancer freelancer = freelancerRepository.findByUsuario(usuario).orElseThrow(() -> new RuntimeException("Freelancer não encontrado"));

        FreelancerAutoVisualizacaoResponseDTO response = new FreelancerAutoVisualizacaoResponseDTO(freelancer);
        return response;
    }

    // FREELANCER: atualizar o perfil do freelancer logado
    @PutMapping("/perfil")
    @PreAuthorize("hasRole('FREELANCER')")
    public ResponseEntity<Freelancer> atualizarPerfil(
            Authentication authentication,
            @RequestBody FreelancerUpdateDTO dados) {

        String email = authentication.getName();

        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Freelancer freelancer = freelancerRepository.findByUsuario(usuario)
            .orElseThrow(() -> new RuntimeException("Freelancer não encontrado"));

        // Atualiza só os campos recebidos
        if (dados.getNome() != null) freelancer.setNome(dados.getNome());
        if (dados.getBio() != null) freelancer.setBio(dados.getBio());
        if (dados.getHabilidades() != null) freelancer.setHabilidades(new ArrayList<>(dados.getHabilidades()));
        if (dados.getTelefone() != null) freelancer.setTelefone(dados.getTelefone());
        if (dados.getAreaAtuacao() != null) freelancer.setAreaAtuacao(dados.getAreaAtuacao());
        if (dados.getGithub() != null) freelancer.setGithub(dados.getGithub());
        if (dados.getLinkedin() != null) freelancer.setLinkedin(dados.getLinkedin());
        if (dados.getPortfolio() != null) freelancer.setPortfolio(dados.getPortfolio());
        if (dados.getCertificados() != null) freelancer.setCertificados(new ArrayList<>(dados.getCertificados()));
        if (dados.getAvatar() != null) freelancer.setAvatar(dados.getAvatar());
        if (dados.getEmailContato() != null) freelancer.setEmailContato(dados.getEmailContato());
        if (dados.getExperiencia() != null) {
            // Limpa a lista original e adiciona os novos elementos
            freelancer.getExperiencia().clear();
            for (var dto : dados.getExperiencia()) {
                var exp = new ExperienciaProfissional();
                exp.setId(dto.getId());
                exp.setEmpresa(dto.getEmpresa());
                exp.setCargo(dto.getCargo());
                exp.setTempo(dto.getTempo());
                exp.setDescricao(dto.getDescricao());
                exp.setFreelancer(freelancer);
                freelancer.getExperiencia().add(exp);
            }
        }
        if (dados.getExperienciaAcademica() != null) {
            freelancer.getExperienciaAcademica().clear();
            for (var dto : dados.getExperienciaAcademica()) {
                var exp = new ExperienciaAcademica();
                exp.setId(dto.getId());
                exp.setInstituicao(dto.getInstituicao());
                exp.setCurso(dto.getCurso());
                exp.setPeriodo(dto.getPeriodo());
                exp.setDescricao(dto.getDescricao());
                exp.setFreelancer(freelancer);
                freelancer.getExperienciaAcademica().add(exp);
            }
        }

        freelancerRepository.save(freelancer);
        return ResponseEntity.ok(freelancer);
    }

    // FREELANCER: deletar o perfil do freelancer logado
    @DeleteMapping("/perfil")
    @PreAuthorize("hasRole('FREELANCER')")
    public ResponseEntity<Void> deletarPerfil(Authentication authentication) {
        String email = authentication.getName();

        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Freelancer freelancer = freelancerRepository.findByUsuario(usuario)
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
