package com.techfree.service;
import com.techfree.dto.LoginRequestDTO;
import com.techfree.dto.LoginResponseDTO;
import com.techfree.model.Usuario;
import com.techfree.repository.UsuarioRepository;
import com.techfree.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository usuarioRepository;
    private final JwtUtil jwtUtil;

    public LoginResponseDTO login(LoginRequestDTO loginDTO) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDTO.getEmail(), loginDTO.getSenha())
        );

        Usuario usuario = (Usuario) auth.getPrincipal();
        String token = jwtUtil.gerarToken(usuario.getEmail());

        return new LoginResponseDTO(token, usuario.getTipo());
    }
}
