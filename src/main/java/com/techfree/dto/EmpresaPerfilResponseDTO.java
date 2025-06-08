package com.techfree.dto;

import com.techfree.model.Empresa;
import com.techfree.model.Projeto;
import com.techfree.model.AvaliacaoEmpresa;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmpresaPerfilResponseDTO {
    private Empresa empresa;
    private List<Projeto> projetos;
    private List<AvaliacaoEmpresa> feedbacks;

    public EmpresaPerfilResponseDTO(Empresa empresa, List<Projeto> projetos, List<AvaliacaoEmpresa> feedbacks) {
        this.empresa = empresa;
        this.projetos = projetos;
        this.feedbacks = feedbacks;
    }
}