package com.techfree.service;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.techfree.dto.AvaliacaoFreelancerRequestDTO;
import com.techfree.dto.AvaliacaoFreelancerResponseDTO;
import com.techfree.model.AvaliacaoFreelancer;
import com.techfree.model.Empresa;
import com.techfree.model.Projeto;
import com.techfree.repository.AvaliacaoFreelancerRepository;
import com.techfree.repository.EmpresaRepository;
import com.techfree.repository.ProjetoRepository;
import com.techfree.model.Usuario;
import com.techfree.repository.UsuarioRepository;

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

    public AvaliacaoFreelancerResponseDTO criar(String emailEmpresa, AvaliacaoFreelancerRequestDTO dto) {
        Projeto projeto = projetoRepository.findById(dto.getProjetoId())
            .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));

        Usuario usuario = usuarioRepository.findByEmail(emailEmpresa)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Empresa empresa = empresaRepository.findByUsuario(usuario)
            .orElseThrow(() -> new RuntimeException("Empresa não encontrada"));

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
}
