package com.techfree.dto;
import com.techfree.enums.StatusCandidatura;
import lombok.Setter;
import lombok.Getter;

@Setter
@Getter
public class AtualizarStatusCandidaturaDTO {
    private StatusCandidatura status;

    public StatusCandidatura getStatus() {
        return status;
    }

    
}
