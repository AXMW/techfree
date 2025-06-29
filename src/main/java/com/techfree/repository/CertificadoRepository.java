package com.techfree.repository;
import com.techfree.model.Certificado;
import com.techfree.model.Freelancer;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import org.springframework.lang.NonNull;
import com.techfree.model.Usuario;
import com.techfree.model.Projeto;

public interface CertificadoRepository extends JpaRepository<Certificado, Long> {
    @NonNull Optional<Certificado> findById(@NonNull Long id);
    List<Certificado> findByFreelancer(Certificado freelancer);
    List<Certificado> findByFreelancer(Freelancer freelancer);
    List<Certificado> findByFreelancerId(Long freelancerId);
    Optional<Certificado> findByFreelancerUsuarioAndId(Usuario usuario, Long id);
    Optional<Certificado> findByFreelancerAndProjeto(Freelancer freelancer, Projeto projeto);
}
