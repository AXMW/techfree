package com.techfree.specifications;

import java.util.ArrayList;

import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import java.util.List;

import com.techfree.dto.ProjetoFiltroDTO;
import com.techfree.model.Projeto;

public class ProjetoSpecification {
    public static Specification<Projeto> comFiltros(ProjetoFiltroDTO filtro) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filtro.getArea() != null && !filtro.getArea().isBlank()) {
                predicates.add(cb.equal(root.get("area"), filtro.getArea()));
            }

            if (filtro.getTipo() != null && !filtro.getTipo().isBlank()) {
                predicates.add(cb.equal(root.get("tipo"), filtro.getTipo()));
            }

            if (filtro.getStatus() != null && !filtro.getStatus().isBlank()) {
                predicates.add(cb.equal(root.get("status"), filtro.getStatus()));
            }

            if (filtro.getTitulo() != null && !filtro.getTitulo().isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("titulo")), "%" + filtro.getTitulo().toLowerCase() + "%"));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
