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
import com.techfree.dto.AtualizarLinkDTO;

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

    @GetMapping("/listar-abertos-empresa")
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<List<ProjetoResponseDTO>> listarProjetosAbertos(Authentication auth) {
        List<Projeto> projetos = projetoService.listarTodosAbertosEmpresa(auth.getName());
        List<ProjetoResponseDTO> dtos = projetos.stream()
            .map(ProjetoResponseDTO::new)
            .toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/listar-em-andamento-empresa")
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<List<ProjetoResponseDTO>> listarProjetosEmAndamento(Authentication auth) {
        List<Projeto> projetos = projetoService.listarTodosEmAndamentoEmpresa(auth.getName());
        List<ProjetoResponseDTO> dtos = projetos.stream()
            .map(ProjetoResponseDTO::new)
            .toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/listar-concluido-empresa")
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<List<ProjetoResponseDTO>> listarProjetosConcluidos(Authentication auth) {
        List<Projeto> projetos = projetoService.listarTodosConcluidosEmpresa(auth.getName());
        List<ProjetoResponseDTO> dtos = projetos.stream()
            .map(ProjetoResponseDTO::new)
            .toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/listar-abertos-freelancer")
    @PreAuthorize("hasRole('FREELANCER')")
    public ResponseEntity<List<ProjetoResponseDTO>> listarProjetosParaFreelancer(Authentication auth) {
        List<Projeto> projetos = projetoService.listarTodosAbertos();
        List<ProjetoResponseDTO> dtos = projetos.stream()
            .map(ProjetoResponseDTO::new)
            .toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/listar-em-andamento-freelancer")
    @PreAuthorize("hasRole('FREELANCER')")
    public ResponseEntity<List<ProjetoResponseDTO>> listarProjetosEmAndamentoParaFreelancer(Authentication auth) {
        List<Projeto> projetos = projetoService.listarTodosEmAndamentoFreelancer(auth.getName());
        List<ProjetoResponseDTO> dtos = projetos.stream()
            .map(ProjetoResponseDTO::new)
            .toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/listar-concluido-freelancer")
    @PreAuthorize("hasRole('FREELANCER')")
    public ResponseEntity<List<ProjetoResponseDTO>> listarProjetosConcluidoParaFreelancer(Authentication auth) {
        List<Projeto> projetos = projetoService.listarTodosConcluidoFreelancer(auth.getName());
        List<ProjetoResponseDTO> dtos = projetos.stream()
            .map(ProjetoResponseDTO::new)
            .toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/listar-cancelados-freelancer")
    @PreAuthorize("hasRole('FREELANCER')")
    public ResponseEntity<List<ProjetoResponseDTO>> listarProjetosCanceladosParaFreelancer(Authentication auth) {
        List<Projeto> projetos = projetoService.listarTodosCanceladorFreelancer(auth.getName());
        List<ProjetoResponseDTO> dtos = projetos.stream()
            .map(ProjetoResponseDTO::new)
            .toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/listar-em-revisao-freelancer")
    @PreAuthorize("hasRole('FREELANCER')")
    public ResponseEntity<List<ProjetoResponseDTO>> listarProjetosEmRevisaoParaFreelancer(Authentication auth) {
        List<Projeto> projetos = projetoService.listarTodosEmRevisaoFreelancer(auth.getName());
        List<ProjetoResponseDTO> dtos = projetos.stream()
            .map(ProjetoResponseDTO::new)
            .toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('EMPRESA') or hasRole('FREELANCER')")
    public ResponseEntity<ProjetoResponseDTO> obterPorId(
        @PathVariable Long id,
        Authentication auth) {

        Projeto projeto = projetoService.obterPorId(id, auth.getName());
        return ResponseEntity.ok(new ProjetoResponseDTO(projeto));
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

    @PutMapping("/{id}/atualizar-link")
    @PreAuthorize("hasRole('FREELANCER')")
    public ResponseEntity<ProjetoResponseDTO> atualizarlinkhospedagem(
        @PathVariable Long id,
        @RequestBody AtualizarLinkDTO dto,
        Authentication auth) {

        Projeto projeto = projetoService.atualizarLinkHospedagem(id, dto, auth.getName());
        return ResponseEntity.ok(new ProjetoResponseDTO(projeto));
    }
    

    @PutMapping("/{id}/status/concluir")
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<ProjetoResponseDTO> atualizarStatus(
        @PathVariable Long id,
        Authentication auth) {

        Projeto projeto = projetoService.atualizarStatusProjeto(id, auth.getName());
        return ResponseEntity.ok(new ProjetoResponseDTO(projeto));
    }

    @PutMapping("/{id}/status/revisao")
    @PreAuthorize("hasRole('FREELANCER')")
    public ResponseEntity<ProjetoResponseDTO> atualizarStatusRevisao(
        @PathVariable Long id,
        Authentication auth) {

        Projeto projeto = projetoService.atualizarStatusProjetoRevisao(id, auth.getName());
        return ResponseEntity.ok(new ProjetoResponseDTO(projeto));
    }

    @PutMapping("/{id}/status/em-andamento")
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<ProjetoResponseDTO> atualizarStatusEmAndamento(
        @PathVariable Long id,
        Authentication auth) {

        Projeto projeto = projetoService.atualizarStatusProjetoEmAndamento(id, auth.getName());
        return ResponseEntity.ok(new ProjetoResponseDTO(projeto));
    }

    @PutMapping("/{id}/status/cancelar")
    @PreAuthorize("hasRole('EMPRESA') or hasRole('FREELANCER')")
    public ResponseEntity<ProjetoResponseDTO> cancelarProjeto(
        @PathVariable Long id,
        Authentication auth) {

        Projeto projeto = projetoService.cancelarProjeto(id, auth.getName());
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
