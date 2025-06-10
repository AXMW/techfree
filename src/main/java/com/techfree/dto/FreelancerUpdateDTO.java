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

    // DTOs internos para experiência profissional e acadêmica
    public static class ExperienciaProfissionalDTO {
        private Long id;
        private String empresa;
        private String cargo;
        private String tempo;
        private String descricao;

        // Construtor com argumentos
        public ExperienciaProfissionalDTO(Long id, String empresa, String cargo, String tempo, String descricao) {
            this.id = id;
            this.empresa = empresa;
            this.cargo = cargo;
            this.tempo = tempo;
            this.descricao = descricao;
        }

        // Getters e Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getEmpresa() { return empresa; }
        public void setEmpresa(String empresa) { this.empresa = empresa; }
        public String getCargo() { return cargo; }
        public void setCargo(String cargo) { this.cargo = cargo; }
        public String getTempo() { return tempo; }
        public void setTempo(String tempo) { this.tempo = tempo; }
        public String getDescricao() { return descricao; }
        public void setDescricao(String descricao) { this.descricao = descricao; }
    }

    public static class ExperienciaAcademicaDTO {
        private Long id;
        private String instituicao;
        private String curso;
        private String periodo;
        private String descricao;

        // Construtor com argumentos
        public ExperienciaAcademicaDTO(Long id, String instituicao, String curso, String periodo, String descricao) {
            this.id = id;
            this.instituicao = instituicao;
            this.curso = curso;
            this.periodo = periodo;
            this.descricao = descricao;
        }

        // Getters e Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getInstituicao() { return instituicao; }
        public void setInstituicao(String instituicao) { this.instituicao = instituicao; }
        public String getCurso() { return curso; }
        public void setCurso(String curso) { this.curso = curso; }
        public String getPeriodo() { return periodo; }
        public void setPeriodo(String periodo) { this.periodo = periodo; }
        public String getDescricao() { return descricao; }
        public void setDescricao(String descricao) { this.descricao = descricao; }
    }
}
