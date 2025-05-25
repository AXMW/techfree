package com.techfree.controller;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.techfree.service.ProjetoService;
import com.techfree.model.Projeto;
import com.techfree.model.Empresa;
import com.techfree.repository.EmpresaRepository;

@RestController
@RequestMapping("/empresa")
public class EmpresaController {

    private final EmpresaRepository empresaRepository;

    private final ProjetoService projetoService;

    public EmpresaController(ProjetoService projetoService, EmpresaRepository empresaRepository) {
        this.projetoService = projetoService;
        this.empresaRepository = empresaRepository;
    }

    @GetMapping("/perfil")
    @PreAuthorize("hasRole('EMPRESA')")
    public Empresa verPerfil(Authentication authentication) {
        String email = authentication.getName(); // vem do JWT

        Optional<Empresa> empresa = empresaRepository.findByEmail(email);
        return empresa.orElseThrow(() -> new RuntimeException("Empresa não encontrada"));
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
    public ResponseEntity<List<Projeto>> listarProjetos() {
        List<Projeto> projetos = projetoService.listarTodos();
        // Apenas empresa pode acessar
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
