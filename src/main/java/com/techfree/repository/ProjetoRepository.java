package com.techfree.repository;
import com.techfree.model.Empresa;
import com.techfree.model.Projeto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.util.List;
import java.util.Optional;
import com.techfree.enums.StatusProjeto;

public interface ProjetoRepository extends JpaRepository<Projeto, Long>, JpaSpecificationExecutor<Projeto> {
    Optional<Projeto> findByTitulo(String titulo);
    List<Projeto> findByEmpresaId(Long id);
    List<Projeto> findByEmpresaUsuarioEmail(String empresaUsuarioEmail);
    List<Projeto> findByAtivo(boolean ativo);
    List<Projeto> findByAtivoAndTitulo(boolean ativo, String titulo);
    List<Projeto> findByStatus(StatusProjeto status);
    List<Projeto> findByStatusAndEmpresaUsuarioEmail(StatusProjeto status, String EmpresaUsuarioEmail);
    List<Projeto> findByStatusAndFreelancerSelecionadoUsuarioEmail(StatusProjeto status, String freelancerSelecionadoUsuarioEmail);
    List<Projeto> findByEmpresa(Empresa empresa);
    List<Projeto> findByFreelancerSelecionadoUsuarioEmail(String email);
    List<Projeto> findByFreelancerSelecionadoUsuarioEmailAndStatus(String email, StatusProjeto status);
}
