package com.techfree.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;
import java.util.List;

import com.techfree.dto.AtualizarStatusCandidaturaDTO;
import com.techfree.dto.CandidaturaRequestDTO;
import com.techfree.dto.CandidaturaResponseDTO;
import com.techfree.service.CandidaturaService;

@RestController
@RequestMapping("/candidaturas")
public class CandidaturaController {
    @Autowired
    private CandidaturaService candidaturaService;

    @PostMapping
    @PreAuthorize("hasRole('FREELANCER')")
    public ResponseEntity<CandidaturaResponseDTO> criar(
        @RequestBody CandidaturaRequestDTO dto,
        Authentication auth) {

        var candidatura = candidaturaService.criarCandidatura(dto, auth.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(new CandidaturaResponseDTO(candidatura));
    }

    @GetMapping
    @PreAuthorize("hasRole('FREELANCER')")
    public ResponseEntity<List<CandidaturaResponseDTO>> listar(Authentication auth) {
        var candidaturas = candidaturaService.listarPorFreelancer(auth.getName());
        var dtos = candidaturas.stream().map(CandidaturaResponseDTO::new).toList();
        return ResponseEntity.ok(dtos);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('FREELANCER')")
    public ResponseEntity<Void> deletar(@PathVariable Long id, Authentication auth) {
        candidaturaService.deletar(id, auth.getName());
        return ResponseEntity.noContent().build();
    }


    // EMPRESA: ver candidaturas de um projeto
    @GetMapping("/projeto/{id}")
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<List<CandidaturaResponseDTO>> listarPorProjeto(
        @PathVariable Long id,
        Authentication auth) {

        var candidaturas = candidaturaService.listarPorProjeto(id, auth.getName());
        var dtos = candidaturas.stream().map(CandidaturaResponseDTO::new).toList();
        return ResponseEntity.ok(dtos);
    }

    // EMPRESA: aceitar ou recusar candidatura
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<Void> atualizarStatus(
        @PathVariable Long id,
        @RequestBody AtualizarStatusCandidaturaDTO dto,
        Authentication auth) {

        candidaturaService.atualizarStatus(id, dto.getStatus(), auth.getName());
        return ResponseEntity.noContent().build();
    }

}
