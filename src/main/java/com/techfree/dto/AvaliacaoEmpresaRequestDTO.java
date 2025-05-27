package com.techfree.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AvaliacaoEmpresaRequestDTO {
    private Long projetoId;
    private Integer nota;
    private String comentario;
}
