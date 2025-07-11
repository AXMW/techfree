package com.techfree.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.multipart.MultipartFile;

import com.techfree.model.Projeto;
import com.techfree.model.Usuario;
import com.techfree.dto.AlterarEmailRequestDTO;
import com.techfree.dto.AlterarEmailResponseDTO;
import com.techfree.dto.AlterarSenhaRequestDTO;
import com.techfree.dto.ConfiguracaoNotificacaoDTO;
import com.techfree.dto.EmpresaAutoVisualizacaoResponseDTO;
import com.techfree.dto.EmpresaVisualizacaoResponseDTO;
import com.techfree.dto.ListarTodosEmpresaDTO;
import com.techfree.model.Empresa;
import com.techfree.repository.EmpresaRepository;
import com.techfree.repository.ProjetoRepository;
import com.techfree.repository.AvaliacaoEmpresaRepository;
import com.techfree.repository.UsuarioRepository;
import com.techfree.model.AvaliacaoEmpresa;
import com.techfree.security.JwtUtil;
import com.techfree.service.LogService;
import com.techfree.enums.TipoLog;

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

    @Autowired
    private LogService logService;

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
        

        logService.registrar(TipoLog.ATUALIZACAO_PERFIL_EMPRESA,
            "Perfil da empresa " + empresa.getId() + " atualizado",
            usuario
        );
        empresaRepository.save(empresa);
        return ResponseEntity.ok(empresa);
    }

    @PutMapping("/perfil/mudarEmail")
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<AlterarEmailResponseDTO> mudarEmail(
            Authentication authentication,
            @RequestBody AlterarEmailRequestDTO novoEmailRequest) {

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

        logService.registrar(TipoLog.ATUALIZACAO_EMAIL_EMPRESA,
            "Email da empresa " + empresa.getId() + " atualizado",
            usuario
        );

        return ResponseEntity.ok(new AlterarEmailResponseDTO(usuario.getEmail(), token));
    }

    @PutMapping("/perfil/mudarSenha")
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<Void> mudarSenha(
            Authentication authentication,
            @RequestBody AlterarSenhaRequestDTO  alterarSenhaRequest) {

        String email = authentication.getName();

        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!passwordEncoder.matches(alterarSenhaRequest.getSenhaAtual(), usuario.getSenha())) {
            throw new RuntimeException("Senha atual incorreta");
        }
        
        usuario.setSenha(passwordEncoder.encode(alterarSenhaRequest.getNovaSenha()));
        usuarioRepository.save(usuario);

        logService.registrar(TipoLog.ATUALIZACAO_SENHA_EMPRESA,
            "Senha da empresa " + usuario.getId() + " atualizada",
            usuario
        );

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

    @GetMapping("/perfil/config-notificacoes")
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<ConfiguracaoNotificacaoDTO> pegarConfiguracaoNotificacoes(Authentication authentication) {
        String email = authentication.getName();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        ConfiguracaoNotificacaoDTO configuracao = new ConfiguracaoNotificacaoDTO(
            usuario.isNotificacoesAtivas(),
            usuario.isNotificacoesPorEmailAtivas()
        );

        return ResponseEntity.ok(configuracao);
    }

    @PutMapping("/perfil/config-notificacoes")
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<Void> configurarNotificacoes(
            @RequestBody ConfiguracaoNotificacaoDTO dto,
            Authentication authentication) {

        String email = authentication.getName();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        usuario.setNotificacoesAtivas(dto.isNotificacoesAtivas());
        usuario.setNotificacoesPorEmailAtivas(dto.isNotificacoesPorEmailAtivas());

        usuarioRepository.save(usuario);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/upload-assinatura")
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<?> uploadAssinatura(Authentication Auth, @RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) return ResponseEntity.badRequest().body("Arquivo vazio");

        String email = Auth.getName();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        Empresa empresa = empresaRepository.findByUsuario(usuario)
                .orElseThrow(() -> new RuntimeException("Empresa não encontrada"));

        java.nio.file.Path uploadDir = java.nio.file.Paths.get("src/main/resources/static/assets/assinaturas/");
        try {
            if (!java.nio.file.Files.exists(uploadDir)) {
                java.nio.file.Files.createDirectories(uploadDir);
            }

            String originalName = file.getOriginalFilename();
            if(originalName == null || originalName.isBlank()) {
                originalName = "assinatura.png";
            }
            String ext = "png";
            String originalLower = originalName.toLowerCase();
            if (originalLower.endsWith(".jpg") || originalLower.endsWith(".jpeg")) {
                ext = "jpg";
            } else if (originalLower.endsWith(".png")) {
                ext = "png";
            }
            String fileName = "assinatura_empresa_" + empresa.getId() + "." + ext;
            java.nio.file.Path filePath = uploadDir.resolve(fileName);
            java.nio.file.Files.copy(file.getInputStream(), filePath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);

            // Salve o caminho relativo no banco
            empresa.setAssinaturaPath("/assets/assinaturas/" + fileName);
            empresaRepository.save(empresa);
            logService.registrar(TipoLog.UPLOAD_DE_ASSINATURA,
                "Assinatura da empresa " + empresa.getId() + " atualizada",
                usuario
            );
            return ResponseEntity.ok("Upload realizado com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao salvar arquivo: " + e.getMessage());
        }
    }

    @GetMapping("/listar-todos")
    @PreAuthorize("hasRole('FREELANCER') or hasRole('EMPRESA')")
    public ResponseEntity<List<ListarTodosEmpresaDTO>> pegarTodos() {
        List<Empresa> empresas = empresaRepository.findAll();
        return ResponseEntity.ok(
            empresas.stream()
                .map(empresa -> new ListarTodosEmpresaDTO(
                    empresa.getId(),
                    empresa.getNomeFantasia(),
                    empresa.getAreaAtuacao(),
                    empresa.getEmailContato(),
                    empresa.getTelefoneContato(),
                    empresa.getLinkedin(),
                    empresa.getSite(),
                    empresa.getAvatar()))
                .toList()
        );
    }
}
