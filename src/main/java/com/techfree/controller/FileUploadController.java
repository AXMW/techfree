package com.techfree.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/files")
public class FileUploadController {

    private final Path uploadDir = Paths.get("src/main/uploads/");

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "oldFile", required = false) String oldFile) {
        try {
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            // Apaga o arquivo antigo se informado
            if (oldFile != null && !oldFile.isBlank()) {
                try {
                    String fileName = Paths.get(new java.net.URI(oldFile).getPath()).getFileName().toString();
                    Path oldPath = uploadDir.resolve(fileName);
                    if (Files.exists(oldPath)) {
                        Files.delete(oldPath);
                    }
                } catch (Exception ex) {
                    // Apenas loga, não lança erro para o usuário
                    System.out.println("Arquivo antigo não encontrado para deletar: " + ex.getMessage());
                }
            }

            String originalName = file.getOriginalFilename();
            String sanitized = originalName.replaceAll("[^a-zA-Z0-9\\.\\-_]", "_");
            String fileName = UUID.randomUUID() + "_" + sanitized;
            Path filePath = uploadDir.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Retorne o caminho relativo para usar no frontend
            String fileUrl = "/uploads/" + fileName;
            return ResponseEntity.ok(fileUrl);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao fazer upload: " + e.getMessage());
        }
    }
}
