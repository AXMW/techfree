package com.techfree.dto;
import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
public class RegistroFreelancerDTO {

    @NotBlank
    private String nome;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(min = 8, max = 20)
    @jakarta.validation.constraints.Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,20}$",
        message = "A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial."
    )
    private String senha;

    @NotBlank
    private String telefone;

    @NotBlank
    private String cpf;

    @NotBlank
    private String areaEspecialidade;
}
