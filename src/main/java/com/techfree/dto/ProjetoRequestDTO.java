package com.techfree.dto;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProjetoRequestDTO {
    private String titulo;

    private String subtitulo;

    private String grauexperience;

    private String descricao;

    private String requisitos;

    private BigDecimal orcamento;

    private int duracao;

    private String emailPraContato;

    private String telefonePraContato;

    private String mensagem;

}
