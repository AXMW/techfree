package com.techfree.dto;

import java.math.BigDecimal;
import lombok.Getter;
import com.techfree.model.Projeto;
import java.time.LocalDate;
import java.time.LocalDateTime;
import com.techfree.enums.StatusProjeto;

@Getter
public class ProjetoResponseDTO {
    private Long id;

    private String titulo;

    private String subtitulo;

    private String grauexperience;

    private String descricao;

    private String requisitos;

    private BigDecimal orcamento;

    private int duracao;

    private LocalDate prazoEntrega;

    private LocalDate dataInicio;

    private String emailPraContato;
    
    private String telefonePraContato;

    private StatusProjeto status;

    private String empresa;

    private String site;

    private LocalDateTime dataCriacao;

    private String telefoneEmpresa;

    private String mensagem;

    private String linkProjetoHospedagem;

    public ProjetoResponseDTO(Projeto projeto) {
        this.id = projeto.getId();
        this.titulo = projeto.getTitulo();
        this.subtitulo = projeto.getSubtitulo();
        this.grauexperience = projeto.getGrauexperience();
        this.descricao = projeto.getDescricao();
        this.requisitos = projeto.getRequisitos();
        this.orcamento = projeto.getOrcamento();
        this.duracao = projeto.getDuracao();
        this.prazoEntrega = projeto.getPrazoEntrega();
        this.dataInicio = projeto.getDataInicio();
        this.emailPraContato = projeto.getEmailPraContato();
        this.telefonePraContato = projeto.getTelefonePraContato();
        this.status = projeto.getStatus();
        this.empresa = projeto.getEmpresa().getNomeFantasia();
        this.site = projeto.getEmpresa().getSite();
        this.dataCriacao = projeto.getDataCriacao();
        this.telefoneEmpresa = projeto.getEmpresa().getTelefoneContato();
        this.mensagem = projeto.getMensagem();
        this.linkProjetoHospedagem = projeto.getLinkProjetoHospedagem();
    }
}
