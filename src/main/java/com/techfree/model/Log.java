package com.techfree.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Getter;
import java.time.LocalDateTime;


import com.techfree.enums.TipoLog;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Log {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime dataHora;
    private TipoLog tipo;
    private String mensagem;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    public Log(LocalDateTime dataHora, TipoLog tipo, String mensagem, Usuario usuario) {
        this.dataHora = dataHora;
        this.tipo = tipo;
        this.mensagem = mensagem;
        this.usuario = usuario;
    }
}
