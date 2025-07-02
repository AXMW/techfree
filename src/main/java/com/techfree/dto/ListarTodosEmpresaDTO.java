package com.techfree.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ListarTodosEmpresaDTO {
    private Long id;
    private String nomeFantasia;
    private String areaAtuacao;
    private String emailContato;
    private String telefoneContato;
    private String linkedin;
    private String site;
    private String avatar;
}
