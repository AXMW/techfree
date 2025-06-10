package com.techfree.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.techfree.model.Flag;
import com.techfree.repository.UsuarioRepository;
import com.techfree.repository.ProjetoRepository;
import com.techfree.repository.FlagRepository;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class FlagService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProjetoRepository projetoRepository;

    @Autowired
    private FlagRepository flagRepository;

    public void criarFlag(Long usuarioId, Long projetoId) {

        Flag flag = new Flag();

        flag.setUsuario(usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado")));

        flag.setProjeto(projetoRepository.findById(projetoId)
            .orElseThrow(() -> new RuntimeException("Projeto não encontrado")));
        flag.setDataCriacao(LocalDateTime.now());

        flagRepository.save(flag);
    }

    public void removerFlag(Long usuarioId, Long projetoId) {
        Flag flag = flagRepository.findByUsuarioIdAndProjetoId(usuarioId, projetoId)
            .orElseThrow(() -> new RuntimeException("Flag não encontrada"));
        flagRepository.delete(flag);
    }

    public List<Flag> listarFlagsPorUsuario(Long usuarioId) {
        return flagRepository.findByUsuarioId(usuarioId);
    }

}
