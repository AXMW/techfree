package com.techfree.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;
import java.util.List;
import java.util.Optional;

import com.techfree.dto.ConviteRequestDTO;
import com.techfree.dto.ConviteResponseDTO;
import com.techfree.service.ConviteService;
import com.techfree.repository.FreelancerRepository;
import com.techfree.model.Freelancer;

@RestController
@RequestMapping("/convites")
public class ConviteController {
    @Autowired
    private ConviteService conviteService;

    @Autowired
    private FreelancerRepository freelancerRepository;

    // EMPRESA: criar um convite pra um freelancer
    @PostMapping
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<Void> criar(
        @RequestBody ConviteRequestDTO dto,
        Authentication auth) {

        Optional<Freelancer> optionalFreelancer = freelancerRepository.findById(dto.getFreelancerId());

        Freelancer freelancer = optionalFreelancer.orElseThrow(() -> 
            new RuntimeException("Freelancer não encontrado com ID: " + dto.getFreelancerId()));
        conviteService.criarConvite(dto, freelancer.getUsuario().getEmail());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // FREELANCER: ver os convites recebidos
    @GetMapping("/freelancer")
    @PreAuthorize("hasRole('FREELANCER')")
    public ResponseEntity<List<ConviteResponseDTO>> listarPorFreelancer(Authentication auth) {
        var convites = conviteService.listarPorFreelancer(auth.getName());
        var dtos = convites.stream().map(ConviteResponseDTO::new).toList();
        return ResponseEntity.ok(dtos);
    }

    // EMPRESA: ver os convites enviados
    @GetMapping("/empresa")
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<List<ConviteResponseDTO>> listarPorEmpresa(Authentication auth) {
        var convites = conviteService.listarPorEmpresa(auth.getName());
        var dtos = convites.stream().map(ConviteResponseDTO::new).toList();
        return ResponseEntity.ok(dtos);
    }

    // EMPRESA: deletar um convite
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<Void> deletar(@PathVariable Long id, Authentication auth) {
        conviteService.deletar(id, auth.getName());
        return ResponseEntity.noContent().build();
    }

    // EMPRESA: listar convites de um projeto específico
    @GetMapping("/projeto/{id}")
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<List<ConviteResponseDTO>> listarPorProjeto(
        @PathVariable Long id,
        Authentication auth) {

        var convites = conviteService.listarPorProjeto(id, auth.getName());
        var dtos = convites.stream().map(ConviteResponseDTO::new).toList();
        return ResponseEntity.ok(dtos);
    }
}
