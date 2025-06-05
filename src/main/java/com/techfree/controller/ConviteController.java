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

import com.techfree.dto.ConviteRequestDTO;
import com.techfree.service.ConviteService;

@RestController
@RequestMapping("/convites")
public class ConviteController {
    @Autowired
    private ConviteService conviteService;

    @PostMapping
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<Void> criar(
        @RequestBody ConviteRequestDTO dto,
        Authentication auth) {

        conviteService.criarConvite(dto, auth.getName());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/freelancer")
    @PreAuthorize("hasRole('FREELANCER')")
    public ResponseEntity<List<ConviteRequestDTO>> listarPorFreelancer(Authentication auth) {
        var convites = conviteService.listarPorFreelancer(auth.getName());
        var dtos = convites.stream().map(ConviteRequestDTO::new).toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/empresa")
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<List<ConviteRequestDTO>> listarPorEmpresa(Authentication auth) {
        var convites = conviteService.listarPorEmpresa(auth.getName());
        var dtos = convites.stream().map(ConviteRequestDTO::new).toList();
        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/{id}/aceitar")
    @PreAuthorize("hasRole('FREELANCER')")
    public ResponseEntity<Void> aceitarConvite(@PathVariable Long id, Authentication auth) {
        conviteService.aceitarConvite(id, auth.getName());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/recusar")
    @PreAuthorize("hasRole('FREELANCER')")
    public ResponseEntity<Void> recusarConvite(@PathVariable Long id, Authentication auth) {
        conviteService.recusarConvite(id, auth.getName());
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<Void> deletar(@PathVariable Long id, Authentication auth) {
        conviteService.deletar(id, auth.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/projeto/{id}")
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<List<ConviteRequestDTO>> listarPorProjeto(
        @PathVariable Long id,
        Authentication auth) {

        var convites = conviteService.listarPorProjeto(id, auth.getName());
        var dtos = convites.stream().map(ConviteRequestDTO::new).toList();
        return ResponseEntity.ok(dtos);
    }
}
