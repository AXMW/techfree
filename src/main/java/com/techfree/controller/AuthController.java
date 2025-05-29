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

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthenticationService authenticationService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO loginDTO) {
        return ResponseEntity.ok(authenticationService.login(loginDTO));
    }

    @PostMapping("/register/freelancer")
    public ResponseEntity<LoginResponseDTO> registerFreelancer(@RequestBody RegistroFreelancerDTO dto) {
        return ResponseEntity.ok(authenticationService.registerFreelancer(dto));
    }

    @PostMapping("/register/empresa")
    public ResponseEntity<LoginResponseDTO> registerEmpresa(@RequestBody RegistroEmpresaDTO dto) {
        return ResponseEntity.ok(authenticationService.registerEmpresa(dto));
    }

    @PostMapping("/recuperar-senha")
    public ResponseEntity<Void> recuperarSenha(@RequestBody RecuperarSenhaRequestDTO dto) {
        authenticationService.solicitarRecuperacaoSenha(dto);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/resetar-senha")
    public ResponseEntity<Void> resetarSenha(@RequestBody ResetarSenhaDTO dto) {
        authenticationService.redefinirSenha(dto);
        return ResponseEntity.ok().build();
    }
}
