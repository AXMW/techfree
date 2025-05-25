package com.techfree.repository;
import com.techfree.model.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface EmpresaRepository extends JpaRepository<Empresa, Long> {
    Optional<Empresa> findByCnpj(String cnpj);
    Optional<Empresa> findByNomeFantasia(String nomeFantasia);
    Optional<Empresa> findByEmail(String email);
    List<Empresa> findByAtivo(boolean ativo);
    List<Empresa> findByAtivoAndTipo(boolean ativo, String tipo);
    List<Empresa> findByTipo(String tipo);
    List<Empresa> findByTipoAndAtivo(String tipo, boolean ativo);
    List<Empresa> findByTipoAndAtivoAndNomeFantasia(String tipo, boolean ativo, String nomeFantasia);
    List<Empresa> findByTipoAndAtivoAndCnpj(String tipo, boolean ativo, String cnpj);
    
}
