package com.techfree.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.techfree.model.Flag;

public interface FlagRepository extends JpaRepository<Flag, Long> {
    List<Flag> findByUsuarioId(Long usuarioId);
    List<Flag> findByProjetoId(Long projetoId);
    Optional<Flag> findByUsuarioIdAndProjetoId(Long usuarioId, Long projetoId);
    List<Flag> findByUsuarioIdAndProjetoIdIn(Long usuarioId, List<Long> projetoIds);
}
