package com.techfree.repository;
import com.techfree.model.Avaliacao;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {
    List<Avaliacao> findByFreelancerId(Long freelancerId);
    List<Avaliacao> findByEmpresaId(Long empresaId);
    List<Avaliacao> findByFreelancerIdAndEmpresaId(Long freelancerId, Long empresaId);
    List<Avaliacao> findByFreelancerIdAndNota(Long freelancerId, int nota);
    List<Avaliacao> findByEmpresaIdAndNota(Long empresaId, int nota);
    List<Avaliacao> findByFreelancerIdAndComentario(Long freelancerId, String comentario);
    List<Avaliacao> findByEmpresaIdAndComentario(Long empresaId, String comentario);
    
}
