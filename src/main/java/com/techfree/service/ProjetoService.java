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
import com.techfree.enums.StatusProjeto;
import com.techfree.enums.TituloDeNotificacao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.techfree.dto.ProjetoFiltroDTO;
import com.techfree.dto.ProjetoRequestDTO;
import com.techfree.dto.SelecionarFreelancerRequestDTO;
import com.techfree.model.Usuario;
import com.techfree.repository.UsuarioRepository;

import java.time.LocalDate;
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
    private CandidaturaService candidaturaService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private FlagService flagService;

    public ProjetoService(ProjetoRepository projetoRepository) {
        this.projetoRepository = projetoRepository;
    }

    @Autowired
    private EmpresaRepository empresaRepository;

    public List<Projeto> listarTodos() {
        return projetoRepository.findAll();
    }

    public List<Projeto> listarTodosAbertos() {
        return projetoRepository.findByStatus(StatusProjeto.ABERTO);
    }

    public List<Projeto> listarTodosAbertosEmpresa(String emailEmpresa) {
        return projetoRepository.findByStatusAndEmpresaUsuarioEmail(StatusProjeto.ABERTO, emailEmpresa);
    }

    public List<Projeto> listarTodosEmAndamentoEmpresa(String emailEmpresa) {
        return projetoRepository.findByStatusAndEmpresaUsuarioEmail(StatusProjeto.EM_ANDAMENTO, emailEmpresa);
    }

    public List<Projeto> listarTodosConcluidosEmpresa(String emailEmpresa) {
        return projetoRepository.findByStatusAndEmpresaUsuarioEmail(StatusProjeto.CONCLUIDO, emailEmpresa);
    }

    public List<Projeto> listarTodosEmAndamentoFreelancer(String emailFreelancer) {
        return projetoRepository.findByStatusAndFreelancerSelecionadoUsuarioEmail(StatusProjeto.EM_ANDAMENTO, emailFreelancer);
    }

    public List<Projeto> listarTodosConcluidoFreelancer(String emailFreelancer) {
        return projetoRepository.findByStatusAndFreelancerSelecionadoUsuarioEmail(StatusProjeto.CONCLUIDO, emailFreelancer);
    }

    public List<Projeto> listarTodosCanceladorFreelancer(String emailFreelancer) {
        return projetoRepository.findByStatusAndFreelancerSelecionadoUsuarioEmail(StatusProjeto.CANCELADO, emailFreelancer);
    }

    public List<Projeto> listarTodosEmRevisaoFreelancer(String emailFreelancer) {
        return projetoRepository.findByStatusAndFreelancerSelecionadoUsuarioEmail(StatusProjeto.REVISAO, emailFreelancer);
    }

    public Projeto criarProjeto(ProjetoRequestDTO dto, String emailEmpresa) {

        Usuario usuario = usuarioRepository.findByEmail(emailEmpresa)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Usuário não encontrado"
                ));

        Empresa empresa = empresaRepository.findByUsuario(usuario)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Empresa não encontrada"
                ));

        Projeto projeto = new Projeto();
        projeto.setTitulo(dto.getTitulo());
        projeto.setSubtitulo(dto.getSubtitulo());
        projeto.setGrauexperience(dto.getGrauexperience());
        projeto.setDescricao(dto.getDescricao());
        projeto.setRequisitos(dto.getRequisitos());
        projeto.setOrcamento(dto.getOrcamento());
        projeto.setDuracao(dto.getDuracao());
        projeto.setEmailPraContato(dto.getEmailPraContato());
        projeto.setStatus(StatusProjeto.ABERTO);
        projeto.setEmpresa(empresa);

        return projetoRepository.save(projeto);
    }

    public List<Projeto> listarPorEmpresa(String emailEmpresa) {

        Usuario usuario = usuarioRepository.findByEmail(emailEmpresa)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Usuário não encontrado"
                ));

        Empresa empresa = empresaRepository.findByUsuario(usuario)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Empresa não encontrada"
                ));
        return projetoRepository.findByEmpresaId(empresa.getId());
    }

    public Projeto atualizarProjeto(Long id, ProjetoRequestDTO dto, String emailEmpresa) {
        Projeto projeto = projetoRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Projeto não encontrado"
                ));

        if (!projeto.getEmpresa().getUsuario().getEmail().equals(emailEmpresa)) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN, // 403
                "Acesso negado"
                );
        }

        if(dto.getDuracao() != 0 && dto.getDuracao() != projeto.getDuracao() && projeto.getStatus() == StatusProjeto.EM_ANDAMENTO) {
            projeto.setPrazoEntrega(projeto.getDataInicio().plusMonths(dto.getDuracao()));
        }

        if(dto.getTitulo() != null) projeto.setTitulo(dto.getTitulo());
        if(dto.getSubtitulo() != null) projeto.setSubtitulo(dto.getSubtitulo());
        if(dto.getGrauexperience() != null) projeto.setGrauexperience(dto.getGrauexperience());
        if(dto.getDescricao() != null) projeto.setDescricao(dto.getDescricao());
        if(dto.getRequisitos() != null) projeto.setRequisitos(dto.getRequisitos());
        if(dto.getOrcamento() != null) projeto.setOrcamento(dto.getOrcamento());
        if(dto.getDuracao() != 0) projeto.setDuracao(dto.getDuracao());
        if(dto.getEmailPraContato() != null) projeto.setEmailPraContato(dto.getEmailPraContato());
        
        return projetoRepository.save(projeto);
    }

    public Projeto atualizarStatusProjeto(Long id, String emailEmpresa) {
        Projeto projeto = projetoRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Projeto não encontrado"
                ));

        if (!projeto.getEmpresa().getUsuario().getEmail().equals(emailEmpresa)) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN, // 403
                "Acesso negado"
                );
        }

        if(projeto.getStatus() != StatusProjeto.REVISAO) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, // 400
                "O projeto não está em revisão"
                );
        }

        try {
            projeto.setStatus(StatusProjeto.CONCLUIDO);
            projetoRepository.save(projeto);
            return projeto;
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, // 400
                "Status inválido"
                );
        }
    }

    public Projeto atualizarStatusProjetoRevisao(Long id, String emailFreelancer) {
        Projeto projeto = projetoRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Projeto não encontrado"
                ));

        if (!projeto.getFreelancerSelecionado().getUsuario().getEmail().equals(emailFreelancer)) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN, // 403
                "Acesso negado"
                );
        }

        if(projeto.getStatus() != StatusProjeto.EM_ANDAMENTO) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, // 400
                "O projeto não está em andamento"
                );
        }

        try {
            projeto.setStatus(StatusProjeto.REVISAO);
            projetoRepository.save(projeto);
            return projeto;
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, // 400
                "Status inválido"
                );
        }
    }

    public Projeto atualizarStatusProjetoEmAndamento(Long id, String emailEmpresa) {
        Projeto projeto = projetoRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Projeto não encontrado"
                ));

        if (!projeto.getEmpresa().getUsuario().getEmail().equals(emailEmpresa)) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN, // 403
                "Acesso negado"
                );
        }

        if(projeto.getStatus() == StatusProjeto.CANCELADO || projeto.getStatus() == StatusProjeto.CONCLUIDO) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, // 400
                "O projeto não pode ser colocado em andamento"
                );
        }

        try {
            projeto.setStatus(StatusProjeto.EM_ANDAMENTO);
            projeto.setDataInicio(LocalDate.now());
            projeto.setPrazoEntrega(LocalDate.now().plusMonths(projeto.getDuracao()));
            projetoRepository.save(projeto);
            return projeto;
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, // 400
                "Status inválido"
                );
        }
    }

    public Projeto cancelarProjeto(Long id, String email) {
        Projeto projeto = projetoRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Projeto não encontrado"
                ));

        if (!projeto.getEmpresa().getUsuario().getEmail().equals(email) && 
            (projeto.getFreelancerSelecionado() == null || !projeto.getFreelancerSelecionado().getUsuario().getEmail().equals(email))) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN, // 403
                "Acesso negado"
                );
        }

        if(projeto.getStatus() == StatusProjeto.CANCELADO) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, // 400
                "O projeto já está cancelado"
                );
        }

        if(projeto.getStatus() == StatusProjeto.CONCLUIDO) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, // 400
                "O projeto já está concluído"
                );
        }

        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Usuário não encontrado"
                ));

        flagService.criarFlag(usuario.getId(), id);

        usuario.setQuantidadeDeFlags(usuario.getQuantidadeDeFlags() + 1);
        if (usuario.getQuantidadeDeFlags() >= 3) {
            usuario.setEnabled(false); // Desabilita o usuário se atingir 3 flags
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN, // 403
                "Usuário desabilitado devido a muitas flags"
                );
        }
        usuarioRepository.save(usuario);

        projeto.setStatus(StatusProjeto.CANCELADO);
        projetoRepository.save(projeto);

        return projeto;
    }

    public void deletarProjeto(Long id, String emailEmpresa) {
        Projeto projeto = projetoRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Projeto não encontrado"
                ));

        if (!projeto.getEmpresa().getUsuario().getEmail().equals(emailEmpresa)) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN, // 403 
                "Acesso negado"
                );
        }

        projetoRepository.delete(projeto);
    }

    public void selecionarFreelancer(String emailEmpresa, SelecionarFreelancerRequestDTO dto) {
        Projeto projeto = projetoRepository.findById(dto.getProjetoId())
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Projeto não encontrado"
                ));

        if (!projeto.getEmpresa().getUsuario().getEmail().equals(emailEmpresa)) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN, // 403
                "Você não tem permissão para selecionar freelancer nesse projeto."
                );
        }

        Freelancer freelancer = freelancerRepository.findById(dto.getFreelancerId())
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND, // 404
                    "Freelancer não encontrado"
                    ));

        // 1️⃣ Verifica se esse freelancer se candidatou ao projeto
        Candidatura candidatura = candidaturaRepository.findByProjetoAndFreelancer(projeto, freelancer)
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, // 400
                    "Esse freelancer não se candidatou ao projeto."
                    ));

        // 2️⃣ Atualiza status da candidatura para "Selecionado"
        candidatura.setStatus(StatusCandidatura.ACEITA);
        candidaturaRepository.save(candidatura);

        // 3️⃣ Atualiza o projeto
        projeto.setMensagem(dto.getMensagem());
        projeto.setDataInicio(LocalDate.now());
        projeto.setPrazoEntrega(LocalDate.now().plusMonths(projeto.getDuracao()));
        projeto.setStatus(StatusProjeto.EM_ANDAMENTO);
        projeto.setFreelancerSelecionado(freelancer);
        projetoRepository.save(projeto);

        // 4️⃣ Cria uma notificação persistente
        notificacaoService.criarNotificacao(TituloDeNotificacao.APROVACAO_DE_CANDIDATURA, freelancer.getUsuario(), 
            "Você foi selecionado para o projeto: " + projeto.getTitulo(), projeto.getEmpresa().getUsuario());

        // 5️⃣ Envia um e-mail
        emailService.enviar(
            freelancer.getUsuario().getEmail(),
            "Você foi selecionado para o projeto " + projeto.getTitulo(),
            EmailTemplateService.templateSelecionadoProjeto(freelancer.getNome(), projeto.getTitulo())
        );

        // 6️⃣ Recusa todas as outras candidaturas dos outros freelancer para esse projeto
        List<Candidatura> candidaturas = candidaturaRepository.findByProjetoAndStatus(projeto, StatusCandidatura.ENVIADA);
        for (Candidatura c : candidaturas) {
            if (!c.getFreelancer().getId().equals(freelancer.getId())) {
                candidaturaService.recusarCandidatura(c.getId(), emailEmpresa);
            }
        }
    }

    public List<Projeto> filtrarProjetos(ProjetoFiltroDTO filtro) {
        return projetoRepository.findAll(ProjetoSpecification.comFiltros(filtro));
    }

    public Projeto obterPorId(Long id, String email) {
        Projeto projeto = projetoRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Projeto não encontrado"
                ));

        //VALIDAÇÃO BURRA
        //if (!projeto.getEmpresa().getUsuario().getEmail().equals(email) && 
        //    (projeto.getFreelancerSelecionado() == null || !projeto.getFreelancerSelecionado().getUsuario().getEmail().equals(email))) {
        //    throw new RuntimeException("Acesso negado");
        //}

        return projeto;
    }
}
