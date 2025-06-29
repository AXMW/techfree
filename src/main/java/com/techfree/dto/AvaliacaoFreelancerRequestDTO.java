package com.techfree.dto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AvaliacaoFreelancerRequestDTO {
    private Long projetoId;
    private Double nota;
    private String comentario;
}
