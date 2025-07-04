package com.techfree.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ConfiguracaoNotificacaoDTO {
    private boolean notificacoesAtivas;
    private boolean notificacoesPorEmailAtivas;
}
