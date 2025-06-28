package com.techfree.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AlterarEmailResponseDTO {

    private String novoEmail;
    
    private String token;

}
