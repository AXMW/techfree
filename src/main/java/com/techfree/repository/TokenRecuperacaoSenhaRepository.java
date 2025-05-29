package com.techfree.repository;
import com.techfree.model.TokenRecuperacaoSenha;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TokenRecuperacaoSenhaRepository extends JpaRepository<TokenRecuperacaoSenha, Long> {
    Optional<TokenRecuperacaoSenha> findByToken(String token);
}