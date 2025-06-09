package com.techfree.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

import com.techfree.dto.ConviteRequestDTO;
import com.techfree.model.Convite;
import com.techfree.model.Freelancer;
import com.techfree.model.Projeto;
import com.techfree.repository.ConviteRepository;
import com.techfree.repository.FreelancerRepository;
import com.techfree.repository.ProjetoRepository;
import com.techfree.enums.StatusConvite;
import com.techfree.enums.StatusProjeto;
import com.techfree.enums.TituloDeNotificacao;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;


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

    public Convite criarConvite(ConviteRequestDTO dto, String emailFreelancer) {
        Freelancer freelancer = freelancerRepository.findByEmail(emailFreelancer)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Freelancer não encontrado"
                ));

        Projeto projeto = projetoRepository.findById(dto.getProjetoId())
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Projeto não encontrado"
                ));

        if(projeto.getFreelancerSelecionado() != null) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT, // 409
                "Este projeto já tem um freelancer selecionado"
                );
        }

        Convite convite = new Convite();
        convite.setFreelancer(freelancer);
        convite.setProjeto(projeto);
        convite.setMensagem(dto.getMensagem());
        convite.setStatus(StatusConvite.ENVIADO);

        return conviteRepository.save(convite);
    }


    public List<Convite> listarPorFreelancer(String email) {
        Freelancer freelancer = freelancerRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Freelancer não encontrado"
                ));
        return conviteRepository.findByFreelancerId(freelancer.getId());
    }

    public List<Convite> listarPorEmpresa(String emailEmpresa) {
        List<Projeto> projetos = projetoRepository.findByEmpresaEmail(emailEmpresa);
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

        if (!convite.getProjeto().getEmpresa().getEmail().equals(email)) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN, // 403
                "Você não tem permissão para deletar este convite"
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

        if (!convite.getFreelancer().getEmail().equals(email)) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN, // 403
                "Você não tem permissão para aceitar este convite"
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
            "Você aceitou o convite para o projeto: " + convite.getProjeto().getTitulo(),
            convite.getFreelancer().getUsuario()
        );

        return convite;
    }

    public Convite recusarConvite(Long id, String email) {
        Convite convite = conviteRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Convite não encontrado"
                ));

        if (!convite.getFreelancer().getEmail().equals(email)) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN, // 403
                "Você não tem permissão para recusar este convite"
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
            "Você recusou o convite para o projeto: " + convite.getProjeto().getTitulo(),
            convite.getFreelancer().getUsuario()
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
