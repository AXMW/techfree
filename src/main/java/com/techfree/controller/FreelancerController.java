package com.techfree.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.techfree.dto.FreelancerUpdateDTO;
import com.techfree.dto.FreelancerVisualizacaoResponseDTO;
import com.techfree.dto.ListarTodosFreelancerDTO;
import com.techfree.model.Freelancer;
import com.techfree.model.ExperienciaAcademica;
import com.techfree.model.ExperienciaProfissional;
import com.techfree.repository.FreelancerRepository;
import com.techfree.model.Usuario;
import com.techfree.repository.UsuarioRepository;
import com.techfree.dto.FreelancerAutoVisualizacaoResponseDTO;
import com.techfree.repository.AvaliacaoFreelancerRepository;
import com.techfree.model.AvaliacaoFreelancer;
import com.techfree.dto.AlterarEmailRequestDTO;
import com.techfree.dto.AlterarEmailResponseDTO;
import com.techfree.dto.AlterarSenhaRequestDTO;
import com.techfree.dto.ConfiguracaoNotificacaoDTO;
import com.techfree.security.JwtUtil;
import com.techfree.service.LogService;
import com.techfree.enums.TipoLog;
import com.techfree.repository.ExperienciaProfissionalRepository;
import com.techfree.repository.ExperienciaAcademicaRepository;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/freelancer")
public class FreelancerController {
    private final FreelancerRepository freelancerRepository;

    private final UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final JwtUtil jwtUtil;

    @Autowired
    private AvaliacaoFreelancerRepository avaliacaoFreelancerRepository;

    @Autowired
    private LogService logService;

    @Autowired
    private ExperienciaProfissionalRepository experienciaProfissionalRepository;

    @Autowired
    private ExperienciaAcademicaRepository experienciaAcademicaRepository;

    public FreelancerController(
        FreelancerRepository freelancerRepository,
        UsuarioRepository usuarioRepository,
        JwtUtil jwtUtil
    ) {
        this.usuarioRepository = usuarioRepository;
        this.freelancerRepository = freelancerRepository;
        this.jwtUtil = jwtUtil;
    }

    // FREELANCER: ver o perfil do freelancer logado
    @GetMapping("/perfil/verPerfil")
    @PreAuthorize("hasRole('FREELANCER')")
    public FreelancerAutoVisualizacaoResponseDTO verPerfil(Authentication authentication) {
        String email = authentication.getName(); // vem do JWT
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Freelancer freelancer = freelancerRepository.findByUsuario(usuario)
            .orElseThrow(() -> new RuntimeException("Freelancer não encontrado"));

        List<AvaliacaoFreelancer> avaliacoes = avaliacaoFreelancerRepository.findByFreelancer(freelancer);

        FreelancerAutoVisualizacaoResponseDTO response = new FreelancerAutoVisualizacaoResponseDTO(freelancer, avaliacoes);
        return response;
    }

    @GetMapping("/perfil/config-notificacoes")
    @PreAuthorize("hasRole('FREELANCER')")
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
    @PreAuthorize("hasRole('FREELANCER')")
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

    // FREELANCER: atualizar o perfil do freelancer logado
    @PutMapping("/perfil")
    @PreAuthorize("hasRole('FREELANCER')")
    public ResponseEntity<Freelancer> atualizarPerfil(
            Authentication authentication,
            @RequestBody FreelancerUpdateDTO dados) {

        String email = authentication.getName();

        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Freelancer freelancer = freelancerRepository.findByUsuario(usuario)
            .orElseThrow(() -> new RuntimeException("Freelancer não encontrado"));

        // Atualiza só os campos recebidos
        if (dados.getNome() != null) freelancer.setNome(dados.getNome());
        if (dados.getBio() != null) freelancer.setBio(dados.getBio());
        if (dados.getHabilidades() != null) freelancer.setHabilidades(new ArrayList<>(dados.getHabilidades()));
        if (dados.getTelefone() != null) freelancer.setTelefone(dados.getTelefone());
        if (dados.getAreaAtuacao() != null) freelancer.setAreaAtuacao(dados.getAreaAtuacao());
        if (dados.getGithub() != null) freelancer.setGithub(dados.getGithub());
        if (dados.getLinkedin() != null) freelancer.setLinkedin(dados.getLinkedin());
        if (dados.getPortfolio() != null) freelancer.setPortfolio(dados.getPortfolio());
        if (dados.getCertificados() != null) freelancer.setCertificados(new ArrayList<>(dados.getCertificados()));
        if (dados.getAvatar() != null) freelancer.setAvatar(dados.getAvatar());
        if (dados.getEmailContato() != null) freelancer.setEmailContato(dados.getEmailContato());
        if (dados.getTelefoneContato() != null) freelancer.setTelefoneContato(dados.getTelefoneContato());
        if (dados.getExperiencia() != null) {
            freelancer.getExperiencia().clear();
            for (var dto : dados.getExperiencia()) {
                ExperienciaProfissional exp;
                if (dto.getId() != null) {
                    exp = experienciaProfissionalRepository.findById(dto.getId()).orElse(null);
                    if (exp == null) {
                        exp = new ExperienciaProfissional();
                    }
                } else {
                    exp = new ExperienciaProfissional();
                }
                exp.setEmpresa(dto.getEmpresa());
                exp.setCargo(dto.getCargo());
                exp.setTempo(dto.getTempo());
                exp.setDescricao(dto.getDescricao());
                exp.setFreelancer(freelancer);
                freelancer.getExperiencia().add(exp);
            }
        }
        if (dados.getExperienciaAcademica() != null) {
            freelancer.getExperienciaAcademica().clear();
            for (var dto : dados.getExperienciaAcademica()) {
                ExperienciaAcademica exp;
                if (dto.getId() != null) {
                    exp = experienciaAcademicaRepository.findById(dto.getId()).orElse(null);
                    if (exp == null) {
                        exp = new ExperienciaAcademica();
                    }
                } else {
                    exp = new ExperienciaAcademica();
                }
                exp.setInstituicao(dto.getInstituicao());
                exp.setCurso(dto.getCurso());
                exp.setPeriodo(dto.getPeriodo());
                exp.setDescricao(dto.getDescricao());
                exp.setFreelancer(freelancer);
                freelancer.getExperienciaAcademica().add(exp);
            }
        }

        logService.registrar(TipoLog.ATUALIZACAO_PERFIL_FREELANCER,
            "Perfil do freelancer " + freelancer.getId() + " atualizado",
            usuario
        );

        freelancerRepository.save(freelancer);
        return ResponseEntity.ok(freelancer);
    }

