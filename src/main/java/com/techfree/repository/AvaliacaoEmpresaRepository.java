package com.techfree.repository;
import com.techfree.model.AvaliacaoEmpresa;
import com.techfree.model.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AvaliacaoEmpresaRepository extends JpaRepository<AvaliacaoEmpresa, Long> {
    List<AvaliacaoEmpresa> findByEmpresa(Empresa empresa);
}