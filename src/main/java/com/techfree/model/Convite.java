package com.techfree.model;

import jakarta.persistence.*;
import lombok.*;
import com.techfree.enums.StatusConvite;



@Entity
@Table(name = "convites")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Convite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String mensagem;

    @Column(name = "data_convite")
    private String dataConvite;

   @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusConvite status = StatusConvite.ENVIADO;

    @ManyToOne
    @JoinColumn(name = "freelancer_id", nullable = false)
    private Freelancer freelancer;

    @ManyToOne
    @JoinColumn(name = "projeto_id", nullable = false)
    private Projeto projeto;

    @PrePersist
    public void prePersist() {
        this.dataConvite = java.time.LocalDateTime.now().toString();
    }
}
