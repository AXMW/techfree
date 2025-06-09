package com.techfree.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.techfree.service.AuthenticationService;
import com.techfree.dto.LoginRequestDTO;
import com.techfree.dto.LoginResponseDTO;
import com.techfree.dto.RecuperarSenhaRequestDTO;
import com.techfree.dto.RegistroEmpresaDTO;
import com.techfree.dto.RegistroFreelancerDTO;
import com.techfree.dto.ResetarSenhaDTO;
import com.techfree.dto.SignupResponseDTO;
import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthenticationService authenticationService;

    // Endpoint pro usuario fazer o login
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO loginDTO) {
        return ResponseEntity.ok(authenticationService.login(loginDTO));
    }

    // Endpoint pro freelancer fazer o registro
    @PostMapping("/register/freelancer")
    public ResponseEntity<SignupResponseDTO> registerFreelancer(@Valid @RequestBody RegistroFreelancerDTO dto) {
        return ResponseEntity.ok(authenticationService.registerFreelancer(dto));
    }

    // Endpoint pra empresa fazer o registro
    @PostMapping("/register/empresa")
    public ResponseEntity<SignupResponseDTO> registerEmpresa(@Valid @RequestBody RegistroEmpresaDTO dto) {
        return ResponseEntity.ok(authenticationService.registerEmpresa(dto));
    }

    // Endpoint pra solicitar a recuperacao de senha
    @PostMapping("/recuperar-senha")
    public ResponseEntity<Void> recuperarSenha(@RequestBody RecuperarSenhaRequestDTO dto) {
        authenticationService.solicitarRecuperacaoSenha(dto);
        return ResponseEntity.ok().build();
    }

    // Endpoint pra redefinir a senha
    @PostMapping("/resetar-senha")
    public ResponseEntity<Void> resetarSenha(@RequestBody ResetarSenhaDTO dto) {
        authenticationService.redefinirSenha(dto);
        return ResponseEntity.ok().build();
    }
}
