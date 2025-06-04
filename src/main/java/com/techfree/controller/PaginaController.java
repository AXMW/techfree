package com.techfree.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PaginaController {

    
    @GetMapping("/inicio")
    public String inicio() {
        return "Inicio";
    }

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

    @GetMapping("/andamento-projeto")
    public String andamentoProjeto() {
        return "AndamentoProjeto";
    }

    @GetMapping("/detalhes-projeto")
    public String detalhesProjeto() {
        return "DetalhesDoProjeto";
    }

    @GetMapping("/gerenciar-projetos")
    public String gerenciarProjetos() {
        return "GerenciarProjetos";
    }

    @GetMapping("/listagem-projetos-vagas")
    public String listagemProjetosVagas() {
        return "ListagemDeProjetosVagas";
    }

    @GetMapping("/pagina-profile1")
    public String paginaProfile1() {
        return "PaginaDeProfile1";
    }

    @GetMapping("/pagina-profile2")
    public String paginaProfile2() {
        return "PaginaDeProfile2";
    }

    @GetMapping("/pagina-profile-editar")
    public String paginaProfileEditar() {
        return "PaginaDeProfileEditar";
    }

    @GetMapping("/pagina-profile-empresa1")
    public String paginaProfileEmpresa1() {
        return "PaginaDeProfileEmpresa1";
    }

    @GetMapping("/pagina-profile-empresa2")
    public String paginaProfileEmpresa2() {
        return "PaginaDeProfileEmpresa2";
    }

    @GetMapping("/pagina-profile-empresa-editar")
    public String paginaProfileEmpresaEditar() {
        return "PaginaDeProfileEmpresaEditar";
    }

    @GetMapping("/configuracoes-de-perfil")
    public String configuracoesDePerfil() {
        return "ConfiguracoesDePerfil";
    }

    @GetMapping("/feedback")
    public String feedback() {
        return "feedback";
    }

    @GetMapping("/editar-vaga")
    public String editarVaga() {
        return "EditarVaga";
    }

    @GetMapping("/lista-candidatos")
    public String listaCandidatos() {
        return "ListaDeCandidatos";
    }

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