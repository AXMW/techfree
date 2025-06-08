package com.techfree.controller;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.techfree.model.Projeto;
import com.techfree.model.Empresa;
import com.techfree.model.AvaliacaoEmpresa;
import com.techfree.repository.EmpresaRepository;
import com.techfree.repository.ProjetoRepository;
import com.techfree.repository.AvaliacaoEmpresaRepository;
import com.techfree.service.ProjetoService;

@RestController
@RequestMapping("/empresa")
public class EmpresaController {

    private final EmpresaRepository empresaRepository;
    private final ProjetoRepository projetoRepository;
    private final AvaliacaoEmpresaRepository avaliacaoEmpresaRepository;
    private final ProjetoService projetoService;

    public EmpresaController(
            ProjetoService projetoService,
            EmpresaRepository empresaRepository,
            ProjetoRepository projetoRepository,
            AvaliacaoEmpresaRepository avaliacaoEmpresaRepository) {
        this.projetoService = projetoService;
        this.empresaRepository = empresaRepository;
        this.projetoRepository = projetoRepository;
        this.avaliacaoEmpresaRepository = avaliacaoEmpresaRepository;
    }

    @GetMapping("/perfil/verPerfil")
    @PreAuthorize("hasRole('EMPRESA')")
    public Empresa verPerfil(Authentication authentication) {
        String email = authentication.getName();
        return empresaRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Empresa não encontrada"));
    }

    @PutMapping("/perfil")
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<Empresa> atualizarPerfil(
            Authentication authentication,
            @RequestBody Empresa dadosAtualizados) {

        String email = authentication.getName();
        Empresa empresa = empresaRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Empresa não encontrada"));

        // atualiza os campos (exemplo)
        if(dadosAtualizados.getRazaoSocial() != null) empresa.setRazaoSocial(dadosAtualizados.getRazaoSocial());
        
        if(dadosAtualizados.getNomeFantasia() != null) empresa.setNomeFantasia(dadosAtualizados.getNomeFantasia());
        if(dadosAtualizados.getTelefone() != null) empresa.setTelefone(dadosAtualizados.getTelefone());
        if(dadosAtualizados.getBio() != null) empresa.setBio(dadosAtualizados.getBio());
        if(dadosAtualizados.getSite() != null) empresa.setSite(dadosAtualizados.getSite());
        if(dadosAtualizados.getDescricao() != null) empresa.setDescricao(dadosAtualizados.getDescricao());
        if(dadosAtualizados.getLinkedin() != null) empresa.setLinkedin(dadosAtualizados.getLinkedin());
        if(dadosAtualizados.getAvatar() != null) empresa.setAvatar(dadosAtualizados.getAvatar());

        empresaRepository.save(empresa);
        return ResponseEntity.ok(empresa);
    }

    @DeleteMapping("/perfil")
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<Void> deletarPerfil(Authentication authentication) {
        String email = authentication.getName();
        Empresa empresa = empresaRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Empresa não encontrada"));

        // Deletar a empresa
        empresaRepository.delete(empresa);
        return ResponseEntity.noContent().build();
    }


    @PreAuthorize("hasRole('EMPRESA')")
    @GetMapping("/projetos")
    public ResponseEntity<List<Projeto>> listarProjetos(Authentication authentication) {
        String email = authentication.getName();
        Empresa empresa = empresaRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Empresa não encontrada"));
        List<Projeto> projetos = projetoRepository.findByEmpresa(empresa);
        return ResponseEntity.ok(projetos);
    }

    @GetMapping("/me")
    public String getMe(Principal principal) {
        return "Usuário logado: " + principal.getName();
    }

    @GetMapping("/perfil")
    public String getPerfil(Authentication authentication) {
        String email = authentication.getName();
        var roles = authentication.getAuthorities();

        return "Email: " + email + ", Roles: " + roles.toString();
    }
}
