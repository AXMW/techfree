package com.techfree.service;
import com.techfree.dto.LoginRequestDTO;
import com.techfree.dto.LoginResponseDTO;
import com.techfree.dto.RecuperarSenhaRequestDTO;
import com.techfree.enums.TipoUsuario;
import com.techfree.model.Empresa;
import com.techfree.model.Freelancer;
import com.techfree.model.TokenRecuperacaoSenha;
import com.techfree.model.Usuario;
import com.techfree.repository.UsuarioRepository;
import com.techfree.security.JwtUtil;
import com.techfree.service.email.EmailTemplateService;


import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;
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

@Service
@RequiredArgsConstructor
public class AuthenticationService {

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
  

    public LoginResponseDTO login(LoginRequestDTO loginDTO) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDTO.getEmail(), loginDTO.getSenha())
        );

        Usuario usuario = (Usuario) auth.getPrincipal();
        String token = jwtUtil.gerarToken(usuario.getEmail());

        return new LoginResponseDTO(token, usuario.getTipo());
    }

    public LoginResponseDTO registerFreelancer(RegistroFreelancerDTO dto) {
        Freelancer freelancer = new Freelancer();
        freelancer.getUsuario().setEmail(dto.getEmail());
        freelancer.getUsuario().setSenha(passwordEncoder.encode(dto.getSenha()));
        freelancer.setNome(dto.getNome());
        freelancer.getUsuario().setTipo(TipoUsuario.FREELANCER);

        usuarioRepository.save(freelancer.getUsuario());

        String token = jwtUtil.gerarToken(freelancer.getUsuario().getEmail());

        emailService.enviarEmail(
            freelancer.getUsuario().getEmail(),
            "Bem-vindo à TechFree!",
            EmailTemplateService.templateBoasVindas(freelancer.getNome(), "Freelancer")
        );

        return new LoginResponseDTO(token, freelancer.getUsuario().getTipo());
    }

    public LoginResponseDTO registerEmpresa(RegistroEmpresaDTO dto) {
        Empresa empresa = new Empresa();
        empresa.getUsuario().setEmail(dto.getEmail());
        empresa.getUsuario().setSenha(passwordEncoder.encode(dto.getSenha()));
        empresa.setNomeFantasia(dto.getNomeFantasia());
        empresa.setCnpj(dto.getCnpj());
        empresa.getUsuario().setTipo(TipoUsuario.EMPRESA);

        usuarioRepository.save(empresa.getUsuario());

        String token = jwtUtil.gerarToken(empresa.getUsuario().getEmail());

        emailService.enviarEmail(
            empresa.getUsuario().getEmail(),
            "Bem-vindo à TechFree!",
            EmailTemplateService.templateBoasVindas(empresa.getNomeFantasia(), "Empresa")
        );

        return new LoginResponseDTO(token, empresa.getUsuario().getTipo());
    }

    public void solicitarRecuperacaoSenha(RecuperarSenhaRequestDTO dto) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(dto.email());
        if (usuarioOpt.isEmpty()) throw new RuntimeException("Usuário não encontrado");

        String token = UUID.randomUUID().toString(); // ou um JWT

        TokenRecuperacaoSenha tokenEntity = new TokenRecuperacaoSenha();
        tokenEntity.setToken(token);
        tokenEntity.setEmail(dto.email());
        tokenEntity.setExpiracao(LocalDateTime.now().plusHours(1));
        tokenRepository.save(tokenEntity);

        String link = "http://localhost:8080/auth/resetar-senha?token=" + token;

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
