package com.techfree.dto;
import lombok.Getter;
import com.techfree.model.Empresa;
import com.techfree.model.AvaliacaoEmpresa;
import com.techfree.model.Projeto;
import java.util.List;
import java.util.stream.Collectors;

@Getter
public class EmpresaAutoVisualizacaoResponseDTO {
    private Long id;
    private String nomeFantasia;
    private String razaoSocial;
    private String areaAtuacao;
    private String email;
    private String site;
    private String linkedin;
    private String telefone;
    private String telefoneContato;
    private String bio;
    private String avatar;
    private int quantidadeDeFlags;
    private String emailContato;
    private Double avaliacaoMedia;
    private List<AvaliacaoEmpresaResponseDTO> feedbacks;
    private List<Projeto> projetos;
    private String assinaturaPath;

    public EmpresaAutoVisualizacaoResponseDTO(Empresa empresa, List<Projeto> projetos, List<AvaliacaoEmpresa> avaliacoes) {
        this.id = empresa.getId();
        this.nomeFantasia = empresa.getNomeFantasia();
        this.razaoSocial = empresa.getRazaoSocial();
        this.areaAtuacao = empresa.getAreaAtuacao();
        this.email = empresa.getUsuario().getEmail();
        this.site = empresa.getSite();
        this.linkedin = empresa.getLinkedin();
        this.telefone = empresa.getTelefone();
        this.telefoneContato = empresa.getTelefoneContato();
        this.bio = empresa.getBio();
        this.avatar = empresa.getAvatar();
        this.quantidadeDeFlags = empresa.getUsuario().getQuantidadeDeFlags();
        this.emailContato = empresa.getEmailContato();
        this.projetos = projetos;
        if (avaliacoes != null && !avaliacoes.isEmpty()) {
            this.avaliacaoMedia = avaliacoes.stream()
                .mapToDouble(AvaliacaoEmpresa::getNota)
                .average()
                .orElse(0.0);
            this.feedbacks = avaliacoes.stream()
                .map(AvaliacaoEmpresaResponseDTO::new)
                .collect(Collectors.toList());
        } else {
            this.avaliacaoMedia = null;
            this.feedbacks = List.of();
        }
        this.assinaturaPath = empresa.getAssinaturaPath();
    }

}
