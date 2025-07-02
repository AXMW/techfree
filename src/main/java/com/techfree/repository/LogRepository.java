package com.techfree.repository;

import com.techfree.model.Log;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.techfree.model.Usuario;

public interface LogRepository extends JpaRepository<Log, Long> {
    Optional<Log> findByUsuario(Usuario usuario);
}
