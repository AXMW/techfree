package com.techfree.dto;

import java.math.BigDecimal;
import lombok.Getter;
import com.techfree.model.Projeto;
import java.time.LocalDate;
import com.techfree.enums.StatusProjeto;

@Getter
public class ProjetoResponseDTO {
    private Long id;

    private String titulo;

    private String descricao;

    private String requisitos;

    private BigDecimal orcamento;

    private LocalDate prazoEntrega;

    private String emailPraContato;

    private String area;

    private StatusProjeto status;

    public ProjetoResponseDTO(Projeto projeto) {
        this.id = projeto.getId();
        this.titulo = projeto.getTitulo();
        this.descricao = projeto.getDescricao();
        this.requisitos = projeto.getRequisitos();
        this.orcamento = projeto.getOrcamento();
        this.prazoEntrega = projeto.getPrazoEntrega();
        this.emailPraContato = projeto.getEmailPraContato();
        this.area = projeto.getArea();
        this.status = projeto.getStatus();
    }
}
