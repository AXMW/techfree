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
import com.techfree.enums.TituloDeNotificacao;


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
            .orElseThrow(() -> new RuntimeException("Freelancer não encontrado"));

        Projeto projeto = projetoRepository.findById(dto.getProjetoId())
            .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));

        Convite convite = new Convite();
        convite.setFreelancer(freelancer);
        convite.setProjeto(projeto);
        convite.setMensagem(dto.getMensagem());
        convite.setStatus(StatusConvite.ENVIADO);

        return conviteRepository.save(convite);
    }


    public List<Convite> listarPorFreelancer(String email) {
        Freelancer freelancer = freelancerRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Freelancer não encontrado"));
        return conviteRepository.findByFreelancerId(freelancer.getId());
    }

    public List<Convite> listarPorEmpresa(String emailEmpresa) {
        List<Projeto> projetos = projetoRepository.findByEmpresaEmail(emailEmpresa);
        if (projetos == null || projetos.isEmpty()) {
            throw new RuntimeException("Empresa não encontrada");
        }
        return projetos.stream()
             .flatMap(projeto -> conviteRepository.findByProjetoId(projeto.getId()).stream())
             .collect(Collectors.toList());
    }

    public void deletar(Long id, String email) {
        Convite convite = conviteRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Convite não encontrado"));

        if (!convite.getProjeto().getEmpresa().getEmail().equals(email)) {
            throw new RuntimeException("Você não tem permissão para deletar este convite");
        }

        conviteRepository.delete(convite);
    }

    public Convite aceitarConvite(Long id, String email) {
        Convite convite = conviteRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Convite não encontrado"));

        if (!convite.getFreelancer().getEmail().equals(email)) {
            throw new RuntimeException("Você não tem permissão para aceitar este convite");
        }

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
            .orElseThrow(() -> new RuntimeException("Convite não encontrado"));

        if (!convite.getFreelancer().getEmail().equals(email)) {
            throw new RuntimeException("Você não tem permissão para recusar este convite");
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
            .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));

        if (!projeto.getEmpresa().getUsuario().getEmail().equals(emailEmpresa)) {
            throw new RuntimeException("Você não é dono deste projeto");
        }

        return conviteRepository.findByProjetoId(projetoId);
    }

}
