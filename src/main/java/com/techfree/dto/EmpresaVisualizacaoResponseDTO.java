package com.techfree.dto;
import lombok.Getter;

@Getter
public class EmpresaVisualizacaoResponseDTO {
    private Long id;
    private String nomeFantasia;
    private String razaoSocial;
    private String email;
    private String site;
    private String linkedin;
    private String telefone;
    private String bio;
    private String logoUrl;

    public EmpresaVisualizacaoResponseDTO(Long id, String nomeFantasia,String razaoSocial, String email, String site, String linkedin, String telefone, String bio, String logoUrl) {
        this.id = id;
        this.nomeFantasia = nomeFantasia;
        this.razaoSocial = razaoSocial;
        this.email = email;
        this.site = site;
        this.linkedin = linkedin;
        this.telefone = telefone;
        this.bio = bio;
        this.logoUrl = logoUrl;
    }

    
}
