package com.techfree.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import com.techfree.model.Freelancer;
import com.techfree.model.Usuario;

public interface FreelancerRepository extends JpaRepository<Freelancer, Long> {
    Optional<Freelancer> findByUsuario(Usuario usuario);
    List<Freelancer> findByCpf(String cpf);
    List<Freelancer> findByEnabled(boolean enabled);
    List<Freelancer> findByEnabledAndRoles(boolean enabled, String role);
    List<Freelancer> findByRoles(String role);
    List<Freelancer> findByRolesAndEnabled(String role, boolean enabled);
    List<Freelancer> findByRolesAndEnabledAndUsuario(String role, boolean enabled, Usuario usuario);

}
