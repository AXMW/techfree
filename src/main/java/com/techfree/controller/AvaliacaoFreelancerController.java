package com.techfree.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;

import com.techfree.dto.AvaliacaoFreelancerRequestDTO;
import com.techfree.dto.AvaliacaoFreelancerResponseDTO;
import com.techfree.service.AvaliacaoFreelancerService;

@RestController
@RequestMapping("/avaliacoes/freelancer")
@PreAuthorize("hasRole('EMPRESA')")
public class AvaliacaoFreelancerController {
    @Autowired
    private AvaliacaoFreelancerService service;

    @PostMapping
    public ResponseEntity<AvaliacaoFreelancerResponseDTO> avaliar(@RequestBody AvaliacaoFreelancerRequestDTO dto,
                                                                  Authentication auth) {
        String email = auth.getName();
        return ResponseEntity.ok(service.criar(email, dto));
    }
}
