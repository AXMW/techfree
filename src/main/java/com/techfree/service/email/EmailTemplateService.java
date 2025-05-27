package com.techfree.service.email;
import com.techfree.enums.StatusCandidatura;

public class EmailTemplateService {
    public String gerarTemplate(String nomeFreelancer, String tituloProjeto, StatusCandidatura status) {
        String statusTexto = status == StatusCandidatura.ACEITA ? "aceita" : "recusada";
        return """
            <html>
            <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
                <div style="background-color: #ffffff; padding: 20px; border-radius: 10px; max-width: 600px; margin: auto;">
                <h2 style="color: #4CAF50;">Atualização na sua candidatura</h2>
                <p>Olá <strong>%s</strong>,</p>
                <p>Sua candidatura para o projeto <strong>%s</strong> foi <strong style="color: #4CAF50;">%s</strong>.</p>
                <p>Obrigado por usar a <strong>TechFree</strong>! 👨‍💻</p>
                <hr>
                <p style="font-size: 12px; color: #777;">Este é um e-mail automático, não responda.</p>
                </div>
            </body>
            </html>
        """.formatted(nomeFreelancer, tituloProjeto, statusTexto);
    }

    public static String templateSelecionadoProjeto(String nomeFreelancer, String tituloProjeto) {
        return "Olá " + nomeFreelancer + ",\n\nVocê foi selecionado para o projeto: " + tituloProjeto + ".\nParabéns!";
    }
}
