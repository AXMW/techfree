package com.techfree.dto;

import java.math.BigDecimal;

public class ProjetoRequestDTO {
    private String titulo;
    private String descricao;
    private String requisitos;
    private BigDecimal orcamento;

    // Getters e Setters

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getRequisitos() {
        return requisitos;
    }

    public void setRequisitos(String requisitos) {
        this.requisitos = requisitos;
    }

    public BigDecimal getOrcamento() {
        return orcamento;
    }

    public void setValor(BigDecimal orcamento) {
        this.orcamento = orcamento;
    }
}
