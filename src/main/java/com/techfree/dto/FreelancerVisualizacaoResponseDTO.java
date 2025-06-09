package com.techfree.dto;
import com.techfree.model.Freelancer;
import lombok.Getter;
import java.util.List;

@Getter
public class FreelancerVisualizacaoResponseDTO {
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

    public FreelancerVisualizacaoResponseDTO(Freelancer freelancer) {
        this.id = freelancer.getId();
        this.nome = freelancer.getNome();
        this.telefone = freelancer.getTelefone();
        this.areaAtuacao = freelancer.getAreaAtuacao();
        this.github = freelancer.getGithub();
        this.linkedin = freelancer.getLinkedin();
        this.portfolio = freelancer.getPortfolio();
        this.email = freelancer.getEmail();
        this.habilidades = freelancer.getHabilidades();
        this.bio = freelancer.getBio();
    }
}
