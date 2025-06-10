package com.techfree.controller;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.techfree.model.Projeto;
import com.techfree.model.Usuario;
import com.techfree.dto.EmpresaAutoVisualizacaoResponseDTO;
import com.techfree.dto.EmpresaVisualizacaoResponseDTO;
import com.techfree.model.Empresa;
import com.techfree.repository.EmpresaRepository;
import com.techfree.repository.ProjetoRepository;
import com.techfree.repository.AvaliacaoEmpresaRepository;
import com.techfree.service.ProjetoService;
import com.techfree.repository.UsuarioRepository;

@RestController
@RequestMapping("/empresa")
public class EmpresaController {

    private final EmpresaRepository empresaRepository;
    private final ProjetoRepository projetoRepository;
    private final AvaliacaoEmpresaRepository avaliacaoEmpresaRepository;
    private final ProjetoService projetoService;
    private final UsuarioRepository usuarioRepository;

    public EmpresaController(
        ProjetoService projetoService,
        EmpresaRepository empresaRepository,
        ProjetoRepository projetoRepository,
        AvaliacaoEmpresaRepository avaliacaoEmpresaRepository,
        UsuarioRepository usuarioRepository) {
        this.projetoService = projetoService;
        this.empresaRepository = empresaRepository;
        this.projetoRepository = projetoRepository;
        this.avaliacaoEmpresaRepository = avaliacaoEmpresaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    // EMPRESA: ver o perfil da empresa logada
    @GetMapping("/perfil/verPerfil")
    @PreAuthorize("hasRole('EMPRESA')")
    public EmpresaAutoVisualizacaoResponseDTO verPerfil(Authentication authentication) {
        String email = authentication.getName();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Empresa empresa = empresaRepository.findByUsuario(usuario)
                .orElseThrow(() -> new RuntimeException("Empresa não encontrada"));

        EmpresaAutoVisualizacaoResponseDTO empresaDto = new EmpresaAutoVisualizacaoResponseDTO(empresa);
        return empresaDto;
    }

    // EMPRESA: atualizar o perfil da empresa logada
    @PutMapping("/perfil")
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<Empresa> atualizarPerfil(
            Authentication authentication,
            @RequestBody Empresa dadosAtualizados) {

        String email = authentication.getName();

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Empresa empresa = empresaRepository.findByUsuario(usuario)
                .orElseThrow(() -> new RuntimeException("Empresa não encontrada"));

        // atualiza os campos (exemplo)
        if(dadosAtualizados.getRazaoSocial() != null) empresa.setRazaoSocial(dadosAtualizados.getRazaoSocial());
        
        if(dadosAtualizados.getNomeFantasia() != null) empresa.setNomeFantasia(dadosAtualizados.getNomeFantasia());
        if(dadosAtualizados.getAreaAtuacao() != null) empresa.setAreaAtuacao(dadosAtualizados.getAreaAtuacao());
        if(dadosAtualizados.getTelefone() != null) empresa.setTelefone(dadosAtualizados.getTelefone());
        if(dadosAtualizados.getBio() != null) empresa.setBio(dadosAtualizados.getBio());
        if(dadosAtualizados.getSite() != null) empresa.setSite(dadosAtualizados.getSite());
        if(dadosAtualizados.getDescricao() != null) empresa.setDescricao(dadosAtualizados.getDescricao());
        if(dadosAtualizados.getLinkedin() != null) empresa.setLinkedin(dadosAtualizados.getLinkedin());
        if(dadosAtualizados.getAvatar() != null) empresa.setAvatar(dadosAtualizados.getAvatar());

        empresaRepository.save(empresa);
        return ResponseEntity.ok(empresa);
    }

    // EMPRESA: deletar o perfil da empresa logada
    @DeleteMapping("/perfil")
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<Void> deletarPerfil(Authentication authentication) {
        String email = authentication.getName();

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Empresa empresa = empresaRepository.findByUsuario(usuario)
                .orElseThrow(() -> new RuntimeException("Empresa não encontrada"));

        // Deletar a empresa
        empresaRepository.delete(empresa);
        return ResponseEntity.noContent().build();
    }


    // EMPRESA: listar projetos da empresa logada
    @PreAuthorize("hasRole('EMPRESA')")
    @GetMapping("/projetos")
    public ResponseEntity<List<Projeto>> listarProjetos(Authentication authentication) {
        String email = authentication.getName();

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Empresa empresa = empresaRepository.findByUsuario(usuario)
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

    // FREELANCER: ver a empresa
    @GetMapping("/perfil/{id}")
    @PreAuthorize("hasRole('FREELANCER')")
    public ResponseEntity<EmpresaVisualizacaoResponseDTO> verPerfilPorId(@PathVariable Long id) {
        Optional<Empresa> empresa = empresaRepository.findById(id);
        if (empresa.isEmpty()) {
                throw new RuntimeException("Empresa não encontrada com ID: " + id);
        }
        EmpresaVisualizacaoResponseDTO response = new EmpresaVisualizacaoResponseDTO(empresa.get());
        return ResponseEntity.ok(response);
    }
}
