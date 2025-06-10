package com.techfree.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import com.techfree.repository.ProjetoRepository;
import com.techfree.model.Projeto;

@Controller
public class PaginaController {

    @Autowired
    private ProjetoRepository projetoRepository;

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
    @GetMapping("/andamento-projeto/{id}")
    public String andamentoProjeto(
        @PathVariable Long id,
        Model model,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        Projeto projeto = projetoRepository.findById(id).orElse(null);
        if (projeto == null) {
            return "redirect:/erro"; // ou página de erro customizada
        }

        String emailUsuario = userDetails.getUsername();

        boolean isFreelancerDoProjeto = projeto.getFreelancerSelecionado() != null &&
            projeto.getFreelancerSelecionado().getUsuario().getEmail().equals(emailUsuario);

        boolean isEmpresaDoProjeto = projeto.getEmpresa() != null &&
            projeto.getEmpresa().getUsuario().getEmail().equals(emailUsuario);

        if (!isFreelancerDoProjeto && !isEmpresaDoProjeto) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Acesso negado: você não tem permissão para acessar este projeto."
            );
        }

        model.addAttribute("projetoId", id);
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
    @GetMapping("/pagina-profile")
    public String paginaprofile() {
        return "PaginaDeProfile";
    }

    @PreAuthorize("hasRole('EMPRESA')")
    @GetMapping("/ver-perfil-freelancer/{id}")
    public String verPerfilFreelancer(@PathVariable Long id, Model model) {
        model.addAttribute("freelancerId", id);
        return "VerPerfilFreelancer";
    }

    @PreAuthorize("hasRole('FREELANCER')")
    @GetMapping("/pagina-profile-editar")
    public String paginaProfileEditar() {
        return "PaginaDeProfileEditar";
    }

    @PreAuthorize("hasRole('EMPRESA')")
    @GetMapping("/pagina-profile-empresa")
    public String paginaprofileempresa() {
        return "PaginaDeProfileEmpresa";
    }

    @PreAuthorize("hasRole('FREELANCER')")
    @GetMapping("/ver-perfil-empresa/{id}")
    public String verPerfilEmpresa(@PathVariable Long id, Model model) {
        model.addAttribute("empresaId", id);
        return "VerPerfilEmpresa";
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
    @GetMapping("/lista-candidatos/{id}")
    public String listaCandidatos(@PathVariable Long id, Model model) {
        model.addAttribute("projetoId", id);
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