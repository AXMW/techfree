package com.techfree.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AlterarEmailDTO {

    private String novoEmail;
    
    private String token;

}
