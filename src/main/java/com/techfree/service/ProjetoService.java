package com.techfree.service;
import com.techfree.model.Candidatura;
import com.techfree.model.Empresa;
import com.techfree.model.Freelancer;
import com.techfree.model.Projeto;
import com.techfree.repository.EmpresaRepository;
import com.techfree.repository.FreelancerRepository;
import com.techfree.repository.ProjetoRepository;
import com.techfree.service.email.EmailTemplateService;
import com.techfree.specifications.ProjetoSpecification;
import com.techfree.repository.CandidaturaRepository;
import com.techfree.enums.StatusCandidatura;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.techfree.dto.ProjetoFiltroDTO;
import com.techfree.dto.ProjetoRequestDTO;
import com.techfree.dto.SelecionarFreelancerRequestDTO;

import java.util.List;

@Service
public class ProjetoService {

    @Autowired
    private final ProjetoRepository projetoRepository;

    @Autowired
    private FreelancerRepository freelancerRepository;

    @Autowired
    private CandidaturaRepository candidaturaRepository;

    @Autowired
    private NotificacaoService notificacaoService;

    @Autowired
    private EmailService emailService;

    @Autowired
    public ProjetoService(ProjetoRepository projetoRepository) {
        this.projetoRepository = projetoRepository;
    }

    @Autowired
    private EmpresaRepository empresaRepository;

    public List<Projeto> listarTodos() {
        return projetoRepository.findAll();
    }

    public Projeto criarProjeto(ProjetoRequestDTO dto, String emailEmpresa) {
        Empresa empresa = empresaRepository.findByEmail(emailEmpresa)
            .orElseThrow(() -> new RuntimeException("Empresa não encontrada"));

        Projeto projeto = new Projeto();
        projeto.setTitulo(dto.getTitulo());
        projeto.setDescricao(dto.getDescricao());
        projeto.setRequisitos(dto.getRequisitos());
        projeto.setOrcamento(dto.getOrcamento());
        projeto.setEmpresa(empresa);

        return projetoRepository.save(projeto);
    }

    public List<Projeto> listarPorEmpresa(String emailEmpresa) {
        Empresa empresa = empresaRepository.findByEmail(emailEmpresa)
            .orElseThrow(() -> new RuntimeException("Empresa não encontrada"));
        return projetoRepository.findByEmpresaId(empresa.getId());
    }

    public Projeto atualizarProjeto(Long id, ProjetoRequestDTO dto, String emailEmpresa) {
        Projeto projeto = projetoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));

        if (!projeto.getEmpresa().getUsuario().getEmail().equals(emailEmpresa)) {
            throw new RuntimeException("Acesso negado");
        }

        projeto.setTitulo(dto.getTitulo());
        projeto.setDescricao(dto.getDescricao());
        projeto.setRequisitos(dto.getRequisitos());
        projeto.setOrcamento(dto.getOrcamento());

        return projetoRepository.save(projeto);
    }

    public void deletarProjeto(Long id, String emailEmpresa) {
        Projeto projeto = projetoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));

        if (!projeto.getEmpresa().getUsuario().getEmail().equals(emailEmpresa)) {
            throw new RuntimeException("Acesso negado");
        }

        projetoRepository.delete(projeto);
    }

    public void selecionarFreelancer(String emailEmpresa, SelecionarFreelancerRequestDTO dto) {
        Projeto projeto = projetoRepository.findById(dto.getProjetoId())
            .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));

    if (!projeto.getEmpresa().getUsuario().getEmail().equals(emailEmpresa)) {
        throw new RuntimeException("Você não tem permissão para selecionar freelancer nesse projeto.");
    }

    Freelancer freelancer = freelancerRepository.findById(dto.getFreelancerId())
            .orElseThrow(() -> new RuntimeException("Freelancer não encontrado"));

    // 1️⃣ Verifica se esse freelancer se candidatou ao projeto
    Candidatura candidatura = candidaturaRepository.findByProjetoAndFreelancer(projeto, freelancer)
            .orElseThrow(() -> new RuntimeException("Esse freelancer não se candidatou ao projeto."));

    // 2️⃣ Atualiza status da candidatura para "Selecionado"
    candidatura.setStatus(StatusCandidatura.ACEITA);
    candidaturaRepository.save(candidatura);

    // 3️⃣ Atualiza o projeto
    projeto.setFreelancerSelecionado(freelancer);
    projetoRepository.save(projeto);

    // 4️⃣ Cria uma notificação persistente
    notificacaoService.criarNotificacao(freelancer.getUsuario(), 
        "Você foi selecionado para o projeto: " + projeto.getTitulo());

    // 5️⃣ Envia um e-mail
    emailService.enviar(
        freelancer.getUsuario().getEmail(),
        "Você foi selecionado para o projeto " + projeto.getTitulo(),
        EmailTemplateService.templateSelecionadoProjeto(freelancer.getNome(), projeto.getTitulo())
    );
    }

    public List<Projeto> filtrarProjetos(ProjetoFiltroDTO filtro) {
        return projetoRepository.findAll(ProjetoSpecification.comFiltros(filtro));
    }
}
