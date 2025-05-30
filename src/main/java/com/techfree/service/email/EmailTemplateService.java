package com.techfree.service.email;
import com.techfree.enums.StatusCandidatura;
import org.springframework.stereotype.Service;

@Service
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


    public static String templateBoasVindas(String nome, String tipoUsuario) {
        return """
            <div style='font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;'>
                <h2 style='color: #2c3e50;'>Bem-vindo à TechFree, %s!</h2>
                <p>Estamos felizes em ter você conosco como %s.</p>
                <p>Agora você pode acessar oportunidades incríveis, se conectar com talentos e participar de projetos reais.</p>
                <br>
                <p style='color: #888;'>Equipe TechFree 🚀</p>
            </div>
        """.formatted(nome, tipoUsuario);
    }

    public static String templateRecuperarSenha(String link) {
        return """
            <div style='font-family: Arial;'>
                <h2>Recuperação de Senha</h2>
                <p>Clique no link abaixo para redefinir sua senha. Esse link é válido por 1 hora:</p>
                <a href='%s'>Redefinir Senha</a>
                <p>Se você não solicitou, ignore este e-mail.</p>
            </div>
        """.formatted(link);
    }
}
