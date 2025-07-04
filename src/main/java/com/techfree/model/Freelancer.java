package com.techfree.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "freelancers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Freelancer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String nome;

    private String telefone;

    private String areaAtuacao;

    private String github;

    private String linkedin;

    private String portfolio;

    @ElementCollection
    private List<String> habilidades;

    @ElementCollection
    private List<String> certificados;

    private LocalDate dataNascimento;

    @Column(columnDefinition = "TEXT")
    private String avatar;

    private String emailContato;

    private String telefoneContato;

    @OneToMany(mappedBy = "freelancer", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<ExperienciaProfissional> experiencia;

    @OneToMany(mappedBy = "freelancer", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<ExperienciaAcademica> experienciaAcademica;

    @Column(unique = true, nullable = false)
    private String cpf;

    @OneToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(name = "data_cadastro")
    private LocalDateTime dataCadastro;

    @Builder.Default
    @Column(nullable = false)
    private boolean enabled = true;

    @PrePersist
    public void prePersist() {
        this.dataCadastro = LocalDateTime.now();
    }
}