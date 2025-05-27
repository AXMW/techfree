package com.techfree.dto;

import com.techfree.model.AvaliacaoEmpresa;

import lombok.Getter;

@Getter
public class AvaliacaoEmpresaResponseDTO {
    private Long id;
    private Integer nota;
    private String comentario;
    private String nomeEmpresa;
    private String tituloProjeto;

    public AvaliacaoEmpresaResponseDTO(AvaliacaoEmpresa a) {
        this.id = a.getId();
        this.nota = a.getNota();
        this.comentario = a.getComentario();
        this.nomeEmpresa = a.getEmpresa().getNomeFantasia();
        this.tituloProjeto = a.getProjeto().getTitulo();
    }
}
