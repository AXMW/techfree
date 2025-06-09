package com.techfree.dto;
import com.techfree.enums.StatusCandidatura;
import com.techfree.model.Candidatura;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Getter;

@Getter
public class CandidaturaResponseDTO {
    private Long id;
    private String projetoTitulo;
    private String mensagem;
    private LocalDateTime data;
    private StatusCandidatura status;
    private Long freelancerId;
    private String freelancerNome;
    private String frelancerTelefone;
    private String freelancerAreaDeAtuacao;
    private List<String> feelancerHabilidades;
    private String freelancerEmail;

    public CandidaturaResponseDTO(Candidatura c) {
        this.id = c.getId();
        this.projetoTitulo = c.getProjeto().getTitulo();
        this.mensagem = c.getMensagem();
        this.data = c.getDataCandidatura();
        this.status = c.getStatus();
        this.freelancerId = c.getFreelancer().getId();
        this.freelancerNome = c.getFreelancer().getNome();
        this.frelancerTelefone = c.getFreelancer().getTelefone();
        this.freelancerAreaDeAtuacao = c.getFreelancer().getAreaAtuacao();
        this.feelancerHabilidades = c.getFreelancer().getHabilidades();
        this.freelancerEmail = c.getFreelancer().getUsuario().getEmail();
    }
}
