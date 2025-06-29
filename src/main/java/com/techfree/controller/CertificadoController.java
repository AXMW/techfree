package com.techfree.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.security.Principal;
import java.util.List;
import org.springframework.security.core.Authentication;

import com.techfree.dto.CertificadoRequestDTO;
import com.techfree.dto.CertificadoResponseDTO;
import com.techfree.service.CertificadoPdfService;
import com.techfree.service.CertificadoService;
import com.techfree.model.Certificado;


@RestController
@RequestMapping("/certificados")
@PreAuthorize("hasRole('FREELANCER')")
public class CertificadoController {
    @Autowired
    private CertificadoService certificadoService;

    @Autowired
    private CertificadoPdfService certificadoPdfService;

    @GetMapping
    public ResponseEntity<List<CertificadoResponseDTO>> listar(Authentication auth) {
        return ResponseEntity.ok(certificadoService.listarPorFreelancer(auth.getName()));
    }

    @PostMapping
    public ResponseEntity<CertificadoResponseDTO> criar(@RequestBody CertificadoRequestDTO dto, Authentication auth) {
        return ResponseEntity.ok(certificadoService.cadastrar(auth.getName(), dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CertificadoResponseDTO> atualizar(@PathVariable Long id,
                                                            @RequestBody CertificadoRequestDTO dto,
                                                            Authentication auth) {
        return ResponseEntity.ok(certificadoService.atualizar(id, auth.getName(), dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id, Authentication auth) {
        certificadoService.deletar(id, auth.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CertificadoResponseDTO> buscarPorId(@PathVariable Long id,
                                                              Authentication auth) {
        return ResponseEntity.ok(certificadoService.buscarPorId(id, auth.getName()));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadCertificado(@PathVariable Long id, Principal principal) {
        Certificado certificado = certificadoService.buscarPorIdEUsuario(id, principal.getName());
        byte[] pdf = certificadoPdfService.gerarCertificadoPdf(certificado);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.attachment().filename("certificado.pdf").build());

        return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
    }

    @GetMapping("/projetos/{id}")
    public ResponseEntity<CertificadoResponseDTO> listarPorProjeto(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(certificadoService.listarPorProjeto(id, auth.getName()));
    }
}
