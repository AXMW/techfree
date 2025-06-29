package com.techfree.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
import com.techfree.model.Usuario;
import com.techfree.enums.StatusProjeto;

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

    public AvaliacaoEmpresaResponseDTO criar(String emailFreelancer, AvaliacaoEmpresaRequestDTO dto) {
        Projeto projeto = projetoRepository.findById(dto.getProjetoId())
            .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));

        Usuario usuario = usuarioRepository.findByEmail(emailFreelancer)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        Freelancer freelancer = freelancerRepository.findByUsuario(usuario)
            .orElseThrow(() -> new RuntimeException("Freelancer não encontrado"));
        if(projeto.getStatus() != StatusProjeto.CONCLUIDO) {
            throw new RuntimeException("Projeto não está concluído, avaliação não permitida");
        }
        if(!projeto.getFreelancerSelecionado().equals(freelancer)) {
            throw new RuntimeException("Freelancer não é o selecionado para este projeto");
        }
        repository.findByProjeto(projeto)
            .ifPresent(avaliacao -> {
                throw new RuntimeException("Avaliação já realizada para este projeto");
            });
             

        AvaliacaoEmpresa avaliacao = new AvaliacaoEmpresa();
        avaliacao.setFreelancer(freelancer);
        avaliacao.setEmpresa(projeto.getEmpresa());
        avaliacao.setProjeto(projeto);
        avaliacao.setNota(dto.getNota());
        avaliacao.setComentario(dto.getComentario());
        avaliacao.setDataCriacao(LocalDate.now());

        repository.save(avaliacao);
        return new AvaliacaoEmpresaResponseDTO(avaliacao);
    }

    public List<AvaliacaoEmpresaResponseDTO> obterPorIdDaEmpresa(Long id) {
        Empresa empresa = empresaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Empresa não encontrada"));
        
        List<AvaliacaoEmpresa> avaliacao = repository.findByEmpresa(empresa);
            
        return avaliacao.stream()
            .map(AvaliacaoEmpresaResponseDTO::new)
            .toList();
    }

    public AvaliacaoEmpresaResponseDTO obterPorId(Long id) {
        AvaliacaoEmpresa avaliacao = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Avaliação não encontrada"));
        
        return new AvaliacaoEmpresaResponseDTO(avaliacao);
    }

    public List<AvaliacaoEmpresaResponseDTO> obterPorIdDoFreelancer(Long id) {
        Freelancer freelancer = freelancerRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Freelancer não encontrado"));
        
        List<AvaliacaoEmpresa> avaliacao = repository.findByFreelancer(freelancer);
        
        return avaliacao.stream()
            .map(AvaliacaoEmpresaResponseDTO::new)
            .toList();
    }

    public AvaliacaoEmpresaResponseDTO obterPorIdDoProjeto(Long id) {
        Projeto projeto = projetoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));
        
        AvaliacaoEmpresa avaliacao = repository.findByProjeto(projeto)
            .orElseThrow(() -> new RuntimeException("Avaliação não encontrada para este projeto"));
        
        return avaliacao != null ? new AvaliacaoEmpresaResponseDTO(avaliacao) : null;
        
    }
}
