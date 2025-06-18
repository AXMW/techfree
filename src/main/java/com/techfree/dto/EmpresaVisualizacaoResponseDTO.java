package com.techfree.dto;
import lombok.Getter;
import com.techfree.model.Empresa;

@Getter
public class EmpresaVisualizacaoResponseDTO {
    private Long id;
    private String nomeFantasia;
    private String razaoSocial;
    private String areaAtuacao;
    private String email;
    private String site;
    private String linkedin;
    private String telefone;
    private String bio;
    private String avatar;
    private String emailContato;

    public EmpresaVisualizacaoResponseDTO(Empresa empresa) {
        this.id = empresa.getId();
        this.nomeFantasia = empresa.getNomeFantasia();
        this.razaoSocial = empresa.getRazaoSocial();
        this.areaAtuacao = empresa.getAreaAtuacao();
        this.email = empresa.getUsuario().getEmail();
        this.site = empresa.getSite();
        this.linkedin = empresa.getLinkedin();
        this.telefone = empresa.getTelefone();
        this.bio = empresa.getBio();
        this.avatar = empresa.getAvatar();
        this.emailContato = empresa.getEmailContato();
    }
}
