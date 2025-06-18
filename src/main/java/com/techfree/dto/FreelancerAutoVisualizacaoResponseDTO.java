package com.techfree.dto;
import java.util.List;
import java.util.stream.Collectors;

import com.techfree.model.AvaliacaoFreelancer;
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
    private String avatar;
    private List<String> certificados;
    private List<ExperienciaProfissionalDTO> experiencia;
    private List<ExperienciaAcademicaDTO> experienciaAcademica;
    private String emailContato;
    private Double avaliacaoMedia;
    private List<AvaliacaoFreelancerResponseDTO> feedbacks;

    public FreelancerAutoVisualizacaoResponseDTO(Freelancer freelancer, List<AvaliacaoFreelancer> avaliacoes) {
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
        this.avatar = freelancer.getAvatar();
        this.certificados = freelancer.getCertificados();
        this.experiencia = freelancer.getExperiencia().stream()
                .map(exp -> new ExperienciaProfissionalDTO(exp.getId(), exp.getEmpresa(), exp.getCargo(), exp.getTempo(), exp.getDescricao()))
                .toList();
        this.experienciaAcademica = freelancer.getExperienciaAcademica().stream()
                .map(exp -> new ExperienciaAcademicaDTO(exp.getId(), exp.getInstituicao(), exp.getCurso(), exp.getPeriodo(), exp.getDescricao()))
                .toList();
        this.emailContato = freelancer.getEmailContato();
        if (avaliacoes != null && !avaliacoes.isEmpty()) {
            this.avaliacaoMedia = avaliacoes.stream()
                .mapToInt(AvaliacaoFreelancer::getNota)
                .average()
                .orElse(0.0);
            this.feedbacks = avaliacoes.stream()
                .map(AvaliacaoFreelancerResponseDTO::new)
                .collect(Collectors.toList());
        } else {
            this.avaliacaoMedia = null;
            this.feedbacks = List.of();
        }
    }
}
