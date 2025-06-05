package com.techfree.dto;
import lombok.Getter;
import lombok.Setter;
import com.techfree.model.Convite;

@Getter
@Setter
public class ConviteRequestDTO {
    private Long projetoId;
    private String mensagem;
    private Long freelancerId;

    public ConviteRequestDTO(Convite convite) {
        this.projetoId = convite.getProjeto().getId();
        this.mensagem = convite.getMensagem();
        this.freelancerId = convite.getFreelancer().getId();
    }
}
