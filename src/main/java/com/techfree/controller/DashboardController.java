package com.techfree.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.techfree.dto.GraficoDeBarraFreelancerDTO;
import com.techfree.dto.GraficoDeColunaFreelancerDTO;
import com.techfree.dto.GraficoDeLinhaFreelancerDTO;
import com.techfree.dto.GraficoDePizzaFreelancerDTO;
import com.techfree.service.DashboardService;

@RestControlller
@RequestMapping("/dashboard")
public class DashboardController {

    @AutoWired
    private DashboardService dashboardService;
    
    @GetMapping("/freelancer/colunas")
    @PreAuthorize("hasRole('FREELANCER')")
    public ResponseEntity<List<GraficoDeColunaFreelancerDTO>> obterGraficoDeColunasFreelancer(Authentication auth) {
        List<GraficoDeColunaFreelancerDTO> colunas = dashboardService.obterGraficoDeColunaFreelancer(auth.getName());
        return ResponseEntity.ok(colunas);
    }

    @GetMapping("/freelancer/linhas")
    @PreAuthorize("hasRole('FREELANCER')")
    public ResponseEntity<List<GraficoDeLinhaFreelancerDTO>> obterGraficoDeLinhasFreelancer(Authentication auth) {
        List<GraficoDeLinhaFreelancerDTO> linhas = dashboardService.obterGraficoDeLinhaFreelancer(auth.getName());
        return ResponseEntity.ok(linhas);
    }

    @GetMapping("/freelancer/barras")
    @PreAuthorize("hasRole('FREELANCER')")
    public ResponseEntity<List<GraficoDeBarraFreelancerDTO>> obterGraficoDeBarrasFreelancer(Authentication auth) {
        List<GraficoDeBarraFreelancerDTO> barras = dashboardService.obterGraficoDeBarraFreelancer(auth.getName());
        return ResponseEntity.ok(barras);
    }

    @GetMapping("/freelancer/pizza")
    @PreAuthorize("hasRole('FREELANCER')")
    public ResponseEntity<List<GraficoDePizzaFreelancerDTO>> obterGraficoDePizzaFreelancer(Authentication auth) {
        List<GraficoDePizzaFreelancerDTO> pizza = dashboardService.obterGraficoDePizzaFreelancer(auth.getName());
        return ResponseEntity.ok(pizza);
    }

    //@GetMapping("/empresa/colunas")
    //@PreAuthorize("hasRole('EMPRESA')")
    //public ResponseEntity<List<GraficoDeColunaEmpresaDTO>> obterGraficoDeColunasEmpresa(Authentication auth) {
    //    List<GraficoDeColunaEmpresaDTO> colunas = dashboardService.obterGraficoDeColunaEmpresa(auth.getName());
    //    return ResponseEntity.ok(colunas);
    //}
//
    //@GetMapping("/empresa/linhas")
    //@PreAuthorize("hasRole('EMPRESA')")
    //public ResponseEntity<List<GraficoDeLinhaEmpresaDTO>> obterGraficoDeLinhasEmpresa(Authentication auth) {
    //    List<GraficoDeLinhaEmpresaDTO> linhas = dashboardService.obterGraficoDeLinhaEmpresa(auth.getName());
    //    return ResponseEntity.ok(linhas);
    //}
//
    //@GetMapping("/empresa/barras")
    //@PreAuthorize("hasRole('EMPRESA')")
    //public ResponseEntity<List<GraficoDeBarraEmpresaDTO>> obterGraficoDeBarrasEmpresa(Authentication auth) {
    //    List<GraficoDeBarraEmpresaDTO> barras = dashboardService.obterGraficoDeBarraEmpresa(auth.getName());
    //    return ResponseEntity.ok(barras);
    //}
//
    //@GetMapping("/empresa/pizza")
    //@PreAuthorize("hasRole('EMPRESA')")
    //public ResponseEntity<List<GraficoDePizzaEmpresaDTO>> obterGraficoDePizzaEmpresa(Authentication auth) {
    //    List<GraficoDePizzaEmpresaDTO> pizza = dashboardService.obterGraficoDePizzaEmpresa(auth.getName());
    //    return ResponseEntity.ok(pizza);
    //}

}
