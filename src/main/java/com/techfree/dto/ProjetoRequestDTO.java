package com.techfree.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProjetoRequestDTO {
    private String titulo;

    private String descricao;

    private String requisitos;

    private BigDecimal orcamento;

    private LocalDate prazoEntrega;

    private String emailPraContato;

    private String area;

}
