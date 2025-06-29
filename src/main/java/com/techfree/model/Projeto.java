package com.techfree.model;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.techfree.enums.StatusProjeto;

@Entity
@Table(name = "projetos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Projeto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;

    private String subtitulo;

    private String grauexperience;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    private String requisitos;

    private BigDecimal orcamento;

    private int duracao;

    private LocalDate prazoEntrega;

    private LocalDate dataInicio;

    private String emailPraContato;

    private String telefonePraContato;

    private boolean ativo;

    @Column(columnDefinition = "TEXT")
    private String mensagem;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusProjeto status;

    @ManyToOne
    @JoinColumn(name = "empresa_id", nullable = false)
    private Empresa empresa;

    @ManyToOne
    private Freelancer freelancerSelecionado;

    @Column(name = "data_criacao")
    private LocalDateTime dataCriacao;

    private String linkProjetoHospedagem;

    @PrePersist
    public void prePersist() {
        this.dataCriacao = LocalDateTime.now();
    }

    private String anexoAuxiliar;
}
