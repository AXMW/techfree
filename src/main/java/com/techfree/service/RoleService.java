package com.techfree.service;
import com.techfree.model.Role;
import com.techfree.repository.RoleRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleService {

    private final RoleRepository repository;

    public RoleService(RoleRepository repository) {
        this.repository = repository;
    }

    public Role criar(Role role) {
        return repository.save(role);
    }

    public List<Role> listarTodos() {
        return repository.findAll();
    }

    public Role buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Role não encontrada"));
    }

    public Role atualizar(Long id, Role novaRole) {
        Role role = buscarPorId(id);
        role.setNome(novaRole.getNome());
        return repository.save(role);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}
