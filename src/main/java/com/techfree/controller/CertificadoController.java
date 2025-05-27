package com.techfree.controller;

import org.springframework.beans.factory.annotation.Autowired;
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
import java.util.List;
import org.springframework.security.core.Authentication;

import com.techfree.dto.CertificadoRequestDTO;
import com.techfree.dto.CertificadoResponseDTO;
import com.techfree.service.CertificadoService;

@RestController
@RequestMapping("/certificados")
@PreAuthorize("hasRole('FREELANCER')")
public class CertificadoController {
    @Autowired
    private CertificadoService certificadoService;

    @GetMapping
    public ResponseEntity<List<CertificadoResponseDTO>> listar(Authentication auth) {
        return ResponseEntity.ok(certificadoService.listarPorFreelancer(auth.getName()));
    }

    @PostMapping
    public ResponseEntity<CertificadoResponseDTO> criar(@RequestBody CertificadoRequestDTO dto, Authentication auth) {
        return ResponseEntity.ok(certificadoService.cadastrar(auth.getName(), dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CertificadoResponseDTO> atualizar(@PathVariable Long id,
                                                            @RequestBody CertificadoRequestDTO dto,
                                                            Authentication auth) {
        return ResponseEntity.ok(certificadoService.atualizar(id, auth.getName(), dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id, Authentication auth) {
        certificadoService.deletar(id, auth.getName());
        return ResponseEntity.noContent().build();
    }
}
