package com.techfree.model;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.techfree.enums.StatusCandidatura;

@Entity
@Table(name = "candidaturas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Candidatura {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String mensagem;


    @Column(name = "data_candidatura")
    private LocalDateTime dataCandidatura;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusCandidatura status = StatusCandidatura.ENVIADA;

    @ManyToOne
    @JoinColumn(name = "freelancer_id", nullable = false)
    private Freelancer freelancer;

    @ManyToOne
    @JoinColumn(name = "projeto_id", nullable = false)
    private Projeto projeto;

    @PrePersist
    public void prePersist() {
        this.dataCandidatura = LocalDateTime.now();
    }
}
