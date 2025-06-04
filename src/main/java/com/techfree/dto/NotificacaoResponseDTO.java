package com.techfree.dto;
import java.time.LocalDateTime;
import lombok.Getter;
import com.techfree.model.Usuario;
import com.techfree.model.Notificacao;

@Getter
public class NotificacaoResponseDTO {
    private Long id;

    private String titulo;

    private String mensagem;

    private LocalDateTime data;

    private boolean lida;

    private Usuario usuario;

    private Usuario remetente;

    public NotificacaoResponseDTO(Notificacao n) {
        this.id = n.getId();
        this.titulo = n.getTitulo();
        this.mensagem = n.getMensagem();
        this.data = n.getData();
        this.lida = n.isLida();
        this.usuario = n.getUsuario();
        this.remetente = n.getRemetente();
    }
}
