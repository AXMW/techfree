package com.techfree.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class GraficoDeLinhaEmpresaDTO {
    private LocalDate prazoEntrega;
    private BigDecimal orcamento;
}
