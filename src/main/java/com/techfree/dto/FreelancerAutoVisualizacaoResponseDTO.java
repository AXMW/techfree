package com.techfree.dto;
import java.util.List;

import com.techfree.model.Freelancer;

import lombok.Getter;



@Getter
public class FreelancerAutoVisualizacaoResponseDTO {
    private Long id;
    private String nome;
    private String telefone;
    private String areaAtuacao;
    private String github;
    private String linkedin;
    private String portfolio;
    private String email;
    private List<String> habilidades;
    private String bio;
    private int quantidadeDeFlags;

    public FreelancerAutoVisualizacaoResponseDTO(Freelancer freelancer) {
        this.id = freelancer.getId();
        this.nome = freelancer.getNome();
        this.telefone = freelancer.getTelefone();
        this.areaAtuacao = freelancer.getAreaAtuacao();
        this.github = freelancer.getGithub();
        this.linkedin = freelancer.getLinkedin();
        this.portfolio = freelancer.getPortfolio();
        this.email = freelancer.getUsuario().getEmail();
        this.habilidades = freelancer.getHabilidades();
        this.bio = freelancer.getBio();
        this.quantidadeDeFlags = freelancer.getUsuario().getQuantidadeDeFlags();
    }
}
