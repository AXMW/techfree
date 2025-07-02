package com.techfree.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.techfree.model.Log;
import com.techfree.model.Usuario;
import com.techfree.repository.LogRepository;
import com.techfree.enums.TipoLog;

import java.time.LocalDateTime;

@Service
public class LogService {
    @Autowired
    private LogRepository logRepository;

    public void registrar(TipoLog tipo, String mensagem, Usuario usuario) {
        Log log = new Log(LocalDateTime.now(), tipo, mensagem, usuario);
        logRepository.save(log);
    }
}
