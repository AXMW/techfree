package com.techfree.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.techfree.enums.TituloDeNotificacao;
import com.techfree.model.Notificacao;
import com.techfree.model.Usuario;
import com.techfree.repository.NotificacaoRepository;
import java.util.List;

@Service
public class NotificacaoService {
    @Autowired
    private NotificacaoRepository notificacaoRepository;

    public void notificar(TituloDeNotificacao titulo, String mensagem, Usuario usuario, Usuario remetente) {
        Notificacao n = new Notificacao(titulo, mensagem, usuario, remetente);
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

    public void criarNotificacao(TituloDeNotificacao titulo, Usuario usuario, String mensagem, Usuario remetente, Long projetoId) {
        Notificacao notificacao = new Notificacao();
        notificacao.setTitulo(titulo);
        notificacao.setUsuario(usuario);
        notificacao.setMensagem(mensagem);
        notificacao.setRemetente(remetente);
        notificacao.setProjetoId(projetoId);
        notificacaoRepository.save(notificacao);
    }

    public void excluir(Long id, String email) {
        Notificacao notificacao = notificacaoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Notificação não encontrada"));

        if (!notificacao.getUsuario().getEmail().equals(email)) {
            throw new RuntimeException("Acesso negado");
        }

        notificacaoRepository.delete(notificacao);
    }
}
