package com.techfree.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class AvaliacaoEmpresa {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double nota;
    private String comentario;
    private LocalDate dataCriacao;

    @ManyToOne
    private Freelancer freelancer; // quem avaliou

    @ManyToOne
    private Empresa empresa; // quem foi avaliada

    @ManyToOne
    private Projeto projeto; // projeto relacionado

    public AvaliacaoEmpresa() {
        this.dataCriacao = LocalDate.now();
    }
}
