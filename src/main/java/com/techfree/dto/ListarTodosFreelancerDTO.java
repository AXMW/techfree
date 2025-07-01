package com.techfree.dto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class ListarTodosFreelancerDTO {
    private String nome;
    private String emailContato;
    private List<String> habilidades;
    private String telefoneContato;
    private String github;
    private String linkedin;
    private String portfolio;
    private String areaAtuacao;
    private String avatar;

}
