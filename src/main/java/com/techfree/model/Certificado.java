package com.techfree.model;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "certificados")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Certificado {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Título do projeto
    private String titulo;

    // Descrição do projeto
    @Column(columnDefinition = "TEXT")
    private String descricao;

    // Carga horária do projeto
    private Integer cargaHoraria;

    // Data de conclusão do projeto
    private LocalDate dataConclusao;

    // Freelancer que concluiu o projeto
    @ManyToOne
    @JoinColumn(name = "freelancer_id", nullable = false)
    private Freelancer freelancer;

    // Projeto relacionado ao certificado
    @ManyToOne
    @JoinColumn(name = "projeto_id", nullable = false)
    private Projeto projeto;
}
