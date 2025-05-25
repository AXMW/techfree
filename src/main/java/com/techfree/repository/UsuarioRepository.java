package com.techfree.repository;
import com.techfree.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    Optional<Usuario> findByUsername(String username);
    List<Usuario> findByEnabled(boolean enabled);
    List<Usuario> findByEnabledAndRoles(boolean enabled, String role);
    List<Usuario> findByRoles(String role);
    List<Usuario> findByRolesAndEnabled(String role, boolean enabled);
    List<Usuario> findByRolesAndEnabledAndUsername(String role, boolean enabled, String username);
    List<Usuario> findByRolesAndEnabledAndEmail(String role, boolean enabled, String email);
    
}
