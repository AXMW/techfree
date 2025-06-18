package com.techfree.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExperienciaProfissionalDTO {
    private Long id;
    private String empresa;
    private String cargo;
    private String tempo;
    private String descricao;
}