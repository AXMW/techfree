package com.techfree.repository;
import com.techfree.model.AvaliacaoEmpresa;
import com.techfree.model.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.techfree.model.Freelancer;
import com.techfree.model.Projeto;
import java.util.List;

@Repository
public interface AvaliacaoEmpresaRepository extends JpaRepository<AvaliacaoEmpresa, Long> {
    List<AvaliacaoEmpresa> findByEmpresa(Empresa empresa);
    List<AvaliacaoEmpresa> findByProjetoId(Long projetoId);
    List<AvaliacaoEmpresa> findByFreelancerId(Long freelancerId);
    List<AvaliacaoEmpresa> findByFreelancer(Freelancer freelancer);
    List<AvaliacaoEmpresa> findByProjeto(Projeto projeto);
}