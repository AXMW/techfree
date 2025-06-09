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
import com.techfree.enums.TituloDeNotificacao;
import com.techfree.service.email.EmailTemplateService;

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
    

    public Candidatura criarCandidatura(CandidaturaRequestDTO dto, String emailFreelancer) {
        Freelancer freelancer = freelancerRepository.findByEmail(emailFreelancer)
            .orElseThrow(() -> new RuntimeException("Freelancer não encontrado"));

        Projeto projeto = projetoRepository.findById(dto.getProjetoId())
            .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));
        
        if(candidaturaRepository.existsByFreelancerIdAndProjetoId(freelancer.getId(), projeto.getId())) {
            throw new RuntimeException("Você já se candidatou a este projeto");
        }

        Candidatura candidatura = new Candidatura();
        candidatura.setFreelancer(freelancer);
        candidatura.setProjeto(projeto);
        candidatura.setMensagem(dto.getMensagem());

        return candidaturaRepository.save(candidatura);
    }

    public List<Candidatura> listarPorFreelancer(String email) {
        Freelancer freelancer = freelancerRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Freelancer não encontrado"));
        return candidaturaRepository.findByFreelancerId(freelancer.getId());
    }

    public void deletar(Long id, String email) {
        Candidatura c = candidaturaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Candidatura não encontrada"));

        if (!c.getFreelancer().getUsuario().getEmail().equals(email)) {
            throw new RuntimeException("Acesso negado");
        }

        candidaturaRepository.delete(c);
    }

    public List<Candidatura> listarPorProjeto(Long projetoId, String emailEmpresa) {
        Projeto projeto = projetoRepository.findById(projetoId)
            .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));

        if (!projeto.getEmpresa().getUsuario().getEmail().equals(emailEmpresa)) {
            throw new RuntimeException("Você não é dono deste projeto");
        }

        return candidaturaRepository.findByProjetoId(projetoId);
    }

    public void atualizarStatus(Long candidaturaId, StatusCandidatura novoStatus, String emailEmpresa) {
        Candidatura candidatura = candidaturaRepository.findById(candidaturaId)
            .orElseThrow(() -> new RuntimeException("Candidatura não encontrada"));

        Projeto projeto = candidatura.getProjeto();

        if (!projeto.getEmpresa().getUsuario().getEmail().equals(emailEmpresa)) {
            throw new RuntimeException("Você não tem permissão para alterar esta candidatura");
        }

        String nome = candidatura.getFreelancer().getNome();
        String titulo = projeto.getTitulo();
        StatusCandidatura status = novoStatus;

        emailService.enviarHtml(
            candidatura.getFreelancer().getUsuario().getEmail(),
            "Sua candidatura foi " + status.name().toLowerCase(),
            emailTemplateService.gerarTemplate(nome, titulo, status)
        );

        notificacaoService.notificar(TituloDeNotificacao.CANDIDATURA_ENVIADA,
            "Sua candidatura para o projeto '" + titulo + "' foi " + status.name().toLowerCase(),
            candidatura.getFreelancer().getUsuario(), projeto.getEmpresa().getUsuario()
        );
    }
}
