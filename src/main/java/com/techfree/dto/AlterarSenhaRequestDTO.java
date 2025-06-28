package com.techfree.dto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AlterarSenhaRequestDTO {
    private String senhaAtual;
    private String novaSenha;
}
