package com.techfree.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import com.techfree.dto.CandidaturaRequestDTO;
import com.techfree.model.Candidatura;
import com.techfree.model.Freelancer;
import com.techfree.model.Projeto;
import com.techfree.repository.CandidaturaRepository;
import com.techfree.repository.FreelancerRepository;
import com.techfree.repository.ProjetoRepository;
import com.techfree.enums.StatusCandidatura;
import com.techfree.enums.TipoLog;
import com.techfree.enums.TituloDeNotificacao;
import com.techfree.service.email.EmailTemplateService;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import com.techfree.model.Usuario;
import com.techfree.repository.UsuarioRepository;

@Service
public class CandidaturaService {
    @Autowired
    private CandidaturaRepository candidaturaRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private EmailTemplateService emailTemplateService;
    @Autowired
    private ProjetoRepository projetoRepository;

    @Autowired
    private FreelancerRepository freelancerRepository;

    @Autowired
    private NotificacaoService notificacaoService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private LogService logService;
    

    public Candidatura criarCandidatura(CandidaturaRequestDTO dto, String emailFreelancer) {
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

        if (!usuario.isEnabled()) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN, // 403
                "Usuário desabilitado devido a muitas flags"
                );
        }

        Projeto projeto = projetoRepository.findById(dto.getProjetoId())
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Projeto não encontrado"
                ));
        
        if (candidaturaRepository.existsByFreelancerIdAndProjetoId(freelancer.getId(), projeto.getId())) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT, // 409
                "Você já se candidatou a este projeto"
            );
        }

        notificacaoService.criarNotificacao(TituloDeNotificacao.CANDIDATURA_ENVIADA,
            freelancer.getUsuario(),
            "Você se candidatou ao projeto '" + projeto.getTitulo() + "'", 
            projeto.getEmpresa().getUsuario(), projeto.getId()
        );

        notificacaoService.criarNotificacao(TituloDeNotificacao.CANDIDATURA_RECEBIDA,
            projeto.getEmpresa().getUsuario(),
            "Você recebeu uma candidatura para o projeto '" + projeto.getTitulo() + "'",
             freelancer.getUsuario(), projeto.getId()
        );

        logService.registrar(TipoLog.CANDIDATURA_ENVIADA, 
            "Candidatura enviada pelo freelancer " + freelancer.getId() + " para o projeto " + projeto.getId(), 
            freelancer.getUsuario()
        );

        Candidatura candidatura = new Candidatura();
        candidatura.setFreelancer(freelancer);
        candidatura.setProjeto(projeto);
        candidatura.setMensagem(dto.getMensagem());

        return candidaturaRepository.save(candidatura);
    }

    public List<Candidatura> listarPorFreelancer(String email) {
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
        return candidaturaRepository.findByFreelancerId(freelancer.getId());
    }

    public void deletar(Long id, String email) {
        Candidatura c = candidaturaRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Candidatura não encontrada"
                ));

        if (!c.getFreelancer().getUsuario().getEmail().equals(email)) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN, // 403
                "Acesso negado"
                );
        }

        candidaturaRepository.delete(c);
    }

    public List<Candidatura> listarPorProjeto(Long projetoId, String emailEmpresa) {
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

        return candidaturaRepository.findByProjetoId(projetoId);
    }

    public void recusarCandidatura(Long candidaturaId, String emailEmpresa) {
        Candidatura candidatura = candidaturaRepository.findById(candidaturaId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Candidatura não encontrada"
                ));

        Projeto projeto = candidatura.getProjeto();

        if (!projeto.getEmpresa().getUsuario().getEmail().equals(emailEmpresa)) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN, // 403
                "Você não tem permissão para alterar esta candidatura"
                );
        }

        if (!projeto.getEmpresa().getUsuario().isEnabled()) {
            projeto.getEmpresa().getUsuario().setEnabled(false); // Desabilita o usuário se atingir 3 flags
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN, // 403
                "Usuário desabilitado devido a muitas flags"
                );
        }

        String nome = candidatura.getFreelancer().getNome();
        String titulo = projeto.getTitulo();
        StatusCandidatura status = StatusCandidatura.RECUSADA;
        candidatura.setStatus(status);
        notificacaoService.criarNotificacao(TituloDeNotificacao.REJEICAO_DE_CANDIDATURA,
            candidatura.getFreelancer().getUsuario(),
            "Sua candidatura para o projeto '" + titulo + "' foi recusada",
            projeto.getEmpresa().getUsuario(), projeto.getId()
        );

        logService.registrar(TipoLog.CANDIDATURA_RECUSADA, 
            "Candidatura " + candidaturaId + " recusada pelo usuário " + emailEmpresa, 
            projeto.getEmpresa().getUsuario()
        );

        emailService.enviarHtml(
            candidatura.getFreelancer().getUsuario().getEmail(),
            "Sua candidatura foi " + status.name().toLowerCase(),
            emailTemplateService.gerarTemplate(nome, titulo, status)
        );

        candidaturaRepository.save(candidatura);
    }
}
