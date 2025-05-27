package com.techfree.dto;

import java.time.LocalDate;

import com.techfree.model.Certificado;
import lombok.Getter;

@Getter
public class CertificadoResponseDTO {
    private Long id;
    private String titulo;
    private String instituicao;
    private LocalDate dataConclusao;

    public CertificadoResponseDTO(Certificado c) {
        this.id = c.getId();
        this.titulo = c.getTitulo();
        this.instituicao = c.getInstituicao();
        this.dataConclusao = c.getDataConclusao();
    }
}
