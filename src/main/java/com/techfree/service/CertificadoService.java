package com.techfree.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.techfree.dto.CertificadoRequestDTO;
import com.techfree.dto.CertificadoResponseDTO;
import com.techfree.model.Certificado;
import com.techfree.repository.CertificadoRepository;
import com.techfree.repository.FreelancerRepository;
import java.util.List;

@Service
public class CertificadoService {
     @Autowired
    private CertificadoRepository certificadoRepository;

    @Autowired
    private FreelancerRepository freelancerRepository;

    public List<CertificadoResponseDTO> listarPorFreelancer(String email) {
        var freelancer = freelancerRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Freelancer não encontrado"));

        return certificadoRepository.findByFreelancer(freelancer)
                .stream().map(CertificadoResponseDTO::new).toList();
    }

    public CertificadoResponseDTO cadastrar(String email, CertificadoRequestDTO dto) {
        var freelancer = freelancerRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Freelancer não encontrado"));

        var c = new Certificado();
        c.setTitulo(dto.getTitulo());
        c.setInstituicao(dto.getInstituicao());
        c.setDataConclusao(dto.getDataConclusao());
        c.setFreelancer(freelancer);

        certificadoRepository.save(c);
        return new CertificadoResponseDTO(c);
    }

    public CertificadoResponseDTO atualizar(Long id, String email, CertificadoRequestDTO dto) {
        var certificado = certificadoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Certificado não encontrado"));

        if (!certificado.getFreelancer().getUsuario().getEmail().equals(email)) {
            throw new RuntimeException("Acesso negado");
        }

        certificado.setTitulo(dto.getTitulo());
        certificado.setInstituicao(dto.getInstituicao());
        certificado.setDataConclusao(dto.getDataConclusao());
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
}
