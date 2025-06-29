package com.techfree.service;

import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Text;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.layout.element.LineSeparator;
import com.itextpdf.kernel.pdf.canvas.draw.SolidLine;
import com.itextpdf.kernel.pdf.canvas.PdfCanvas;
import com.itextpdf.kernel.geom.PageSize;
import java.time.format.DateTimeFormatter;

import java.io.ByteArrayOutputStream;
import com.techfree.model.Certificado;

import org.springframework.stereotype.Service;

@Service
public class CertificadoPdfService {

    public byte[] gerarCertificadoPdf(Certificado certificado) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        pdf.addNewPage(PageSize.A4.rotate());
        Document document = new Document(pdf, PageSize.A4.rotate());

        // Título centralizado e destacado
        DeviceRgb azulEscuro = new DeviceRgb(10, 40, 120);
        Text titulo = new Text("CERTIFICADO DE CONCLUSÃO")
            .setFontSize(36)
            .setBold()
            .setFontColor(azulEscuro);

        Paragraph pTitulo = new Paragraph().add(titulo)
            .setTextAlignment(TextAlignment.CENTER)
            .setMarginTop(20)
            .setMarginBottom(20);
        document.add(pTitulo);

        // Agora, desenha o fundo bege atrás do conteúdo, após garantir que a página existe
        document.flush();
        DeviceRgb begeClaro = new DeviceRgb(255, 249, 232);
        PdfCanvas bgCanvas = new PdfCanvas(pdf.getFirstPage());
        bgCanvas.saveState();
        bgCanvas.setFillColor(begeClaro);
        bgCanvas.rectangle(0, 0, pdf.getDefaultPageSize().getWidth(), pdf.getDefaultPageSize().getHeight());
        bgCanvas.fill();
        bgCanvas.restoreState();

        // Adiciona o título novamente para garantir que fique na frente do fundo
        document.add(pTitulo);

        // Linha divisória dourada
        DeviceRgb dourado = new DeviceRgb(212, 175, 55);
        SolidLine solidLine = new SolidLine();
        solidLine.setColor(dourado);
        document.add(new LineSeparator(solidLine).setMarginBottom(30));

        // Corpo do certificado
        DeviceRgb cinzaEscuro = new DeviceRgb(60, 60, 60);
        // Formata a data para dd/MM/yyyy
        String dataConclusaoFormatada = "";
        if (certificado.getDataConclusao() != null) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            dataConclusaoFormatada = certificado.getDataConclusao().format(formatter);
        }

        Paragraph corpo = new Paragraph()
            .add("Certificamos que o freelancer ")
            .add(new Text(certificado.getFreelancer().getNome()).setBold().setFontColor(azulEscuro))
            .add(" concluiu o projeto '")
            .add(new Text(certificado.getTitulo()).setBold().setFontColor(azulEscuro))
            .add("' com carga horária de ")
            .add(new Text(certificado.getCargaHoraria() + " horas").setBold().setFontColor(azulEscuro))
            .add(".\n\n")
            .add("Data de conclusão: " + dataConclusaoFormatada + "\n")
            .add("Empresa: " + certificado.getProjeto().getEmpresa().getNomeFantasia())
            .setTextAlignment(TextAlignment.CENTER)
            .setFontSize(18)
            .setFontColor(cinzaEscuro)
            .setMarginBottom(60);
        document.add(corpo);

        // Espaço para assinatura destacado
        Paragraph assinatura = new Paragraph("\n___________________________\nAssinatura da Empresa")
            .setTextAlignment(TextAlignment.CENTER)
            .setFontSize(14)
            .setFontColor(azulEscuro)
            .setMarginTop(40);
        document.add(assinatura);


        // Agora, desenha a borda dourada após garantir que a página existe
        document.flush();
        PdfCanvas canvas = new PdfCanvas(pdf.getFirstPage());
        canvas.setLineWidth(4f);
        canvas.setStrokeColor(dourado);
        float margin = 20f;
        canvas.rectangle(margin, margin, pdf.getDefaultPageSize().getWidth() - 2 * margin, pdf.getDefaultPageSize().getHeight() - 2 * margin);
        canvas.stroke();

        document.close();
        return baos.toByteArray();
    }
}
