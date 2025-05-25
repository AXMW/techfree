package com.techfree.service;
import com.techfree.model.Empresa;
import com.techfree.model.Projeto;
import com.techfree.repository.EmpresaRepository;
import com.techfree.repository.ProjetoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.techfree.dto.ProjetoRequestDTO;
import java.util.List;

@Service
public class ProjetoService {
    private final ProjetoRepository projetoRepository;

    @Autowired
    public ProjetoService(ProjetoRepository projetoRepository) {
        this.projetoRepository = projetoRepository;
    }

    @Autowired
    private EmpresaRepository empresaRepository;

    public List<Projeto> listarTodos() {
        return projetoRepository.findAll();
    }

    public Projeto criarProjeto(ProjetoRequestDTO dto, String emailEmpresa) {
        Empresa empresa = empresaRepository.findByEmail(emailEmpresa)
            .orElseThrow(() -> new RuntimeException("Empresa não encontrada"));

        Projeto projeto = new Projeto();
        projeto.setTitulo(dto.getTitulo());
        projeto.setDescricao(dto.getDescricao());
        projeto.setRequisitos(dto.getRequisitos());
        projeto.setOrcamento(dto.getOrcamento());
        projeto.setEmpresa(empresa);

        return projetoRepository.save(projeto);
    }

    public List<Projeto> listarPorEmpresa(String emailEmpresa) {
        Empresa empresa = empresaRepository.findByEmail(emailEmpresa)
            .orElseThrow(() -> new RuntimeException("Empresa não encontrada"));
        return projetoRepository.findByEmpresaId(empresa.getId());
    }

    public Projeto atualizarProjeto(Long id, ProjetoRequestDTO dto, String emailEmpresa) {
        Projeto projeto = projetoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));

        if (!projeto.getEmpresa().getUsuario().getEmail().equals(emailEmpresa)) {
            throw new RuntimeException("Acesso negado");
        }

        projeto.setTitulo(dto.getTitulo());
        projeto.setDescricao(dto.getDescricao());
        projeto.setRequisitos(dto.getRequisitos());
        projeto.setOrcamento(dto.getOrcamento());

        return projetoRepository.save(projeto);
    }

    public void deletarProjeto(Long id, String emailEmpresa) {
        Projeto projeto = projetoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));

        if (!projeto.getEmpresa().getUsuario().getEmail().equals(emailEmpresa)) {
            throw new RuntimeException("Acesso negado");
        }

        projetoRepository.delete(projeto);
    }
}
