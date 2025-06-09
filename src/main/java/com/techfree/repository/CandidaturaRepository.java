package com.techfree.repository;
import com.techfree.model.Candidatura;
import com.techfree.model.Freelancer;
import com.techfree.model.Projeto;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.lang.NonNull;

public interface CandidaturaRepository extends JpaRepository<Candidatura, Long> {
    @NonNull Optional<Candidatura> findById(@NonNull Long id);
    Optional<Candidatura> findByProjetoAndFreelancer(Projeto projeto, Freelancer freelancer);
    List<Candidatura> findByFreelancerId(Long freelancerId);
    List<Candidatura> findByProjetoId(Long projetoId);
    List<Candidatura> findByStatus(String status);
    List<Candidatura> findByStatusAndFreelancerId(String status, Long freelancerId);
    List<Candidatura> findByStatusAndProjetoId(String status, Long projetoId);
    List<Candidatura> findByStatusAndFreelancerIdAndProjetoId(String status, Long freelancerId, Long projetoId);
    boolean existsByFreelancerIdAndProjetoId(Long freelancerId, Long projetoId);
    
}
