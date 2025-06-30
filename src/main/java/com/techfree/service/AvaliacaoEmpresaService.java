package com.techfree.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.techfree.dto.AvaliacaoEmpresaRequestDTO;
import com.techfree.dto.AvaliacaoEmpresaResponseDTO;
import com.techfree.model.AvaliacaoEmpresa;
import com.techfree.model.Freelancer;
import com.techfree.model.Projeto;
import com.techfree.repository.AvaliacaoEmpresaRepository;
import com.techfree.repository.FreelancerRepository;
import com.techfree.repository.ProjetoRepository;
import com.techfree.repository.UsuarioRepository;
import com.techfree.model.Empresa;
import com.techfree.repository.EmpresaRepository;
import org.springframework.http.HttpStatus;
import com.techfree.model.Usuario;
import com.techfree.enums.StatusProjeto;
import com.techfree.enums.TituloDeNotificacao;

@Service
public class AvaliacaoEmpresaService {
    @Autowired
    private AvaliacaoEmpresaRepository repository;

    @Autowired
    private ProjetoRepository projetoRepository;

    @Autowired
    private FreelancerRepository freelancerRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EmpresaRepository empresaRepository;

    @Autowired
    private NotificacaoService notificacaoService;

    public AvaliacaoEmpresaResponseDTO criar(String emailFreelancer, AvaliacaoEmpresaRequestDTO dto) {
        Projeto projeto = projetoRepository.findById(dto.getProjetoId())
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, 
                "Projeto não encontrado"
                ));

        Usuario usuario = usuarioRepository.findByEmail(emailFreelancer)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
            "Usuário não encontrado"
            ));
        Freelancer freelancer = freelancerRepository.findByUsuario(usuario)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Freelancer não encontrado"
            ));
        if(projeto.getStatus() != StatusProjeto.CONCLUIDO) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, // 400
                "Projeto não está concluído, avaliação não permitida"
                );
        }
        if(!projeto.getFreelancerSelecionado().equals(freelancer)) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN, // 403
                "Freelancer não é o selecionado para este projeto"
                );
        }
        repository.findByProjeto(projeto)
            .ifPresent(avaliacao -> {
                throw new ResponseStatusException(
                    HttpStatus.CONFLICT, // 409
                    "Avaliação já realizada para este projeto"
                    );
            });
             

        AvaliacaoEmpresa avaliacao = new AvaliacaoEmpresa();
        avaliacao.setFreelancer(freelancer);
        avaliacao.setEmpresa(projeto.getEmpresa());
        avaliacao.setProjeto(projeto);
        avaliacao.setNota(dto.getNota());
        avaliacao.setComentario(dto.getComentario());
        avaliacao.setDataCriacao(LocalDate.now());

        repository.save(avaliacao);

        // Notificar a empresa sobre o novo feedback
        notificacaoService.criarNotificacao(TituloDeNotificacao.FEEDBACK_RECEBIDO, projeto.getEmpresa().getUsuario(), 
            "O projeto " + projeto.getTitulo() + " foi cancelado.", null, projeto.getId());
        return new AvaliacaoEmpresaResponseDTO(avaliacao);
    }

    public List<AvaliacaoEmpresaResponseDTO> obterPorIdDaEmpresa(Long id) {
        Empresa empresa = empresaRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Empresa não encontrada"
                ));
        
        List<AvaliacaoEmpresa> avaliacao = repository.findByEmpresa(empresa);
            
        return avaliacao.stream()
            .map(AvaliacaoEmpresaResponseDTO::new)
            .toList();
    }

    public AvaliacaoEmpresaResponseDTO obterPorId(Long id) {
        AvaliacaoEmpresa avaliacao = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Avaliação não encontrada"
                ));
        
        return new AvaliacaoEmpresaResponseDTO(avaliacao);
    }

    public List<AvaliacaoEmpresaResponseDTO> obterPorIdDoFreelancer(Long id) {
        Freelancer freelancer = freelancerRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Freelancer não encontrado"
                ));
        
        List<AvaliacaoEmpresa> avaliacao = repository.findByFreelancer(freelancer);
        
        return avaliacao.stream()
            .map(AvaliacaoEmpresaResponseDTO::new)
            .toList();
    }

    public AvaliacaoEmpresaResponseDTO obterPorIdDoProjeto(Long id) {
        Projeto projeto = projetoRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Projeto não encontrado"
                ));
        
        AvaliacaoEmpresa avaliacao = repository.findByProjeto(projeto)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Avaliação não encontrada para este projeto"
                ));
        
        return avaliacao != null ? new AvaliacaoEmpresaResponseDTO(avaliacao) : null;
        
    }
}
