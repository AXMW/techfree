package com.techfree.dto;

import java.math.BigDecimal;
import lombok.Getter;
import com.techfree.model.Projeto;

@Getter
public class ProjetoResponseDTO {
    private Long id;
    private String titulo;
    private String descricao;
    private String requisitos;
    private BigDecimal valor;

     public ProjetoResponseDTO(Projeto projeto) {
        this.id = projeto.getId();
        this.titulo = projeto.getTitulo();
        this.descricao = projeto.getDescricao();
        this.requisitos = projeto.getRequisitos();
        this.valor = projeto.getOrcamento();
    }
}
