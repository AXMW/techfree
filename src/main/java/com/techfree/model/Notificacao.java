package com.techfree.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Notificacao {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String mensagem;

    private boolean lida = false;

    private LocalDateTime data;

    @ManyToOne
    private Usuario usuario;

    public Notificacao() {
        this.data = LocalDateTime.now();
    }

    public Notificacao(String mensagem, Usuario usuario) {
        this.mensagem = mensagem;
        this.usuario = usuario;
        this.data = LocalDateTime.now();
    }
}
