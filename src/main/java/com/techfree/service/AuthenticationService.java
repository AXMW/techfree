package com.techfree.service;
import com.techfree.dto.LoginRequestDTO;
import com.techfree.dto.LoginResponseDTO;
import com.techfree.dto.RecuperarSenhaRequestDTO;
import com.techfree.enums.TipoUsuario;
import com.techfree.model.Empresa;
import com.techfree.model.Freelancer;
import com.techfree.model.TokenRecuperacaoSenha;
import com.techfree.model.Usuario;
import com.techfree.repository.FreelancerRepository;
import com.techfree.repository.UsuarioRepository;
import com.techfree.security.JwtUtil;
import com.techfree.service.email.EmailTemplateService;
import com.techfree.model.Role;
import com.techfree.repository.RoleRepository;
import java.util.Set;
import com.techfree.dto.SignupResponseDTO;


import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.HashSet;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.techfree.dto.RegistroEmpresaDTO;
import com.techfree.dto.RegistroFreelancerDTO;
import com.techfree.dto.ResetarSenhaDTO;
import com.techfree.repository.TokenRecuperacaoSenhaRepository;
import com.techfree.repository.EmpresaRepository;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final FreelancerRepository freelancerRepository;

    private final EmpresaRepository empresaRepository;

    @Autowired
    private final AuthenticationManager authenticationManager;

    @Autowired
    private final UsuarioRepository usuarioRepository;

    @Autowired
    private final JwtUtil jwtUtil;

    @Autowired
    private EmailService emailService;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TokenRecuperacaoSenhaRepository tokenRepository;

    @Autowired
    private RoleRepository roleRepository;

    public LoginResponseDTO login(LoginRequestDTO loginDTO) {
        
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDTO.getEmail(), loginDTO.getSenha())
        );
        
        if (!auth.isAuthenticated()) {
            throw new RuntimeException("Usuário ou senha inválidos");
        }

        Usuario usuario = (Usuario) auth.getPrincipal();
        String token = jwtUtil.gerarToken(usuario.getEmail());

        return new LoginResponseDTO(token, usuario.getTipo());
    }

    public SignupResponseDTO registerFreelancer(RegistroFreelancerDTO dto) {
        Usuario usuario = new Usuario();
        usuario.setEmail(dto.getEmail());
        usuario.setSenha(passwordEncoder.encode(dto.getSenha()));
        usuario.setTipo(TipoUsuario.FREELANCER);

        Role roleFreelancer = roleRepository.findByNome("FREELANCER")
            .orElseThrow(() -> new RuntimeException("Role FREELANCER não encontrada"));
            Set<Role> sla = new HashSet<Role>();
            sla.add(roleFreelancer);
        usuario.setRoles(sla);
        usuario.setQuantidadeDeFlags(0);
        usuarioRepository.save(usuario);

        
        Freelancer freelancer = new Freelancer();
        freelancer.setNome(dto.getNome());
        freelancer.setUsuario(usuario);
        freelancer.setTelefone(dto.getTelefone());
        freelancer.setCpf(dto.getCpf());
        freelancer.setAreaAtuacao(dto.getAreaEspecialidade());

        freelancerRepository.save(freelancer);

        emailService.enviarEmail(
            freelancer.getUsuario().getEmail(),
            "Bem-vindo à TechFree!",
            EmailTemplateService.templateBoasVindas(freelancer.getNome(), "Freelancer")
        );

        return new SignupResponseDTO(freelancer.getNome(), freelancer.getUsuario().getTipo());
    }

    public SignupResponseDTO registerEmpresa(RegistroEmpresaDTO dto) {

        Usuario usuario = new Usuario();
        usuario.setEmail(dto.getEmail());
        usuario.setSenha(passwordEncoder.encode(dto.getSenha()));
        usuario.setTipo(TipoUsuario.EMPRESA);

        Role roleEmpresa = roleRepository.findByNome("EMPRESA")
            .orElseThrow(() -> new RuntimeException("Role EMPRESA não encontrada"));
            Set<Role> sla = new HashSet<Role>();
            sla.add(roleEmpresa);
        usuario.setRoles(sla);
        usuario.setQuantidadeDeFlags(0);
        usuarioRepository.save(usuario);

        Empresa empresa = new Empresa();
        empresa.setNomeFantasia(dto.getNomeFantasia());
        empresa.setRazaoSocial(dto.getRazaoSocial());
        empresa.setUsuario(usuario);
        empresa.setCnpj(dto.getCnpj());
        empresa.setTelefone(dto.getTelefone());

        empresaRepository.save(empresa);

        emailService.enviarEmail(
            empresa.getUsuario().getEmail(),
            "Bem-vindo à TechFree!",
            EmailTemplateService.templateBoasVindas(empresa.getNomeFantasia(), "Empresa")
        );

        return new SignupResponseDTO(empresa.getNomeFantasia(), empresa.getUsuario().getTipo());
    }

    public void solicitarRecuperacaoSenha(RecuperarSenhaRequestDTO dto) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(dto.email());
        if (usuarioOpt.isEmpty()) return; // Não existe usuário com esse email

        String token = UUID.randomUUID().toString(); // ou um JWT

        TokenRecuperacaoSenha tokenEntity = new TokenRecuperacaoSenha();
        tokenEntity.setToken(token);
        tokenEntity.setEmail(dto.email());
        tokenEntity.setExpiracao(LocalDateTime.now().plusHours(1));
        tokenRepository.save(tokenEntity);

        String link = "http://localhost:8080/reset-password/" + token;

        emailService.enviarEmail(
            dto.email(),
            "Recuperação de senha - TechFree",
            EmailTemplateService.templateRecuperarSenha(link)
        );
    }

    public void redefinirSenha(ResetarSenhaDTO dto) {
        TokenRecuperacaoSenha token = tokenRepository.findByToken(dto.token())
            .orElseThrow(() -> new RuntimeException("Token inválido"));

        if (token.getExpiracao().isBefore(LocalDateTime.now()))
            throw new RuntimeException("Token expirado");

        Usuario usuario = usuarioRepository.findByEmail(token.getEmail())
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        usuario.setSenha(passwordEncoder.encode(dto.novaSenha()));
        usuarioRepository.save(usuario);

        tokenRepository.delete(token); // limpa token usado
    }

}
