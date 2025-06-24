package com.techfree.model;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "empresas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Empresa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String razaoSocial;

    private String nomeFantasia;

    private String areaAtuacao;

    private String telefone;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String site;

    private String linkedin;

    private boolean ativo;

    private String avatar;

    private String emailContato;

    private String telefoneContato;

    @Column(unique = true, nullable = false)
    private String cnpj;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @OneToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    private LocalDateTime dataCadastro;

    @PrePersist
    public void prePersist() {
        this.dataCadastro = LocalDateTime.now();
    }
}
