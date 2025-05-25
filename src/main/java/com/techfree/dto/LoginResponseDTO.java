package com.techfree.dto;
import lombok.Data;

import com.techfree.enums.TipoUsuario;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponseDTO {
    private String token;
    private String tipoUsuario;

    public LoginResponseDTO(String token, TipoUsuario tipoUsuario) {
        this.token = token;
        this.tipoUsuario = tipoUsuario.name();
    }
}
