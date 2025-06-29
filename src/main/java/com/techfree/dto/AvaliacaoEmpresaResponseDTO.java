package com.techfree.dto;

import com.techfree.model.AvaliacaoEmpresa;

import java.time.LocalDate;

import lombok.Getter;

@Getter
public class AvaliacaoEmpresaResponseDTO {
    private Long id;
    private Double nota;
    private String comentario;
    private String nomeEmpresa;
    private String tituloProjeto;
    private String nomeFreelancer;
    private LocalDate dataCriacao;

    public AvaliacaoEmpresaResponseDTO(AvaliacaoEmpresa a) {
        this.id = a.getId();
        this.nota = a.getNota();
        this.comentario = a.getComentario();
        this.nomeEmpresa = a.getEmpresa().getNomeFantasia();
        this.tituloProjeto = a.getProjeto().getTitulo();
        this.nomeFreelancer = a.getFreelancer().getNome();
        this.dataCriacao = a.getDataCriacao();
    }
}
