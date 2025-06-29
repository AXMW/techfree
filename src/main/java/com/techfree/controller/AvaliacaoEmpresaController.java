package com.techfree.controller;

import java.util.List;

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

import com.techfree.dto.AvaliacaoEmpresaRequestDTO;
import com.techfree.dto.AvaliacaoEmpresaResponseDTO;
import com.techfree.service.AvaliacaoEmpresaService;

@RestController
@RequestMapping("/avaliacoes/empresa")
public class AvaliacaoEmpresaController {
    @Autowired
    private AvaliacaoEmpresaService service;

    @PostMapping
    @PreAuthorize("hasRole('FREELANCER')")
    public ResponseEntity<AvaliacaoEmpresaResponseDTO> avaliar(@RequestBody AvaliacaoEmpresaRequestDTO dto,
                                                               Authentication auth) {
        String email = auth.getName();
        return ResponseEntity.ok(service.criar(email, dto));
    }

    @GetMapping("/todos-por-empresa/{id}")
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<List<AvaliacaoEmpresaResponseDTO>> obterAvaliacaoPorIdDaEmpresa(@PathVariable Long id) {
        List<AvaliacaoEmpresaResponseDTO> avaliacao = service.obterPorIdDaEmpresa(id);
        return ResponseEntity.ok(avaliacao);
    }

    @GetMapping("/todos-por-freelancer/{id}")
    @PreAuthorize("hasRole('FREELANCER')")
    public ResponseEntity<List<AvaliacaoEmpresaResponseDTO>> obterAvaliacaoPorIdDoFreelancer(@PathVariable Long id) {
        List<AvaliacaoEmpresaResponseDTO> avaliacao = service.obterPorIdDoFreelancer(id);
        return ResponseEntity.ok(avaliacao);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('FREELANCER')")
    public ResponseEntity<AvaliacaoEmpresaResponseDTO> obterAvaliacaoPorId(@PathVariable Long id) {
        AvaliacaoEmpresaResponseDTO avaliacao = service.obterPorId(id);
        return ResponseEntity.ok(avaliacao);
    }

    @GetMapping("/projeto/{id}")
    @PreAuthorize("hasRole('FREELANCER') or hasRole('EMPRESA')")
    public ResponseEntity<AvaliacaoEmpresaResponseDTO> obterAvaliacaoPorIdDoProjeto(@PathVariable Long id) {
        AvaliacaoEmpresaResponseDTO avaliacao = service.obterPorIdDoProjeto(id);
        return ResponseEntity.ok(avaliacao);
    }


}
