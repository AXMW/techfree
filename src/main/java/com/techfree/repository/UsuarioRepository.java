package com.techfree.repository;
import com.techfree.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.techfree.model.Role;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    List<Usuario> findByEnabled(boolean enabled);
    List<Usuario> findByEnabledAndRoles(boolean enabled, Role role);
    List<Usuario> findByRolesAndEnabled(Role role, boolean enabled);
    List<Usuario> findByRolesAndEnabledAndEmail(Role role, boolean enabled, String email);
    @Query("SELECT u FROM Usuario u JOIN u.roles r WHERE r.nome = :role AND u.enabled = :enabled AND u.email = :email")
    List<Usuario> findbyRolesAndEnabledAndUsername(
        @Param("role") String role,
        @Param("enabled") boolean enabled,
        @Param("email") String email
    );
}
