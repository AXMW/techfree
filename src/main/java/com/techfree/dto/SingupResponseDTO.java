package com.techfree.dto;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.techfree.enums.TipoUsuario;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SingupResponseDTO {
    private String name;
    private String tipoUsuario;

    public SingupResponseDTO(String name, TipoUsuario tipoUsuario) {
        this.name = name;
        this.tipoUsuario = tipoUsuario.name();
    }
}
