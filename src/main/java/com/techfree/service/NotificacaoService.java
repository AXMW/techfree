package com.techfree.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.techfree.model.Notificacao;
import com.techfree.model.Usuario;
import com.techfree.repository.NotificacaoRepository;
import java.util.List;

@Service
public class NotificacaoService {
    @Autowired
    private NotificacaoRepository notificacaoRepository;

    public void notificar(String mensagem, Usuario usuario) {
        Notificacao n = new Notificacao(mensagem, usuario);
        notificacaoRepository.save(n);
    }

    public List<Notificacao> listar(String email) {
        return notificacaoRepository.findByUsuarioEmailOrderByDataDesc(email);
    }

    public void marcarComoLida(Long id, String email) {
        Notificacao n = notificacaoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Notificação não encontrada"));

        if (!n.getUsuario().getEmail().equals(email)) {
            throw new RuntimeException("Acesso negado");
        }

        n.setLida(true);
        notificacaoRepository.save(n);
    }

    public void criarNotificacao(Usuario usuario, String mensagem) {
        Notificacao notificacao = new Notificacao();
        notificacao.setUsuario(usuario);
        notificacao.setMensagem(mensagem);
        notificacaoRepository.save(notificacao);
    }
}
