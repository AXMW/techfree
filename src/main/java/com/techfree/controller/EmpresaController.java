package com.techfree.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.techfree.model.Projeto;
import com.techfree.model.Usuario;
import com.techfree.dto.AlterarEmailRequestDTO;
import com.techfree.dto.AlterarEmailResponseDTO;
import com.techfree.dto.EmpresaAutoVisualizacaoResponseDTO;
import com.techfree.dto.EmpresaVisualizacaoResponseDTO;
import com.techfree.model.Empresa;
import com.techfree.repository.EmpresaRepository;
import com.techfree.repository.ProjetoRepository;
import com.techfree.repository.AvaliacaoEmpresaRepository;
import com.techfree.repository.UsuarioRepository;
import com.techfree.model.AvaliacaoEmpresa;
import com.techfree.security.JwtUtil;

@RestController
@RequestMapping("/empresa")
public class EmpresaController {

    private final EmpresaRepository empresaRepository;
    private final ProjetoRepository projetoRepository;
    private final AvaliacaoEmpresaRepository avaliacaoEmpresaRepository;
    private final UsuarioRepository usuarioRepository;
    private final JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public EmpresaController(
        EmpresaRepository empresaRepository,
        ProjetoRepository projetoRepository,
        AvaliacaoEmpresaRepository avaliacaoEmpresaRepository,
        UsuarioRepository usuarioRepository,
        JwtUtil jwtUtil) {
        this.empresaRepository = empresaRepository;
        this.projetoRepository = projetoRepository;
        this.avaliacaoEmpresaRepository = avaliacaoEmpresaRepository;
        this.usuarioRepository = usuarioRepository;
        this.jwtUtil = jwtUtil;
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

        List<AvaliacaoEmpresa> avaliacoes = avaliacaoEmpresaRepository.findByEmpresa(empresa);
        List<Projeto> projetos = projetoRepository.findByEmpresa(empresa); // Adicionado

        // Passe os projetos para o DTO
        EmpresaAutoVisualizacaoResponseDTO empresaDto = new EmpresaAutoVisualizacaoResponseDTO(empresa, projetos, avaliacoes);
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
        if(dadosAtualizados.getEmailContato() != null) empresa.setEmailContato(dadosAtualizados.getEmailContato());
        if(dadosAtualizados.getTelefoneContato() != null) empresa.setTelefoneContato(dadosAtualizados.getTelefoneContato());
        

        empresaRepository.save(empresa);
        return ResponseEntity.ok(empresa);
    }

    @PutMapping("/perfil/mudarEmail")
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<AlterarEmailResponseDTO> mudarEmail(
            Authentication authentication,
            AlterarEmailRequestDTO novoEmailRequest) {

        String email = authentication.getName();

        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Empresa empresa = empresaRepository.findByUsuario(usuario)
            .orElseThrow(() -> new RuntimeException("Empresa não encontrada"));

        if(!usuario.equals(empresa.getUsuario())) {
            throw new RuntimeException("");
        }
        
        usuario.setEmail(novoEmailRequest.getNovoEmail());
        usuarioRepository.save(usuario);
        String token = jwtUtil.gerarToken(usuario.getEmail());

        return ResponseEntity.ok(new AlterarEmailResponseDTO(usuario.getEmail(), token));
    }

    @PutMapping("/perfil/mudarSenha")
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<Void> mudarSenha(
            Authentication authentication,
            @RequestBody String senhaAtual,
            @RequestBody String novaSenha) {

        String email = authentication.getName();

        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!usuario.getSenha().equals(passwordEncoder.encode(senhaAtual))) {
            throw new RuntimeException("Senha atual incorreta");
        }
        
        usuario.setSenha(passwordEncoder.encode(novaSenha));
        usuarioRepository.save(usuario);

        return ResponseEntity.noContent().build();
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
        Empresa empresa = empresaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Empresa não encontrada com ID: " + id));
        List<Projeto> projetos = projetoRepository.findByEmpresa(empresa);
        List<AvaliacaoEmpresa> avaliacoes = avaliacaoEmpresaRepository.findByEmpresa(empresa);
        EmpresaVisualizacaoResponseDTO response = new EmpresaVisualizacaoResponseDTO(empresa, projetos, avaliacoes);
        return ResponseEntity.ok(response);
    }
}
