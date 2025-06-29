package com.techfree.dto;

import java.time.LocalDate;
import com.techfree.model.Certificado;
import lombok.Getter;

@Getter
public class CertificadoResponseDTO {
    private Long id;
    private String titulo;
    private String descricao;
    private Integer cargaHoraria;
    private LocalDate dataConclusao;
    private Long freelancerId;
    private String freelancerNome;
    private Long projetoId;
    private String projetoTitulo;

    public CertificadoResponseDTO(Certificado c) {
        this.id = c.getId();
        this.titulo = c.getTitulo();
        this.descricao = c.getDescricao();
        this.cargaHoraria = c.getCargaHoraria();
        this.dataConclusao = c.getDataConclusao();
        this.freelancerId = c.getFreelancer() != null ? c.getFreelancer().getId() : null;
        this.freelancerNome = c.getFreelancer() != null ? c.getFreelancer().getNome() : null;
        this.projetoId = c.getProjeto() != null ? c.getProjeto().getId() : null;
        this.projetoTitulo = c.getProjeto() != null ? c.getProjeto().getTitulo() : null;
    }
}
