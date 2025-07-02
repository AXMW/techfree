package com.techfree.dto;

import java.time.LocalDate;
import java.math.BigDecimal;

import lombok.Setter;
import lombok.Getter;

@Getter
@Setter
public class GraficoDeLinhaFreelancerDTO {
    private LocalDate prazoEntrega;
    private BigDecimal orcamento;
}
