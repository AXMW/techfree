package com.techfree.dto;

import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;


@Setter
@Getter
public class CertificadoRequestDTO {
    private String titulo;
    private String instituicao;
    private LocalDate dataConclusao;
}
