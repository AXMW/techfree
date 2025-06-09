package com.techfree.service;

import java.time.LocalDate;

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
import com.techfree.model.Usuario;

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

    public AvaliacaoEmpresaResponseDTO criar(String emailFreelancer, AvaliacaoEmpresaRequestDTO dto) {
        Projeto projeto = projetoRepository.findById(dto.getProjetoId())
            .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));

        Usuario usuario = usuarioRepository.findByEmail(emailFreelancer)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        Freelancer freelancer = freelancerRepository.findByUsuario(usuario)
            .orElseThrow(() -> new RuntimeException("Freelancer não encontrado"));

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
}
