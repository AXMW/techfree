package com.techfree.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.techfree.model.AvaliacaoFreelancer;
import com.techfree.model.Candidatura;
import com.techfree.model.Freelancer;
import com.techfree.model.Projeto;
import com.techfree.model.Usuario;
import com.techfree.repository.UsuarioRepository;
import com.techfree.repository.ProjetoRepository;
import com.techfree.dto.GraficoDeBarraEmpresaDTO;
import com.techfree.dto.GraficoDeBarraFreelancerDTO;
import com.techfree.dto.GraficoDeColunaEmpresaDTO;
import com.techfree.dto.GraficoDeColunaFreelancerDTO;
import com.techfree.dto.GraficoDeLinhaEmpresaDTO;
import com.techfree.dto.GraficoDeLinhaFreelancerDTO;
import com.techfree.dto.GraficoDePizzaEmpresaDTO;
import com.techfree.dto.GraficoDePizzaFreelancerDTO;
import com.techfree.enums.StatusProjeto;
import com.techfree.repository.CandidaturaRepository;
import com.techfree.repository.AvaliacaoFreelancerRepository;

@Service
public class DashboardService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProjetoRepository projetoRepository;

    @Autowired
    private CandidaturaRepository candidaturaRepository;

    @Autowired
    private AvaliacaoFreelancerRepository avaliacaoFreelancerRepository;
    
    public List<GraficoDeColunaFreelancerDTO> obterGraficoDeColunaFreelancer(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Usuário não encontrado"
            ));
        if (!usuario.isEnabled()) {

        }
            

        List<Projeto> projetos = projetoRepository.findByFreelancerSelecionadoUsuarioEmail(email);
        if (projetos.isEmpty()) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Nenhum projeto encontrado para o usuário"
            );
        }
        
        projetos.sort((p1, p2) -> p1.getPrazoEntrega().compareTo(p2.getPrazoEntrega()));
        

        LocalDate today = projetos.get(projetos.size() - 1).getPrazoEntrega();
        LocalDate limit = today.minusYears(5);

        List<Projeto> projetosGrafico = new java.util.ArrayList<>();
        for(Projeto projeto : projetos) {
            if(projeto.getPrazoEntrega().isAfter(limit) && projeto.getPrazoEntrega().isBefore(today)) {
                projetosGrafico.add(projeto);
            }
        }

        if (projetosGrafico.isEmpty()) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Nenhum projeto encontrado para o usuário dentro do período especificado"
            );
        }

        return projetosGrafico.stream()
            .map(projeto -> {
                GraficoDeColunaFreelancerDTO dto = new GraficoDeColunaFreelancerDTO();
                dto.setPrazoEntrega(projeto.getPrazoEntrega());
                return dto;
            })
            .toList();
    }

    public List<GraficoDeLinhaFreelancerDTO> obterGraficoDeLinhaFreelancer(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Usuário não encontrado"
            ));
        if (!usuario.isEnabled()) {

        }
            

        List<Projeto> projetos = projetoRepository.findByFreelancerSelecionadoUsuarioEmail(email);
        if (projetos.isEmpty()) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Nenhum projeto encontrado para o usuário"
            );
        }
        
        projetos.sort((p1, p2) -> p1.getPrazoEntrega().compareTo(p2.getPrazoEntrega()));
        

        LocalDate today = projetos.get(projetos.size() - 1).getPrazoEntrega();
        LocalDate limit = today.minusYears(5);

        List<Projeto> projetosGrafico = new java.util.ArrayList<>();
        for(Projeto projeto : projetos) {
            if(projeto.getPrazoEntrega().isAfter(limit) && projeto.getPrazoEntrega().isBefore(today)) {
                projetosGrafico.add(projeto);
            }
        }

        if (projetosGrafico.isEmpty()) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Nenhum projeto encontrado para o usuário dentro do período especificado"
            );
        }

        return projetosGrafico.stream()
            .map(projeto -> {
                GraficoDeLinhaFreelancerDTO dto = new GraficoDeLinhaFreelancerDTO();
                dto.setPrazoEntrega(projeto.getPrazoEntrega());
                dto.setOrcamento(projeto.getOrcamento());
                return dto;
            })
            .toList();
    }

    public List<GraficoDeBarraFreelancerDTO> obterGraficoDeBarraFreelancer(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Usuário não encontrado"
            ));
        if (!usuario.isEnabled()) {

        }
            

        List<Projeto> projetos = projetoRepository.findByFreelancerSelecionadoUsuarioEmailAndStatus(email, StatusProjeto.CONCLUIDO);
        if (projetos.isEmpty()) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Nenhum projeto encontrado para o usuário"
            );
        }
        
        

        return projetos.stream()
            .map(projeto -> {
                GraficoDeBarraFreelancerDTO dto = new GraficoDeBarraFreelancerDTO();
                dto.setDuracao(projeto.getDuracao());
                return dto;
            })
            .toList();
    }


    public List<GraficoDePizzaFreelancerDTO> obterGraficoDePizzaFreelancer(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Usuário não encontrado"
            ));
        if (!usuario.isEnabled()) {

        }
            

        List<Projeto> projetos = projetoRepository.findByFreelancerSelecionadoUsuarioEmail(email);
        if (projetos.isEmpty()) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Nenhum projeto encontrado para o usuário"
            );
        }
        
        

        return projetos.stream()
            .map(projeto -> {
                GraficoDePizzaFreelancerDTO dto = new GraficoDePizzaFreelancerDTO();
                dto.setAreaAtuacao(projeto.getEmpresa().getAreaAtuacao());
                return dto;
            })
            .toList();
    }

    public List<GraficoDeColunaEmpresaDTO> obterGraficoDeColunaEmpresa(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Usuário não encontrado"
            ));
        if (!usuario.isEnabled()) {

        }
            

        List<Projeto> projetos = projetoRepository.findByEmpresaUsuarioEmail(email);
        if (projetos.isEmpty()) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Nenhum projeto encontrado para o usuário"
            );
        }
        
        projetos.sort((p1, p2) -> p1.getDataInicio().compareTo(p2.getDataInicio()));

        List<Projeto> projetosComFreelancer = new java.util.ArrayList<>();

        for(Projeto projeto : projetos) {
            if(projeto.getFreelancerSelecionado() != null) {
                projetosComFreelancer.add(projeto);
            }
        }

        return projetosComFreelancer.stream()
            .map(projeto -> {
                GraficoDeColunaEmpresaDTO dto = new GraficoDeColunaEmpresaDTO();
                dto.setDataInicio(projeto.getDataInicio());
                return dto;
            })
            .toList();
    }

    public List<GraficoDeLinhaEmpresaDTO> obterGraficoDeLinhaEmpresa(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Usuário não encontrado"
            ));
        if (!usuario.isEnabled()) {

        }
            

        List<Projeto> projetos = projetoRepository.findByEmpresaUsuarioEmailAndStatus(email, StatusProjeto.CONCLUIDO);
        if (projetos.isEmpty()) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Nenhum projeto encontrado para o usuário"
            );
        }
        
        projetos.sort((p1, p2) -> p1.getDataInicio().compareTo(p2.getDataInicio()));


        return projetos.stream()
            .map(projeto -> {
                GraficoDeLinhaEmpresaDTO dto = new GraficoDeLinhaEmpresaDTO();
                dto.setPrazoEntrega(projeto.getPrazoEntrega());
                dto.setOrcamento(projeto.getOrcamento());
                return dto;
            })
            .toList();
    }

    public List<GraficoDeBarraEmpresaDTO> obterGraficoDeBarraEmpresa(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Usuário não encontrado"
            ));
        if (!usuario.isEnabled()) {

        }
            

        List<Projeto> projetos = projetoRepository.findByEmpresaUsuarioEmail(email);
        if (projetos.isEmpty()) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Nenhum projeto encontrado para o usuário"
            );
        }

        List<GraficoDeBarraEmpresaDTO> graficoDeBarras = new java.util.ArrayList<>();

        for(Projeto projeto : projetos) {
            List<Candidatura> candidaturas = candidaturaRepository.findByProjetoId(projeto.getId());
            GraficoDeBarraEmpresaDTO dto = new GraficoDeBarraEmpresaDTO();
            dto.setTituloProjeto(projeto.getTitulo());
            dto.setQuantidadeCandidaturas((long) candidaturas.size());
            graficoDeBarras.add(dto);
        }
        
        

        return graficoDeBarras.stream()
            .filter(dto -> dto.getQuantidadeCandidaturas() > 0)
            .toList();
    }

    public List<GraficoDePizzaEmpresaDTO> obterGraficoDePizzaEmpresa(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Usuário não encontrado"
            ));
        if (!usuario.isEnabled()) {

        }
            

        List<Projeto> projetos = projetoRepository.findByEmpresaUsuarioEmail(email);
        if (projetos.isEmpty()) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND, // 404
                "Nenhum projeto encontrado para o usuário"
            );
        }

        List<Double> notas = new java.util.ArrayList<>();
        for(Projeto projeto : projetos) {
            if(projeto.getFreelancerSelecionado() == null) {
                continue;
            }
            Freelancer freelancer = projeto.getFreelancerSelecionado();
            Optional<AvaliacaoFreelancer> avaliacoes = avaliacaoFreelancerRepository.findByFreelancerAndProjeto(freelancer, projeto);
            if(avaliacoes.isEmpty()) {
                continue;
            }
            notas.add(avaliacoes.get().getNota());
        }

        return notas.stream()
            .map(nota -> {
                GraficoDePizzaEmpresaDTO dto = new GraficoDePizzaEmpresaDTO();
                dto.setNota(nota);
                return dto;
            })
            .toList();
    }
}
