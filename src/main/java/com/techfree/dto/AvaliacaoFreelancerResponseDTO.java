package com.techfree.dto;

import com.techfree.model.AvaliacaoFreelancer;

import java.time.LocalDate;

import lombok.Getter;

@Getter
public class AvaliacaoFreelancerResponseDTO {
    private Long id;
    private Double nota;
    private String comentario;
    private String nomeFreelancer;
    private String tituloProjeto;
    private String nomeEmpresa;
    private LocalDate dataCriacao;

    public AvaliacaoFreelancerResponseDTO(AvaliacaoFreelancer a) {
        this.id = a.getId();
        this.nota = a.getNota();
        this.comentario = a.getComentario();
        this.nomeFreelancer = a.getFreelancer().getNome();
        this.tituloProjeto = a.getProjeto().getTitulo();
        this.nomeEmpresa = a.getEmpresa().getNomeFantasia();
        this.dataCriacao = a.getDataCriacao();
    }
}
