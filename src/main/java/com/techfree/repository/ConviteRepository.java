package com.techfree.repository;

import com.techfree.model.Convite;
import com.techfree.model.Freelancer;
import com.techfree.model.Projeto;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.lang.NonNull;

public interface ConviteRepository extends JpaRepository<Convite, Long> {
    @NonNull Optional<Convite> findById(@NonNull Long id);
    Optional<Convite> findByProjetoAndFreelancer(Projeto projeto, Freelancer freelancer);
    List<Convite> findByFreelancerId(Long freelancerId);
    List<Convite> findByProjetoId(Long projetoId);
}
