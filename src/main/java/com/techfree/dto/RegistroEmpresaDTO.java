package com.techfree.dto;
import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Data
public class RegistroEmpresaDTO {
    @NotBlank
    private String nomeFantasia;

    @NotBlank
    private String razaoSocial;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String senha;

    @NotBlank
    private String cnpj;

    @NotBlank
    private String descricao;

    @NotBlank
    private String telefone;

    @NotBlank
    private String site;
}