    @PutMapping("/perfil/mudarEmail")
    @PreAuthorize("hasRole('FREELANCER')")
    public ResponseEntity<AlterarEmailResponseDTO> mudarEmail(
            Authentication authentication,
            @RequestBody AlterarEmailRequestDTO novoEmailDTO) {

        String email = authentication.getName();

        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Freelancer freelancer = freelancerRepository.findByUsuario(usuario)
            .orElseThrow(() -> new RuntimeException("Freelancer não encontrado"));

        if(!usuario.equals(freelancer.getUsuario())) {
            throw new RuntimeException("");
        }
        
        usuario.setEmail(novoEmailDTO.getNovoEmail());
        usuarioRepository.save(usuario);
        String token = jwtUtil.gerarToken(usuario.getEmail());

        logService.registrar(TipoLog.ATUALIZACAO_EMAIL_FREELANCER,
            "Email do freelancer " + freelancer.getId() + " atualizado",
            usuario
        );

        return ResponseEntity.ok(new AlterarEmailResponseDTO(usuario.getEmail(), token));
    }

    @PutMapping("/perfil/mudarSenha")
    @PreAuthorize("hasRole('FREELANCER')")
    public ResponseEntity<Void> mudarSenha(
            Authentication authentication,
            @RequestBody AlterarSenhaRequestDTO alterarSenhaRequest) {

        String email = authentication.getName();

        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!passwordEncoder.matches(alterarSenhaRequest.getSenhaAtual(), usuario.getSenha())) {
            throw new RuntimeException("Senha atual incorreta");
        }
        
        usuario.setSenha(passwordEncoder.encode(alterarSenhaRequest.getNovaSenha()));
        usuarioRepository.save(usuario);

        logService.registrar(TipoLog.ATUALIZACAO_SENHA_FREELANCER,
            "Senha do freelancer " + usuario.getId() + " atualizada",
            usuario
        );

        return ResponseEntity.noContent().build();
    }

    // FREELANCER: deletar o perfil do freelancer logado
    @DeleteMapping("/perfil")
    @PreAuthorize("hasRole('FREELANCER')")
    public ResponseEntity<Void> deletarPerfil(Authentication authentication) {
        String email = authentication.getName();

        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Freelancer freelancer = freelancerRepository.findByUsuario(usuario)
            .orElseThrow(() -> new RuntimeException("Freelancer não encontrado"));

        freelancerRepository.delete(freelancer);
        return ResponseEntity.noContent().build();
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

    // EMPRESA: ver o perfil do freelancer por ID
    @GetMapping("/perfil/{id}")
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<FreelancerVisualizacaoResponseDTO> verPerfilPorId(@PathVariable Long id) {
        Optional<Freelancer> freelancer = freelancerRepository.findById(id);
        if (freelancer.isEmpty()) {
            throw new RuntimeException("Freelancer não encontrado com ID: " + id);
        }
        List<AvaliacaoFreelancer> avaliacoes = avaliacaoFreelancerRepository.findByFreelancer(freelancer.get());
        FreelancerVisualizacaoResponseDTO response = new FreelancerVisualizacaoResponseDTO(freelancer.get(), avaliacoes);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/listar-todos")
    @PreAuthorize("hasRole('FREELANCER') or hasRole('EMPRESA')")
    public ResponseEntity<List<ListarTodosFreelancerDTO>> pegarTodos() {
        List<Freelancer> freelancers = freelancerRepository.findAll();
        return ResponseEntity.ok(
            freelancers.stream()
                .map(f -> new ListarTodosFreelancerDTO(
                    f.getId(),
                    f.getNome(),
                    f.getEmailContato(),
                    f.getHabilidades(),
                    f.getTelefoneContato(),
                    f.getGithub(),
                    f.getLinkedin(),
                    f.getPortfolio(),
                    f.getAreaAtuacao(),
                    f.getAvatar()
                ))
                .toList()
        );
    }
}
