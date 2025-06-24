package com.techfree.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SelecionarFreelancerRequestDTO {
    private Long projetoId;
    private Long freelancerId;
    private String mensagem;
}
