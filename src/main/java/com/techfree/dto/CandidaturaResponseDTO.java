package com.techfree.dto;
import com.techfree.enums.StatusCandidatura;
import com.techfree.model.Candidatura;
import java.time.LocalDateTime;
import lombok.Getter;

@Getter
public class CandidaturaResponseDTO {
    private Long id;
    private String projetoTitulo;
    private String mensagem;
    private LocalDateTime data;
    private StatusCandidatura status;

    public CandidaturaResponseDTO(Candidatura c) {
        this.id = c.getId();
        this.projetoTitulo = c.getProjeto().getTitulo();
        this.mensagem = c.getMensagem();
        this.data = c.getDataCandidatura();
        this.status = c.getStatus();
    }
}
