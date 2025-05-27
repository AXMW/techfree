package com.techfree.dto;

import com.techfree.model.AvaliacaoFreelancer;
import lombok.Getter;

@Getter
public class AvaliacaoFreelancerResponseDTO {
    private Long id;
    private Integer nota;
    private String comentario;
    private String nomeFreelancer;
    private String tituloProjeto;

    public AvaliacaoFreelancerResponseDTO(AvaliacaoFreelancer a) {
        this.id = a.getId();
        this.nota = a.getNota();
        this.comentario = a.getComentario();
        this.nomeFreelancer = a.getFreelancer().getNome();
        this.tituloProjeto = a.getProjeto().getTitulo();
    }
}
