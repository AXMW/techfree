package com.techfree.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExperienciaAcademicaDTO {
    private Long id;
    private String instituicao;
    private String curso;
    private String periodo;
    private String descricao;
}