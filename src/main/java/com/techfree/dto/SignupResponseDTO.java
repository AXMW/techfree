package com.techfree.dto;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.techfree.enums.TipoUsuario;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SignupResponseDTO {
    private String name;
    private String tipoUsuario;

    public SignupResponseDTO(String name, TipoUsuario tipoUsuario) {
        this.name = name;
        this.tipoUsuario = tipoUsuario.name();
    }
}
