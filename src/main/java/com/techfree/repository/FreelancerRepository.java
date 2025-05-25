package com.techfree.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import com.techfree.model.Freelancer;

public interface FreelancerRepository extends JpaRepository<Freelancer, Long> {
    Optional<Freelancer> findByEmail(String email);
    Optional<Freelancer> findByUsername(String username);
    List<Freelancer> findByCpf(String cpf);
    List<Freelancer> findByEnabled(boolean enabled);
    List<Freelancer> findByEnabledAndRoles(boolean enabled, String role);
    List<Freelancer> findByRoles(String role);
    List<Freelancer> findByRolesAndEnabled(String role, boolean enabled);
    List<Freelancer> findByRolesAndEnabledAndUsername(String role, boolean enabled, String username);
    List<Freelancer> findByRolesAndEnabledAndEmail(String role, boolean enabled, String email);

}
