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

    private String titulo;

    private String mensagem;

    private boolean lida = false;

    private LocalDateTime data;

    @ManyToOne
    private Usuario remetente;

    @ManyToOne
    private Usuario usuario;

    public Notificacao() {
        this.data = LocalDateTime.now();
    }

    public Notificacao(String titulo, String mensagem, Usuario usuario, Usuario remetente) {
        this.titulo = titulo;
        this.mensagem = mensagem;
        this.usuario = usuario;
        this.remetente = remetente;
        this.data = LocalDateTime.now();
    }
}
