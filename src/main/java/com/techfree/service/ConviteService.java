package com.techfree.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

import com.techfree.dto.ConviteRequestDTO;
import com.techfree.model.Convite;
import com.techfree.model.Freelancer;
import com.techfree.model.Projeto;
import com.techfree.model.Usuario;
import com.techfree.repository.ConviteRepository;
import com.techfree.repository.FreelancerRepository;
import com.techfree.repository.ProjetoRepository;
import com.techfree.enums.StatusConvite;
import com.techfree.enums.StatusProjeto;
import com.techfree.enums.TituloDeNotificacao;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import com.techfree.repository.UsuarioRepository;


@Service
public class ConviteService {
    
    @Autowired
    private ConviteRepository conviteRepository;

    @Autowired
    private ProjetoRepository projetoRepository;

    @Autowired
    private FreelancerRepository freelancerRepository;

    @Autowired
    private NotificacaoService notificacaoService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Convite criarConvite(ConviteRequestDTO dto, String emailFreelancer) {
        Usuario usuario = usuarioRepository.findByEmail(emailFreelancer)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Usuário não encontrado"
                ));
        Freelancer freelancer = freelancerRepository.findByUsuario(usuario)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Freelancer não encontrado"
                ));

        Projeto projeto = projetoRepository.findById(dto.getProjetoId())
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Projeto não encontrado"
                ));

        if (!projeto.getEmpresa().getUsuario().isEnabled()) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN, // 403
                "Usuário desabilitado devido a muitas flags"
                );
        }

        if(projeto.getFreelancerSelecionado() != null) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT, // 409
                "Este projeto já tem um freelancer selecionado"
                );
        }

        notificacaoService.criarNotificacao(TituloDeNotificacao.CONVITE_DE_EMPRESA, freelancer.getUsuario(), 
            "Você recebeu um convite para o projeto: " + projeto.getTitulo(),
            projeto.getEmpresa().getUsuario(), projeto.getId()
        );

        Convite convite = new Convite();
        convite.setFreelancer(freelancer);
        convite.setProjeto(projeto);
        convite.setMensagem(dto.getMensagem());
        convite.setStatus(StatusConvite.ENVIADO);

        return conviteRepository.save(convite);
    }


    public List<Convite> listarPorFreelancer(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Usuário não encontrado"
                ));
        Freelancer freelancer = freelancerRepository.findByUsuario(usuario)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Freelancer não encontrado"
                ));
        return conviteRepository.findByFreelancerId(freelancer.getId());
    }

    public List<Convite> listarPorEmpresa(String emailEmpresa) {
        List<Projeto> projetos = projetoRepository.findByEmpresaUsuarioEmail(emailEmpresa);
        if (projetos == null || projetos.isEmpty()) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Empresa não encontrada"
                );
        }
        return projetos.stream()
             .flatMap(projeto -> conviteRepository.findByProjetoId(projeto.getId()).stream())
             .collect(Collectors.toList());
    }

    public void deletar(Long id, String email) {
        Convite convite = conviteRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Convite não encontrado"
                ));

        if (!convite.getProjeto().getEmpresa().getUsuario().getEmail().equals(email)) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN, // 403
                "Você não tem permissão para deletar este convite"
                );
        }

        if (!convite.getProjeto().getEmpresa().getUsuario().isEnabled()) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN, // 403
                "Usuário desabilitado devido a muitas flags"
                );
        }

        conviteRepository.delete(convite);
    }

    public Convite aceitarConvite(Long id, String email) {
        Convite convite = conviteRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Convite não encontrado"
                ));

        if (!convite.getFreelancer().getUsuario().getEmail().equals(email)) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN, // 403
                "Você não tem permissão para aceitar este convite"
                );
        }

        if (!convite.getFreelancer().getUsuario().isEnabled()) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN, // 403
                "Usuário desabilitado devido a muitas flags"
                );
        }

        if(convite.getProjeto().getFreelancerSelecionado() != null) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT, // 409
                "Este projeto já tem um freelancer selecionado"
                );
        }

        if(convite.getStatus() == StatusConvite.RECUSADO) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, // 400
                "Você não pode aceitar um convite já recusado"
                );
        }

        convite.getProjeto().setFreelancerSelecionado(convite.getFreelancer());
        convite.getProjeto().setStatus(StatusProjeto.EM_ANDAMENTO);
        projetoRepository.save(convite.getProjeto());

        convite.setStatus(StatusConvite.ACEITO);
        conviteRepository.save(convite);

        // Enviar notificação
        notificacaoService.criarNotificacao(
            
            TituloDeNotificacao.CONVITE_ACEITO,
            convite.getFreelancer().getUsuario(),
            "O convite para o projeto " + convite.getProjeto().getTitulo() + " foi aceito.",
            convite.getProjeto().getEmpresa().getUsuario(), convite.getProjeto().getId()
        );

        return convite;
    }

    public Convite recusarConvite(Long id, String email) {
        Convite convite = conviteRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Convite não encontrado"
                ));

        if (!convite.getFreelancer().getUsuario().getEmail().equals(email)) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN, // 403
                "Você não tem permissão para recusar este convite"
                );
        }

        if (!convite.getFreelancer().getUsuario().isEnabled()) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN, // 403
                "Usuário desabilitado devido a muitas flags"
                );
        }

        if(convite.getStatus() == StatusConvite.ACEITO) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, // 400
                "Você não pode recusar um convite já aceito"
                );
        }

        convite.setStatus(StatusConvite.RECUSADO);
        conviteRepository.save(convite);

        // Enviar notificação
        notificacaoService.criarNotificacao(
            TituloDeNotificacao.CONVITE_RECUSADO,
            convite.getFreelancer().getUsuario(),
            "O convite para o projeto " + convite.getProjeto().getTitulo() + " foi recusado.",
            convite.getProjeto().getEmpresa().getUsuario(), convite.getProjeto().getId()
        );

        return convite;
    }

    public List<Convite> listarPorProjeto(Long projetoId, String emailEmpresa) {
        Projeto projeto = projetoRepository.findById(projetoId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Projeto não encontrado"
                ));

        if (!projeto.getEmpresa().getUsuario().getEmail().equals(emailEmpresa)) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN, // 403
                "Você não é dono deste projeto"
                );
        }

        return conviteRepository.findByProjetoId(projetoId);
    }

}
