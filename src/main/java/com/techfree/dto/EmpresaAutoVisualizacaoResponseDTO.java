package com.techfree.dto;
import lombok.Getter;
import com.techfree.model.Empresa;

@Getter
public class EmpresaAutoVisualizacaoResponseDTO {
    private Long id;
    private String nomeFantasia;
    private String razaoSocial;
    private String email;
    private String site;
    private String linkedin;
    private String telefone;
    private String bio;
    private String logoUrl;
    private int quantidadeDeFlags;

    public EmpresaAutoVisualizacaoResponseDTO(Empresa empresa) {
        this.id = empresa.getId();
        this.nomeFantasia = empresa.getNomeFantasia();
        this.razaoSocial = empresa.getRazaoSocial();
        this.email = empresa.getUsuario().getEmail();
        this.site = empresa.getSite();
        this.linkedin = empresa.getLinkedin();
        this.telefone = empresa.getTelefone();
        this.bio = empresa.getBio();
        this.logoUrl = empresa.getAvatar();
        this.quantidadeDeFlags = empresa.getUsuario().getQuantidadeDeFlags();
    }
}
