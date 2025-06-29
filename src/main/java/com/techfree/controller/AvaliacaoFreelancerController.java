package com.techfree.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

import com.techfree.dto.AvaliacaoFreelancerRequestDTO;
import com.techfree.dto.AvaliacaoFreelancerResponseDTO;
import com.techfree.service.AvaliacaoFreelancerService;

@RestController
@RequestMapping("/avaliacoes/freelancer")
public class AvaliacaoFreelancerController {
    @Autowired
    private AvaliacaoFreelancerService service;

    @PostMapping
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<AvaliacaoFreelancerResponseDTO> avaliar(@RequestBody AvaliacaoFreelancerRequestDTO dto,
                                                                  Authentication auth) {
        String email = auth.getName();
        return ResponseEntity.ok(service.criar(email, dto));
    }

    @GetMapping("/todos-por-freelancer/{id}")
    @PreAuthorize("hasRole('FREELANCER')")
    public ResponseEntity<List<AvaliacaoFreelancerResponseDTO>> obterAvaliacaoPorIdDoFreelancer(@PathVariable Long id) {
        List<AvaliacaoFreelancerResponseDTO> avaliacao = service.obterPorIdDoFreelancer(id);
        return ResponseEntity.ok(avaliacao);
    }

    @GetMapping("/todos-por-empresa/{id}")
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<List<AvaliacaoFreelancerResponseDTO>> obterAvaliacaoPorIdDaEmpresa(@PathVariable Long id) {
        List<AvaliacaoFreelancerResponseDTO> avaliacao = service.obterPorIdDaEmpresa(id);
        return ResponseEntity.ok(avaliacao);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<AvaliacaoFreelancerResponseDTO> obterAvaliacaoPorId(@PathVariable Long id) {
        AvaliacaoFreelancerResponseDTO avaliacao = service.obterPorId(id);
        return ResponseEntity.ok(avaliacao);
    }

    @GetMapping("/projeto/{id}")
    @PreAuthorize("hasRole('EMPRESA') or hasRole('FREELANCER')")
    public ResponseEntity<AvaliacaoFreelancerResponseDTO> obterAvaliacaoPorIdDoProjeto(@PathVariable Long id) {
        AvaliacaoFreelancerResponseDTO avaliacao = service.obterPorIdDoProjeto(id);
        return ResponseEntity.ok(avaliacao);
    }
}
