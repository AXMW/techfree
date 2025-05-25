package com.techfree.repository;
import com.techfree.model.Projeto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProjetoRepository extends JpaRepository<Projeto, Long> {
    Optional<Projeto> findByNome(String nome);
    List<Projeto> findByEmpresaId(Long id);
    List<Projeto> findByAtivo(boolean ativo);
    List<Projeto> findByAtivoAndTipo(boolean ativo, String tipo);
    List<Projeto> findByTipo(String tipo);
    List<Projeto> findByTipoAndAtivo(String tipo, boolean ativo);
    List<Projeto> findByTipoAndAtivoAndNome(String tipo, boolean ativo, String nome);
    List<Projeto> findByTipoAndAtivoAndCnpj(String tipo, boolean ativo, String cnpj);
    
}
