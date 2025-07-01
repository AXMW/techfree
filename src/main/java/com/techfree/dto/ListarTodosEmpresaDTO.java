package com.techfree.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ListarTodosEmpresaDTO {
    private String nomeFantasia;
    private String areaAtuacao;
    private String emailContato;
    private String telefoneContato;
    private String likedin;
    private String site;
    private String avatar;
}
