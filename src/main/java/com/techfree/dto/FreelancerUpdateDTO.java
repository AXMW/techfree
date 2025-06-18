package com.techfree.dto;

import java.util.List;

public class FreelancerUpdateDTO {
    private String nome;
    private String bio;
    private String telefone;
    private String areaAtuacao;
    private String github;
    private String linkedin;
    private String portfolio;
    private String email;
    private List<String> habilidades;
    private List<String> certificados;
    private String avatar;
    private List<ExperienciaProfissionalDTO> experiencia;
    private List<ExperienciaAcademicaDTO> experienciaAcademica;
    private String emailContato;

    // Getters e Setters

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }

    public String getAreaAtuacao() { return areaAtuacao; }
    public void setAreaAtuacao(String areaAtuacao) { this.areaAtuacao = areaAtuacao; }

    public String getGithub() { return github; }
    public void setGithub(String github) { this.github = github; }

    public String getLinkedin() { return linkedin; }
    public void setLinkedin(String linkedin) { this.linkedin = linkedin; }

    public String getPortfolio() { return portfolio; }
    public void setPortfolio(String portfolio) { this.portfolio = portfolio; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }


    public List<String> getHabilidades() { return habilidades; }
    public void setHabilidades(List<String> habilidades) { this.habilidades = habilidades; }

    public List<String> getCertificados() { return certificados; }
    public void setCertificados(List<String> certificados) { this.certificados = certificados; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public List<ExperienciaProfissionalDTO> getExperiencia() { return experiencia; }
    public void setExperiencia(List<ExperienciaProfissionalDTO> experiencia) { this.experiencia = experiencia; }

    public List<ExperienciaAcademicaDTO> getExperienciaAcademica() { return experienciaAcademica; }
    public void setExperienciaAcademica(List<ExperienciaAcademicaDTO> experienciaAcademica) { this.experienciaAcademica = experienciaAcademica; }

    public String getEmailContato() { return emailContato; }
    public void setEmailContato(String emailContato) { this.emailContato = emailContato; }
}
