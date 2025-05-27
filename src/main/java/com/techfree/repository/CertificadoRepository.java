package com.techfree.repository;
import com.techfree.model.Certificado;
import com.techfree.model.Freelancer;

import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface CertificadoRepository extends JpaRepository<Certificado, Long> {
    Optional<Certificado> findById(Long id);
    List<Certificado> findByFreelancer(Certificado freelancer);
    List<Certificado> findByFreelancer(Freelancer freelancer);
    List<Certificado> findByFreelancerId(Long freelancerId);
    List<Certificado> findByTipo(String tipo);
    List<Certificado> findByTipoAndFreelancerId(String tipo, Long freelancerId);
    List<Certificado> findByTipoAndFreelancerIdAndDataEmissao(String tipo, Long freelancerId, LocalDate dataEmissao);
    
}
