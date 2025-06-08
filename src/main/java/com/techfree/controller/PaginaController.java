package com.techfree.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class PaginaController {

    @GetMapping("/")
    public String index() {
        return "Inicio";
    }

    @GetMapping("/inicio")
    public String inicio() {
        return "Inicio";
    }

    @PreAuthorize("hasRole('FREELANCER') or hasRole('EMPRESA')")
    @GetMapping("/dashboard")
    public String dashboard() {
        return "Dashboard";
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/signup")
    public String signUp() {
        return "signUp";
    }

    @GetMapping("/faq")
    public String faq() {
        return "FAQ";
    }

    @PreAuthorize("hasRole('FREELANCER') or hasRole('EMPRESA')")
    @GetMapping("/andamento-projeto")
    public String andamentoProjeto() {
        return "AndamentoProjeto";
    }

    @PreAuthorize("hasRole('FREELANCER') or hasRole('EMPRESA')")
    @GetMapping("/detalhes-projeto/{id}")
    public String detalhesProjeto(@PathVariable Long id, Model model) {
        model.addAttribute("projetoId", id);
        return "DetalhesDoProjeto";
    }

    @PreAuthorize("hasRole('FREELANCER') or hasRole('EMPRESA')")
    @GetMapping("/gerenciar-projetos")
    public String gerenciarProjetos() {
        return "GerenciarProjetos";
    }

    @PreAuthorize("hasRole('FREELANCER')")
    @GetMapping("/listagem-projetos-vagas")
    public String listagemProjetosVagas() {
        return "ListagemDeProjetosVagas";
    }

    @PreAuthorize("hasRole('FREELANCER')")
    @GetMapping("/pagina-profile1")
    public String paginaProfile1() {
        return "PaginaDeProfile1";
    }

    @PreAuthorize("hasRole('EMPRESA')")
    @GetMapping("/pagina-profile2")
    public String paginaProfile2() {
        return "PaginaDeProfile2";
    }

    @PreAuthorize("hasRole('FREELANCER')")
    @GetMapping("/pagina-profile-editar")
    public String paginaProfileEditar() {
        return "PaginaDeProfileEditar";
    }

    @PreAuthorize("hasRole('EMPRESA')")
    @GetMapping("/pagina-profile-empresa1")
    public String paginaProfileEmpresa1() {
        return "PaginaDeProfileEmpresa1";
    }

    @PreAuthorize("hasRole('FREELANCER')")
    @GetMapping("/pagina-profile-empresa2")
    public String paginaProfileEmpresa2() {
        return "PaginaDeProfileEmpresa2";
    }

    @PreAuthorize("hasRole('EMPRESA')")
    @GetMapping("/pagina-profile-empresa-editar")
    public String paginaProfileEmpresaEditar() {
        return "PaginaDeProfileEmpresaEditar";
    }

    @PreAuthorize("hasRole('FREELANCER') or hasRole('EMPRESA')")
    @GetMapping("/configuracoes-de-perfil")
    public String configuracoesDePerfil() {
        return "ConfiguracoesDePerfil";
    }

    @PreAuthorize("hasRole('FREELANCER') or hasRole('EMPRESA')")
    @GetMapping("/feedback")
    public String feedback() {
        return "feedback";
    }

    @PreAuthorize("hasRole('EMPRESA')")
    @GetMapping("/editar-vaga")
    public String editarVaga() {
        return "EditarVaga";
    }

    @PreAuthorize("hasRole('EMPRESA')")
    @GetMapping("/lista-candidatos")
    public String listaCandidatos() {
        return "ListaDeCandidatos";
    }

    @PreAuthorize("hasRole('EMPRESA')")
    @GetMapping("/publicar-vaga")
    public String publicarVaga() {
        return "publicarVaga";
    }

    @GetMapping("/reset-password1")
    public String resetPassword1() {
        return "resetPassword1";
    }

    @GetMapping("/reset-password2")
    public String resetPassword2() {
        return "resetPassword2";
    }


    // Adicione outros métodos conforme novas páginas forem criadas
}