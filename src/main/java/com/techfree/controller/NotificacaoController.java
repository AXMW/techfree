package com.techfree.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import java.util.List;

import com.techfree.model.Notificacao;
import com.techfree.service.NotificacaoService;

@RestController
@RequestMapping("/notificacoes")
public class NotificacaoController {
    @Autowired
    private NotificacaoService notificacaoService;

    @GetMapping
    public ResponseEntity<List<Notificacao>> listar(Authentication auth) {
        return ResponseEntity.ok(notificacaoService.listar(auth.getName()));
    }

    @PreAuthorize("hasRole('FREELANCER') or hasRole('EMPRESA')")
    @PutMapping("/{id}/lida")
    public ResponseEntity<Void> marcarComoLida(@PathVariable Long id, Authentication auth) {
        notificacaoService.marcarComoLida(id, auth.getName());
        return ResponseEntity.noContent().build();
    }
}
