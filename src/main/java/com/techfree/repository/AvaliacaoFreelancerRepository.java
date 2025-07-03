package com.techfree.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.techfree.model.AvaliacaoFreelancer;
import com.techfree.model.Freelancer;
import com.techfree.model.Empresa;
import com.techfree.model.Projeto;
import java.util.Optional;
import java.util.List;

@Repository
public interface AvaliacaoFreelancerRepository extends JpaRepository<AvaliacaoFreelancer, Long> {
    List<AvaliacaoFreelancer> findByFreelancer(Freelancer freelancer);
    List<AvaliacaoFreelancer> findByProjetoId(Long projetoId);
    List<AvaliacaoFreelancer> findByEmpresaId(Long empresaId);
    List<AvaliacaoFreelancer> findByEmpresa(Empresa empresa);
    Optional<AvaliacaoFreelancer> findByProjeto(Projeto projeto);
    Optional<AvaliacaoFreelancer> findByFreelancerAndProjeto(Freelancer freelancer, Projeto projeto);
}
