package com.techfree.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import com.techfree.model.Freelancer;
import com.techfree.model.Usuario;
import com.techfree.model.Role;

public interface FreelancerRepository extends JpaRepository<Freelancer, Long> {
    Optional<Freelancer> findByUsuario(Usuario usuario);
    List<Freelancer> findByCpf(String cpf);
    List<Freelancer> findByEnabled(boolean enabled);
    List<Freelancer> findByEnabledAndUsuarioRoles(boolean enabled, Role role);
    List<Freelancer> findByUsuarioRoles(Role role);
    List<Freelancer> findByUsuarioRolesAndEnabled(Role role, boolean enabled);
    List<Freelancer> findByUsuarioRolesAndEnabledAndUsuario(Role role, boolean enabled, Usuario usuario);

}
