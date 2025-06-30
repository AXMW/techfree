package com.techfree.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.techfree.dto.CertificadoRequestDTO;
import com.techfree.dto.CertificadoResponseDTO;
import com.techfree.enums.TituloDeNotificacao;
import com.techfree.model.Certificado;
import com.techfree.repository.CertificadoRepository;
import com.techfree.repository.FreelancerRepository;
import com.techfree.repository.ProjetoRepository;
import com.techfree.model.Projeto;
import java.util.List;
import com.techfree.model.Usuario;
import com.techfree.repository.UsuarioRepository;

@Service

public class CertificadoService {
    @Autowired
    private CertificadoRepository certificadoRepository;

    @Autowired
    private FreelancerRepository freelancerRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProjetoRepository projetoRepository;

    @Autowired
    private NotificacaoService notificacaoService;

    public List<CertificadoResponseDTO> listarPorFreelancer(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        var freelancer = freelancerRepository.findByUsuario(usuario)
            .orElseThrow(() -> new RuntimeException("Freelancer não encontrado"));

        return certificadoRepository.findByFreelancer(freelancer)
                .stream().map(CertificadoResponseDTO::new).toList();
    }   

    public CertificadoResponseDTO cadastrar(String email, CertificadoRequestDTO dto) {
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        var freelancer = freelancerRepository.findByUsuario(usuario)
            .orElseThrow(() -> new RuntimeException("Freelancer não encontrado"));

        Projeto projeto = projetoRepository.findById(dto.getProjetoId())
            .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));

        var c = new Certificado();
        c.setTitulo(dto.getTitulo());
        c.setDescricao(dto.getDescricao());
        c.setCargaHoraria(dto.getCargaHoraria());
        c.setDataConclusao(dto.getDataConclusao());
        c.setFreelancer(freelancer);
        c.setProjeto(projeto);

        notificacaoService.criarNotificacao(TituloDeNotificacao.CERTIFICADO_DE_CONCLUSAO, freelancer.getUsuario(),
            "Você recebeu um certificado de conclusão", null, projeto.getId());

        certificadoRepository.save(c);
        return new CertificadoResponseDTO(c);
    }

    public CertificadoResponseDTO atualizar(Long id, String email, CertificadoRequestDTO dto) {
        var certificado = certificadoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Certificado não encontrado"));

        if (!certificado.getFreelancer().getUsuario().getEmail().equals(email)) {
            throw new RuntimeException("Acesso negado");
        }

        Projeto projeto = projetoRepository.findById(dto.getProjetoId())
            .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));

        certificado.setTitulo(dto.getTitulo());
        certificado.setDescricao(dto.getDescricao());
        certificado.setCargaHoraria(dto.getCargaHoraria());
        certificado.setDataConclusao(dto.getDataConclusao());
        certificado.setProjeto(projeto);
        certificadoRepository.save(certificado);
        return new CertificadoResponseDTO(certificado);
    }

    public void deletar(Long id, String email) {
        var certificado = certificadoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Certificado não encontrado"));

        if (!certificado.getFreelancer().getUsuario().getEmail().equals(email)) {
            throw new RuntimeException("Acesso negado");
        }

        certificadoRepository.delete(certificado);
    }

    public CertificadoResponseDTO buscarPorId(Long id, String email) {
        var certificado = certificadoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Certificado não encontrado"));

        if (!certificado.getFreelancer().getUsuario().getEmail().equals(email)) {
            throw new RuntimeException("Acesso negado");
        }

        return new CertificadoResponseDTO(certificado);
    }

    public Certificado buscarPorIdEUsuario(Long id, String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        Certificado certificado = certificadoRepository.findByFreelancerUsuarioAndId(usuario, id)
            .orElseThrow(() -> new RuntimeException("Certificado não encontrado"));
        
        return certificado;
    }  

    public CertificadoResponseDTO listarPorProjeto(Long projetoId, String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        var freelancer = freelancerRepository.findByUsuario(usuario)
            .orElseThrow(() -> new RuntimeException("Freelancer não encontrado"));

        Projeto projeto = projetoRepository.findById(projetoId)
            .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));
        Certificado certificado = certificadoRepository.findByFreelancerAndProjeto(freelancer, projeto)
            .orElseThrow(() -> new RuntimeException("Certificado não encontrado"));
        return new CertificadoResponseDTO(certificado);
    }
}
