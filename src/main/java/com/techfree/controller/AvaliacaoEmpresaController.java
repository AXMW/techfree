package com.techfree.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;

import com.techfree.dto.AvaliacaoEmpresaRequestDTO;
import com.techfree.dto.AvaliacaoEmpresaResponseDTO;
import com.techfree.service.AvaliacaoEmpresaService;

@RestController
@RequestMapping("/avaliacoes/empresa")
@PreAuthorize("hasRole('FREELANCER')")
public class AvaliacaoEmpresaController {
    @Autowired
    private AvaliacaoEmpresaService service;

    @PostMapping
    public ResponseEntity<AvaliacaoEmpresaResponseDTO> avaliar(@RequestBody AvaliacaoEmpresaRequestDTO dto,
                                                               Authentication auth) {
        String email = auth.getName();
        return ResponseEntity.ok(service.criar(email, dto));
    }
}
