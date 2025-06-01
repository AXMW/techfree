package com.techfree.repository;
import com.techfree.model.Projeto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.util.List;
import java.util.Optional;

public interface ProjetoRepository extends JpaRepository<Projeto, Long>, JpaSpecificationExecutor<Projeto> {
    Optional<Projeto> findByTitulo(String titulo);
    List<Projeto> findByEmpresaId(Long id);
    List<Projeto> findByAtivo(boolean ativo);
    List<Projeto> findByAtivoAndTitulo(boolean ativo, String titulo);
    
}
