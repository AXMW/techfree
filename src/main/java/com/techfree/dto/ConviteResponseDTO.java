package com.techfree.dto;

import com.techfree.model.Convite;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ConviteResponseDTO {
    private Long id;
    private String mensagem;
    private String dataConvite;
    private String status;
    private Long freelancerId;
    private Long projetoId;

    public ConviteResponseDTO(Convite convite) {
        this.id = convite.getId();
        this.mensagem = convite.getMensagem();
        this.dataConvite = convite.getDataConvite();
        this.status = convite.getStatus().name();
        this.freelancerId = convite.getFreelancer().getId();
        this.projetoId = convite.getProjeto().getId();
    }

    public ConviteResponseDTO(Long id, String mensagem, String dataConvite, String status, Long freelancerId, Long projetoId) {
        this.id = id;
        this.mensagem = mensagem;
        this.dataConvite = dataConvite;
        this.status = status;
        this.freelancerId = freelancerId;
        this.projetoId = projetoId;
    }
    
}
