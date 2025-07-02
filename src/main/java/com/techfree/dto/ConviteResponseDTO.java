package com.techfree.dto;

import com.techfree.model.Convite;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ConviteResponseDTO {
    private Long id;
    private String dataConvite;
    private Long freelancerId;
    private Long projetoId;

    public ConviteResponseDTO(Convite convite) {
        this.id = convite.getId();
        this.dataConvite = convite.getDataConvite();
        this.freelancerId = convite.getFreelancer().getId();
        this.projetoId = convite.getProjeto().getId();
    }

    public ConviteResponseDTO(Long id, String mensagem, String dataConvite, String status, Long freelancerId, Long projetoId) {
        this.id = id;
        this.dataConvite = dataConvite;
        this.freelancerId = freelancerId;
        this.projetoId = projetoId;
    }
    
}
