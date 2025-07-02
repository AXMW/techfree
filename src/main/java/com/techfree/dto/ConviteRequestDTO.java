package com.techfree.dto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.techfree.model.Convite;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConviteRequestDTO {
    private Long projetoId;
    private Long freelancerId;

    public ConviteRequestDTO(Convite convite) {
        this.projetoId = convite.getProjeto().getId();
        this.freelancerId = convite.getFreelancer().getId();
    }
}
