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

import com.techfree.dto.ProjetoFiltroDTO;
import com.techfree.dto.ProjetoRequestDTO;
import com.techfree.dto.ProjetoResponseDTO;
import com.techfree.dto.SelecionarFreelancerRequestDTO;
import com.techfree.model.Projeto;
import com.techfree.service.ProjetoService;

@RestController
@RequestMapping("/projetos")
public class ProjetoController {
    @Autowired
    private ProjetoService projetoService;

    @PostMapping
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<ProjetoResponseDTO> criar(
        @RequestBody ProjetoRequestDTO dto,
        Authentication auth) {

        Projeto projeto = projetoService.criarProjeto(dto, auth.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(new ProjetoResponseDTO(projeto));
    }

    @GetMapping
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<List<ProjetoResponseDTO>> listar(Authentication auth) {
        List<Projeto> projetos = projetoService.listarPorEmpresa(auth.getName());
        List<ProjetoResponseDTO> dtos = projetos.stream()
            .map(ProjetoResponseDTO::new)
            .toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/listar")
    @PreAuthorize("hasRole('FREELANCER')")
    public ResponseEntity<List<ProjetoResponseDTO>> listarProjetosParaFreelancer(Authentication auth) {
        List<Projeto> projetos = projetoService.listarTodosAbertos();
        List<ProjetoResponseDTO> dtos = projetos.stream()
            .map(ProjetoResponseDTO::new)
            .toList();
        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<ProjetoResponseDTO> atualizar(
        @PathVariable Long id,
        @RequestBody ProjetoRequestDTO dto,
        Authentication auth) {

        Projeto projeto = projetoService.atualizarProjeto(id, dto, auth.getName());
        return ResponseEntity.ok(new ProjetoResponseDTO(projeto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<Void> deletar(
        @PathVariable Long id,
        Authentication auth) {

        projetoService.deletarProjeto(id, auth.getName());
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('EMPRESA')")
    @PostMapping("/selecionar-freelancer")
    public ResponseEntity<?> selecionarFreelancer(@RequestBody SelecionarFreelancerRequestDTO dto,
                                                Authentication auth) {
        String email = auth.getName();
        projetoService.selecionarFreelancer(email, dto);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/filtrar")
    public ResponseEntity<List<Projeto>> filtrarProjetos(@RequestBody ProjetoFiltroDTO filtro) {
        List<Projeto> projetos = projetoService.filtrarProjetos(filtro);
        return ResponseEntity.ok(projetos);
    }
}
