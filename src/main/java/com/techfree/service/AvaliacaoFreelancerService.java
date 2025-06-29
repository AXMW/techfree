package com.techfree.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.techfree.dto.AvaliacaoFreelancerRequestDTO;
import com.techfree.dto.AvaliacaoFreelancerResponseDTO;
import com.techfree.model.AvaliacaoFreelancer;
import com.techfree.model.Empresa;
import com.techfree.model.Freelancer;
import com.techfree.model.Projeto;
import com.techfree.repository.AvaliacaoFreelancerRepository;
import com.techfree.repository.EmpresaRepository;
import com.techfree.repository.ProjetoRepository;
import com.techfree.model.Usuario;
import com.techfree.repository.FreelancerRepository;
import com.techfree.repository.UsuarioRepository;
import com.techfree.enums.StatusProjeto;

@Service
public class AvaliacaoFreelancerService {
    @Autowired
    private AvaliacaoFreelancerRepository repository;

    @Autowired
    private ProjetoRepository projetoRepository;

    @Autowired
    private EmpresaRepository empresaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private FreelancerRepository freelancerRepository;

    public AvaliacaoFreelancerResponseDTO criar(String emailEmpresa, AvaliacaoFreelancerRequestDTO dto) {
        Projeto projeto = projetoRepository.findById(dto.getProjetoId())
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Projeto não encontrado"
                ));

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

        if(projeto.getStatus() != StatusProjeto.CONCLUIDO) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN, // 403
                "Projeto não está concluído, avaliação não permitida"
                );
        }
        if(!projeto.getEmpresa().equals(empresa)) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN, // 403
                "Empresa não é a responsável por este projeto"
                );
        }

        repository.findByProjeto(projeto)
            .ifPresent(avaliacao -> {
                throw new ResponseStatusException(
                    HttpStatus.CONFLICT, // 409
                    "Avaliação já realizada para este projeto"
                    );
            });

        AvaliacaoFreelancer avaliacao = new AvaliacaoFreelancer();
        avaliacao.setEmpresa(empresa);
        avaliacao.setFreelancer(projeto.getFreelancerSelecionado());
        avaliacao.setProjeto(projeto);
        avaliacao.setNota(dto.getNota());
        avaliacao.setComentario(dto.getComentario());
        avaliacao.setDataCriacao(LocalDate.now());

        repository.save(avaliacao);
        return new AvaliacaoFreelancerResponseDTO(avaliacao);
    }

    public List<AvaliacaoFreelancerResponseDTO> obterPorIdDoFreelancer(Long id) {
        Freelancer freelancer = freelancerRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Freelancer não encontrado"
                ));
        
        List<AvaliacaoFreelancer> avaliacao = repository.findByFreelancer(freelancer);
        
        return avaliacao.stream()
            .map(AvaliacaoFreelancerResponseDTO::new)
            .toList();
    }

    public List<AvaliacaoFreelancerResponseDTO> obterPorIdDaEmpresa(Long id) {
        Empresa empresa = empresaRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Empresa não encontrada"
                ));
        
        List<AvaliacaoFreelancer> avaliacao = repository.findByEmpresa(empresa);
            
        return avaliacao.stream()
            .map(AvaliacaoFreelancerResponseDTO::new)
            .toList();
    }

    public AvaliacaoFreelancerResponseDTO obterPorId(Long id) {
        AvaliacaoFreelancer avaliacao = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Avaliação não encontrada"
                ));
        
        return new AvaliacaoFreelancerResponseDTO(avaliacao);
    }

    public AvaliacaoFreelancerResponseDTO obterPorIdDoProjeto(Long id) {
        Projeto projeto = projetoRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Projeto não encontrado"
                ));
        
        AvaliacaoFreelancer avaliacao = repository.findByProjeto(projeto)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Avaliação não encontrada para este projeto"
                ));
        
        return  new AvaliacaoFreelancerResponseDTO(avaliacao);
    }
}
