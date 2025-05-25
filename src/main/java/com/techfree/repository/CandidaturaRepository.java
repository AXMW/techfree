package com.techfree.repository;
import com.techfree.model.Candidatura;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CandidaturaRepository extends JpaRepository<Candidatura, Long> {
    Optional<Candidatura> findById(Long id);
    List<Candidatura> findByFreelancerId(Long freelancerId);
    List<Candidatura> findByProjetoId(Long projetoId);
    List<Candidatura> findByStatus(String status);
    List<Candidatura> findByStatusAndFreelancerId(String status, Long freelancerId);
    List<Candidatura> findByStatusAndProjetoId(String status, Long projetoId);
    List<Candidatura> findByStatusAndFreelancerIdAndProjetoId(String status, Long freelancerId, Long projetoId);
    
}
