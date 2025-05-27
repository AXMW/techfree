package com.techfree.dto;
import com.techfree.enums.StatusCandidatura;
import com.techfree.model.Candidatura;
import java.time.LocalDate;
import lombok.Getter;

@Getter
public class CandidaturaResponseDTO {
    private Long id;
    private String projetoTitulo;
    private String mensagem;
    private LocalDate data;
    private StatusCandidatura status;

    public CandidaturaResponseDTO(Candidatura c) {
        this.id = c.getId();
        this.projetoTitulo = c.getProjeto().getTitulo();
        this.mensagem = c.getMensagem();
        this.data = c.getData();
        this.status = c.getStatus();
    }
}
