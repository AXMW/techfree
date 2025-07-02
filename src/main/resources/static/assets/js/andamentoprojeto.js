document.addEventListener('DOMContentLoaded', async function () {
    const projetoId = document.body.getAttribute('data-projeto-id');
    if (!projetoId) return;

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/projetos/${projetoId}`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
        if (!response.ok) throw new Error('Erro ao buscar projeto');
        const data = await response.json();

        // Se o status for ABERTO, mostra mensagem e não carrega o restante da tela
        if ((data.status || '').toUpperCase() === 'ABERTO') {
            document.body.innerHTML = `
                <div class="d-flex flex-column justify-content-center align-items-center vh-100 bg-dark text-white">
                    <h2>O projeto não está disponível</h2>
                </div>
            `;
            return;
        }

        // Preenche o header do projeto
        document.querySelector('.project-header .display-6').textContent = data.titulo || '';
        document.querySelector('.project-header .fs-5').textContent = data.subtitulo || '';
        document.querySelector('.project-header .fw-semibold').textContent = data.empresa || '';

        // Preenche detalhes do projeto na sidebar
        const sidebarCards = document.querySelectorAll('.col-lg-4 .info-card');
        if (sidebarCards.length > 0) {
            const detalhesUl = sidebarCards[0].querySelector('ul');
            if (detalhesUl) {
                detalhesUl.innerHTML = `
                    <li><strong>Status:</strong> <span class="badge ${getStatusBadgeClass(data.status)}">${formatarStatus(data.status)}</span></li>
                    <li><strong>Prazo:</strong> ${data.prazoEntrega ? formatarData(data.prazoEntrega) : 'A definir'}</li>
                    <li><strong>Tipo:</strong> Projeto Integrador</li>
                    <li><strong>Ferramentas:</strong> ${data.requisitos ? data.requisitos.split(',').join(', ') : ''}</li>
                `;
            }
            // Adiciona Briefing em destaque, se houver anexoAuxiliar
            if (data.anexoAuxiliar) {
                let briefingDiv = document.getElementById('briefing-download');
                if (!briefingDiv) {
                    briefingDiv = document.createElement('div');
                    briefingDiv.id = 'briefing-download';
                    briefingDiv.className = 'mt-3';
                    sidebarCards[0].appendChild(briefingDiv);
                }
                // Nome do arquivo (tenta extrair do path)
                let nomeArquivo = data.anexoAuxiliar;
                if (nomeArquivo.lastIndexOf('/') !== -1) nomeArquivo = nomeArquivo.substring(nomeArquivo.lastIndexOf('/') + 1);
                if (nomeArquivo.lastIndexOf('\\') !== -1) nomeArquivo = nomeArquivo.substring(nomeArquivo.lastIndexOf('\\') + 1);
                briefingDiv.innerHTML = `
                    <div class="d-flex justify-content-center">
                        <a href="/uploads/${nomeArquivo}" class="btn btn-outline-info btn-sm" style="--bs-btn-color: #0dcaf0; --bs-btn-border-color: #0dcaf0; --bs-btn-hover-bg: #0dcaf0; --bs-btn-hover-border-color: #0dcaf0; --bs-btn-hover-color: #fff;" download>
                            <i class="bi bi-download"></i> Baixar Briefing
                        </a>
                    </div>
                `;
            }
        }

        // Preenche contato do orientador (exemplo: usando emailPraContato)
        if (sidebarCards.length > 1) {
            const orientadorCard = sidebarCards[1];
            const emailP = orientadorCard.querySelector('.bi-envelope').parentElement;
            const whatsappP = orientadorCard.querySelector('.bi-whatsapp').parentElement;
            if (emailP) {
                emailP.innerHTML = `<i class="bi bi-envelope"></i> ${data.emailPraContato || 'Não informado'}`;
            }
            if (whatsappP) {
                // Usa o telefoneEmpresa do endpoint
                whatsappP.innerHTML = `<i class="bi bi-whatsapp"></i> ${data.telefonePraContato || 'Não informado'}`;
            }
        }

        // Preenche instruções (opcional: pode customizar conforme status)
        atualizarStepper(data.status);

        // Adiciona botões conforme tipoUsuario
        const tipoUsuario = localStorage.getItem('tipoUsuario');
        let botoesHtml = '';
        const statusUpper = (data.status || '').toUpperCase();

        // FREELANCER: Botão de baixar certificado se CONCLUIDO
        let btnCertificadoHtml = '';
        if (tipoUsuario === 'FREELANCER' && statusUpper === 'CONCLUIDO') {
            btnCertificadoHtml = `<button class="btn btn-outline-success" id="btnBaixarCertificado"><i class="bi bi-download"></i> Baixar certificado</button>`;
        }

        // Função para verificar se já existe avaliação
        async function verificarFeedbackExistente() {
            const token = localStorage.getItem('token');
            let url = '';
            if (tipoUsuario === 'EMPRESA') {
                url = `/avaliacoes/freelancer/projeto/${projetoId}`;
            } else if (tipoUsuario === 'FREELANCER') {
                url = `/avaliacoes/empresa/projeto/${projetoId}`;
            } else {
                return { podeFeedback: false, feedback: null };
            }
            try {
                const resp = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });
                if (resp.status === 404) {
                    return { podeFeedback: true, feedback: null };
                } else if (resp.ok) {
                    const feedback = await resp.json();
                    return { podeFeedback: false, feedback };
                } else {
                    return { podeFeedback: false, feedback: null };
                }
            } catch (e) {
                return { podeFeedback: false, feedback: null };
            }
        }

        // Adiciona botão de feedback se CONCLUIDO e permitido
        let podeFeedback = false;
        let feedbackExistente = null;
        if (statusUpper === 'CONCLUIDO') {
            const resultadoFeedback = await verificarFeedbackExistente();
            podeFeedback = resultadoFeedback.podeFeedback;
            feedbackExistente = resultadoFeedback.feedback;
            if (podeFeedback) {
                if (tipoUsuario === 'EMPRESA') {
                    // Empresa: só Enviar Feedback, centralizado
                    botoesHtml += `
                        <div class="d-flex justify-content-center w-100" style="max-width:400px;margin:0 auto;">
                            <button class="btn btn-outline-info" id="btnEnviarFeedback">Enviar Feedback</button>
                        </div>
                    `;
                } else {
                    // Freelancer: Enviar Feedback e Baixar certificado lado a lado
                    botoesHtml += `
                        <div class="row justify-content-center w-100" style="max-width:400px;margin:0 auto;">
                            <div class="col-12 col-md-6 d-flex justify-content-center mb-2 mb-md-0">
                                <button class="btn btn-outline-info w-100" id="btnEnviarFeedback">Enviar Feedback</button>
                            </div>
                            <div class="col-12 col-md-6 d-flex justify-content-center">
                                ${btnCertificadoHtml}
                            </div>
                        </div>
                    `;
                    btnCertificadoHtml = '';
                }
            } else if (feedbackExistente) {
                // Bloco de feedback já enviado
                const nota = feedbackExistente.nota;
                const comentario = feedbackExistente.comentario;
                const dataCriacao = feedbackExistente.dataCriacao;
                // Renderiza estrelas SVG (mesmo visual do sistema de envio)
                let estrelas = '';
                for (let i = 1; i <= 5; i++) {
                    let fill = 0;
                    if (nota >= i) {
                        fill = 1;
                    } else if (nota >= i - 0.5) {
                        fill = 0.5;
                    }
                    estrelas += `<span style="position:relative; display:inline-block; width:1.5em; height:1.5em;">
                        <svg width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="${fill === 1 ? '#FFD700' : fill === 0.5 ? 'url(#half-grad-'+i+')' : 'none'}" stroke="#FFD700" stroke-width="1"/>
                            <defs>
                                <linearGradient id="half-grad-${i}" x1="0" y1="0" x2="24" y2="0" gradientUnits="userSpaceOnUse">
                                    <stop offset="50%" stop-color="#FFD700"/>
                                    <stop offset="50%" stop-color="white" stop-opacity="0"/>
                                </linearGradient>
                            </defs>
                        </svg>
                    </span>`;
                }
                // Formata data para dd/mm/aaaa
                let dataFormatada = '-';
                if (dataCriacao) {
                    const partes = dataCriacao.split('-');
                    if (partes.length === 3) {
                        dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;
                    } else {
                        dataFormatada = dataCriacao;
                    }
                }
                botoesHtml += `
                    <div class="info-card d-flex flex-column align-items-center" style="max-width: 400px; margin: 0 auto;">
                        <div class="mb-2">Um feedback já foi enviado para este projeto:</div>
                        <div class="mb-2" style="font-size:1.5em; color:#FFD700;">${estrelas}</div>
                        <div class="mb-2"><strong>Comentário:</strong> ${comentario ? comentario : '-'}</div>
                        <div class="mb-1"><strong>Data:</strong> ${dataFormatada}</div>
                        <div class="mt-3 w-100 d-flex justify-content-center">${btnCertificadoHtml}</div>
                    </div>
                `;
                btnCertificadoHtml = '';
            }
        } else if (statusUpper !== 'CONCLUIDO' && statusUpper !== 'CANCELADO') {
            const fecharTexto = statusUpper === 'REVISAO' ? 'Fechar' : 'Cancelar';
            if (tipoUsuario === 'EMPRESA') {
                if (statusUpper === 'REVISAO') {
                    // Fechar e Devolver lado a lado, centralizados, responsivos
                    botoesHtml = `
                        <div class="row justify-content-center w-100" style="max-width:400px;margin:0 auto;">
                            <div class="col-12 col-md-6 d-flex justify-content-center mb-2 mb-md-0">
                                <button class="btn btn-danger w-100" id="btnFecharProjeto">${fecharTexto}</button>
                            </div>
                            <div class="col-12 col-md-6 d-flex justify-content-center">
                                <button class="btn btn-warning w-100" id="btnDevolverProjeto">Devolver</button>
                            </div>
                        </div>
                    `;
                } else {
                    // Fechar sozinho, centralizado
                    botoesHtml = `
                        <div class="d-flex justify-content-center">
                            <button class="btn btn-danger" id="btnFecharProjeto">${fecharTexto}</button>
                        </div>
                    `;
                }
            } else if (tipoUsuario === 'FREELANCER') {
                // Só mostra "Enviar para revisão" se NÃO estiver em revisão
                if (statusUpper !== 'REVISAO') {
                    botoesHtml = `
                        <div class="d-flex justify-content-center gap-2 flex-wrap">
                            <button class="btn btn-primary me-2" id="btnEnviarRevisao">Enviar para revisão</button>
                            <button class="btn btn-danger" id="btnFecharProjeto">Desistir</button>
                        </div>
                    `;
                } else {
                    botoesHtml = `
                        <div class="d-flex justify-content-center">
                            <button class="btn btn-danger" id="btnFecharProjeto">Desistir</button>
                        </div>
                    `;
                }
            }
        } else if (tipoUsuario === 'FREELANCER' && statusUpper !== 'CONCLUIDO' && statusUpper !== 'CANCELADO') {
            // Garantia extra para freelancer, mas já está coberto acima
            botoesHtml = `
                <button class="btn btn-primary" id="btnEnviarRevisao">Enviar para revisão</button>
            `;
        }

        // Seleciona o bloco de contato do orientador (segundo .info-card na sidebar)
        const infoCards = document.querySelectorAll('.col-lg-4 .info-card');
        const orientadorCard = infoCards[1]; // segundo .info-card
        if (orientadorCard && (botoesHtml || btnCertificadoHtml)) {
            const div = document.createElement('div');
            div.className = 'mt-3 mb-3';
            div.innerHTML = `${botoesHtml}${btnCertificadoHtml}`;
            orientadorCard.parentNode.insertBefore(div, orientadorCard.nextSibling);
            // Botão de baixar certificado (FREELANCER, CONCLUIDO)
            const btnBaixarCertificado = div.querySelector('#btnBaixarCertificado');
            if (btnBaixarCertificado) {
                btnBaixarCertificado.addEventListener('click', async function () {
                    btnBaixarCertificado.disabled = true;
                    btnBaixarCertificado.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Baixando...';
                    try {
                        const token = localStorage.getItem('token');
                        // 1. Buscar o id do certificado
                        const resp = await fetch(`/certificados/projetos/${projetoId}`, {
                            method: 'GET',
                            headers: {
                                'Authorization': 'Bearer ' + token
                            }
                        });
                        if (!resp.ok) throw new Error('Erro ao buscar certificado');
                        const certData = await resp.json();
                        const certificadoId = certData.id;
                        if (!certificadoId) throw new Error('Certificado não encontrado');
                        // 2. Baixar o certificado
                        const downloadResp = await fetch(`/certificados/${certificadoId}/download`, {
                            method: 'GET',
                            headers: {
                                'Authorization': 'Bearer ' + token
                            }
                        });
                        if (!downloadResp.ok) throw new Error('Erro ao baixar certificado');
                        const blob = await downloadResp.blob();
                        // Tenta obter nome do arquivo do header
                        let filename = `certificado_${certificadoId}.pdf`;
                        const disposition = downloadResp.headers.get('Content-Disposition');
                        if (disposition && disposition.indexOf('filename=') !== -1) {
                            const match = disposition.match(/filename="?([^";]+)"?/);
                            if (match && match[1]) filename = match[1];
                        }
                        // Cria link para download
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = filename;
                        document.body.appendChild(a);
                        a.click();
                        setTimeout(() => {
                            window.URL.revokeObjectURL(url);
                            a.remove();
                        }, 100);
                        btnBaixarCertificado.innerHTML = '<i class="bi bi-download"></i> Baixar certificado';
                        btnBaixarCertificado.disabled = false;
                    } catch (e) {
                        btnBaixarCertificado.innerHTML = '<i class="bi bi-download"></i> Baixar certificado';
                        btnBaixarCertificado.disabled = false;
                        alert('Erro ao baixar certificado.');
                    }
                });
            }

            // ...existing code for feedback/modal, revisão, devolução, fechar projeto...
            // Botão de feedback (status concluido)
            const btnEnviarFeedback = div.querySelector('#btnEnviarFeedback');
            if (btnEnviarFeedback) {
                btnEnviarFeedback.addEventListener('click', function () {
                    // ...existing code...
                    let modalFeedback = document.getElementById('modalFeedback');
                    if (!modalFeedback) {
                        modalFeedback = document.createElement('div');
                        modalFeedback.className = 'modal fade';
                        modalFeedback.id = 'modalFeedback';
                        modalFeedback.tabIndex = -1;
                        modalFeedback.innerHTML = `
                            <div class="modal-dialog">
                              <div class="modal-content">
                                <div class="modal-header">
                                  <h5 class="modal-title">Enviar Feedback</h5>
                                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                                </div>
                                <div class="modal-body">
                                  <form id="formFeedback">
                                    <div class="mb-3">
                                      <label class="form-label">Nota (0 a 5)</label>
                                      <div id="starRating" class="mb-2" style="font-size:2rem; color:#FFD700; cursor:pointer; user-select:none;"></div>
                                      <input type="hidden" id="notaFeedback" required>
                                    </div>
                                    <div class="mb-3">
                                      <label for="comentarioFeedback" class="form-label">Comentário</label>
                                      <textarea class="form-control" id="comentarioFeedback" rows="3" maxlength="200" required></textarea>
                                      <div class="form-text text-end"><span id="contadorFeedback">0</span>/200</div>
                                    </div>
                                  </form>
                                  <div id="feedbackMsg" class="text-danger small"></div>
                                </div>
                                <div class="modal-footer d-flex justify-content-center gap-2">
                                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                  <button type="button" class="btn btn-secondary" id="confirmarFeedback">Enviar</button>
                                </div>
                              </div>
                            </div>
                        `;
                        document.body.appendChild(modalFeedback);
                    }
                    const modal = new bootstrap.Modal(modalFeedback);
                    modal.show();

                    // Limpa campos ao abrir
                    document.getElementById('notaFeedback').value = '';
                    document.getElementById('comentarioFeedback').value = '';
                    document.getElementById('feedbackMsg').innerText = '';
                    document.getElementById('contadorFeedback').innerText = '0';
                    // Renderiza estrelas
                    renderStarRating(0);

                    // Atualiza contador de caracteres
                    const comentarioInput = document.getElementById('comentarioFeedback');
                    comentarioInput.addEventListener('input', function () {
                        const len = comentarioInput.value.length;
                        document.getElementById('contadorFeedback').innerText = len;
                    });

                    // Sistema de estrelas
                    function renderStarRating(value) {
                        const starDiv = document.getElementById('starRating');
                        starDiv.innerHTML = '';
                        let stars = '';
                        for (let i = 1; i <= 5; i++) {
                            let fill = 0;
                            if (value >= i) {
                                fill = 1;
                            } else if (value >= i - 0.5) {
                                fill = 0.5;
                            }
                            stars += `<span class="star-clickable" data-star="${i}" style="position:relative; display:inline-block; width:1.5em; height:1.5em; cursor:pointer;">
                                <svg width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="${fill === 1 ? '#FFD700' : fill === 0.5 ? 'url(#half-grad-'+i+')' : 'none'}" stroke="#FFD700" stroke-width="1"/>
                                    <defs>
                                        <linearGradient id="half-grad-${i}" x1="0" y1="0" x2="24" y2="0" gradientUnits="userSpaceOnUse">
                                            <stop offset="50%" stop-color="#FFD700"/>
                                            <stop offset="50%" stop-color="white" stop-opacity="0"/>
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </span>`;
                        }
                        starDiv.innerHTML = stars;

                        // Adiciona eventos para detectar metade ou inteira
                        Array.from(starDiv.querySelectorAll('.star-clickable')).forEach((star, idx) => {
                            star.onmousemove = function(e) {
                                const rect = star.getBoundingClientRect();
                                const x = e.clientX - rect.left;
                                const isHalf = x < rect.width / 2;
                                renderStarRating(isHalf ? idx + 0.5 : idx + 1);
                            };
                            star.onclick = function(e) {
                                const rect = star.getBoundingClientRect();
                                const x = e.clientX - rect.left;
                                const isHalf = x < rect.width / 2;
                                const val = isHalf ? idx + 0.5 : idx + 1;
                                document.getElementById('notaFeedback').value = val;
                                renderStarRating(val);
                            };
                        });
                        starDiv.onmouseleave = function() {
                            renderStarRating(parseFloat(document.getElementById('notaFeedback').value) || 0);
                        };
                    }

                    // Evento de envio
                    const btnConfirmarFeedback = document.getElementById('confirmarFeedback');
                    btnConfirmarFeedback.onclick = async function () {
                        let nota = parseFloat(document.getElementById('notaFeedback').value);
                        const comentario = document.getElementById('comentarioFeedback').value.trim();
                        const feedbackMsg = document.getElementById('feedbackMsg');
                        if (isNaN(nota)) nota = 0; // Permite nota 0 se nada selecionado
                        if (nota < 0 || nota > 5) {
                            feedbackMsg.innerText = 'Selecione uma nota de 0 a 5 (pode ser meio ponto).';
                            return;
                        }
                        if (!comentario) {
                            feedbackMsg.innerText = 'O comentário é obrigatório.';
                            return;
                        }
                        if (comentario.length > 200) {
                            feedbackMsg.innerText = 'O comentário deve ter no máximo 200 caracteres.';
                            return;
                        }
                        feedbackMsg.innerText = '';
                        try {
                            const token = localStorage.getItem('token');
                            // Define endpoint conforme tipoUsuario
                            const tipoUsuario = localStorage.getItem('tipoUsuario');
                            const endpoint = (tipoUsuario === 'EMPRESA') ? '/avaliacoes/freelancer' : '/avaliacoes/empresa';
                            const resp = await fetch(endpoint, {
                                method: 'POST',
                                headers: {
                                    'Authorization': 'Bearer ' + token,
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    projetoId: Number(projetoId),
                                    nota: nota,
                                    comentario: comentario
                                })
                            });
                            if (!resp.ok) throw new Error('Erro ao enviar feedback');
                            modal.hide();
                            alert('Feedback enviado com sucesso!');
                            // Atualiza a tela para refletir o novo estado (remove botão e mostra card)
                            location.reload();
                        } catch (e) {
                            feedbackMsg.innerText = 'Erro ao enviar feedback.';
                        }
                    };
                });
            }

            // Adiciona eventos aos botões
            // Botão "Enviar para revisão" (FREELANCER)
            const btnEnviarRevisao = div.querySelector('#btnEnviarRevisao');
            if (btnEnviarRevisao) {
                btnEnviarRevisao.addEventListener('click', function () {
                    let modalConfirm = document.getElementById('modalConfirmarRevisao');
                    if (!modalConfirm) {
                        modalConfirm = document.createElement('div');
                        modalConfirm.className = 'modal fade';
                        modalConfirm.id = 'modalConfirmarRevisao';
                        modalConfirm.tabIndex = -1;
                        modalConfirm.innerHTML = `
                            <div class="modal-dialog modal-dialog-centered">
                              <div class="modal-content">
                                <div class="modal-header">
                                  <h5 class="modal-title">Confirmar envio para revisão</h5>
                                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                                </div>
                                <div class="modal-body">
                                  <p>Tem certeza que deseja <strong>enviar este projeto para revisão</strong>?</p>
                                </div>
                                <div class="modal-footer d-flex justify-content-center gap-2">
                                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                  <button type="button" class="btn btn-secondary" id="confirmarEnviarRevisao">Confirmar</button>
                                </div>
                              </div>
                            </div>
                        `;
                        document.body.appendChild(modalConfirm);
                    }
                    const modal = new bootstrap.Modal(modalConfirm);
                    modal.show();

                    const btnConfirmarAcao = document.getElementById('confirmarEnviarRevisao');
                    btnConfirmarAcao.replaceWith(btnConfirmarAcao.cloneNode(true));
                    const btnConfirmarAcaoNovo = document.getElementById('confirmarEnviarRevisao');
                    btnConfirmarAcaoNovo.addEventListener('click', async function () {
                        // Validação do campo linkProjeto
                        const linkProjeto = document.getElementById('linkProjeto');
                        let feedback = document.getElementById('linkProjetoFeedback');
                        if (!linkProjeto || !linkProjeto.value.trim()) {
                            // Fecha o modal de confirmação
                            modal.hide();
                            // Destaca o campo
                            linkProjeto.classList.add('is-invalid');
                            linkProjeto.focus();
                            // Mostra mensagem de feedback
                            if (!feedback) {
                                feedback = document.createElement('div');
                                feedback.id = 'linkProjetoFeedback';
                                feedback.className = 'invalid-feedback d-block';
                                feedback.innerText = 'O link do projeto é obrigatório para enviar para revisão.';
                                linkProjeto.parentNode.appendChild(feedback);
                            } else {
                                feedback.style.display = 'block';
                            }
                            // Remove o destaque ao digitar
                            linkProjeto.addEventListener('input', function limparInvalido() {
                                linkProjeto.classList.remove('is-invalid');
                                if (feedback) feedback.style.display = 'none';
                                linkProjeto.removeEventListener('input', limparInvalido);
                            });
                            return;
                        } else {
                            linkProjeto.classList.remove('is-invalid');
                            if (feedback) feedback.style.display = 'none';
                        }
                        try {
                            const token = localStorage.getItem('token');
                            const resp = await fetch(`/projetos/${projetoId}/status/revisao`, {
                                method: 'PUT',
                                headers: {
                                    'Authorization': 'Bearer ' + token
                                }
                            });
                            if (!resp.ok) throw new Error('Erro ao enviar para revisão');
                            modal.hide();
                            location.reload();
                        } catch (e) {
                            modal.hide();
                            linkProjeto.classList.add('is-invalid');
                            linkProjeto.focus();
                            alert('Erro ao enviar para revisão.');
                        }
                    });
                });
            }

            // Botão "Devolver" (EMPRESA)
            let quillDevolucao;

            const btnDevolverProjeto = div.querySelector('#btnDevolverProjeto');
            if (btnDevolverProjeto) {
                btnDevolverProjeto.addEventListener('click', function () {
                    const modal = new bootstrap.Modal(document.getElementById('modalDevolucao'));

                    // Inicializa o Quill apenas uma vez
                    if (!quillDevolucao) {
                        quillDevolucao = new Quill('#mensagemDevolucaoEditor', {
                            theme: 'snow',
                            modules: {
                                toolbar: [
                                    [{ 'font': [] }, { 'size': [] }],
                                    ['bold', 'italic', 'underline', 'strike'],
                                    [{ 'color': [] }, { 'background': [] }],
                                    [{ 'header': [1, 2, 3, false] }],
                                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                    [{ 'align': [] }],
                                    ['link'],
                                    ['clean']
                                ]
                            }
                        });
                    } else {
                        quillDevolucao.setText('');
                    }

                    modal.show();

                    // Confirma devolução
                    const btnConfirmar = document.getElementById('confirmarDevolucao');
                    btnConfirmar.replaceWith(btnConfirmar.cloneNode(true));
                    const btnConfirmarNovo = document.getElementById('confirmarDevolucao');
                    btnConfirmarNovo.addEventListener('click', async function () {
                        const mensagemDevolucao = quillDevolucao.root.innerHTML.trim();
                        if (!mensagemDevolucao || mensagemDevolucao === '<p><br></p>') {
                            alert('Por favor, escreva o motivo da devolução.');
                            return;
                        }
                        // Função para quebrar linhas HTML em até 85 caracteres por linha
                        function quebraLinhasHtml(html, maxLen = 50) {
                            // Converte HTML em texto plano, preservando <br>
                            let tempDiv = document.createElement('div');
                            tempDiv.innerHTML = html.replace(/<br\s*\/?>/gi, '\n');
                            let text = tempDiv.textContent || tempDiv.innerText || '';
                            let linhas = text.split('\n');
                            let resultado = [];
                            linhas.forEach(linha => {
                                while (linha.length > maxLen) {
                                    resultado.push(linha.slice(0, maxLen));
                                    linha = linha.slice(maxLen);
                                }
                                resultado.push(linha);
                            });
                            // Junta novamente, convertendo \n para <br>
                            return resultado.map(l => l).join('<br>');
                        }

                        // Formata a mensagem para envio
                        const mensagemFormatada = quebraLinhasHtml(mensagemDevolucao, 77);

                        // Use mensagemFormatada no corpo da requisição/fetch:
                        const agora = new Date();
                        const dataHora = agora.toLocaleString('pt-BR');
                        const descricaoAnterior = data.mensagem || '';
                        const novaDescricao =
                            `<h4>Atualização - ${dataHora}</h4>` +
                            `<div style="font-size:1.15rem;">${mensagemFormatada}</div>` +
                            `<br><hr style="margin: 32px 0; border-top: 3px solid #ccc;"><br>` +
                            descricaoAnterior;

                        try {
                            const token = localStorage.getItem('token');
                            const respStatus = await fetch(`/projetos/${projetoId}/status/em-andamento`, {
                                method: 'PUT',
                                headers: {
                                    'Authorization': 'Bearer ' + token
                                }
                            });
                            if (!respStatus.ok) throw new Error('Erro ao devolver projeto');

                            const respDescricao = await fetch(`/projetos/${projetoId}`, {
                                method: 'PUT',
                                headers: {
                                    'Authorization': 'Bearer ' + token,
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ mensagem: novaDescricao })
                            });
                            if (!respDescricao.ok) throw new Error('Erro ao atualizar descrição');

                            modal.hide();
                            location.reload();
                        } catch (e) {
                            alert('Erro ao devolver projeto ou atualizar descrição.');
                            console.log(e);
                        }
                    });
                });
            }

            // Botão "Fechar" ou "Cancelar" (EMPRESA) ou "Desistir" (FREELANCER)
            const btnFecharProjeto = div.querySelector('#btnFecharProjeto');
            if (btnFecharProjeto) {
                btnFecharProjeto.addEventListener('click', function () {
                    let modalConfirm = document.getElementById('modalConfirmarAcao');
                    if (!modalConfirm) {
                        modalConfirm = document.createElement('div');
                        modalConfirm.className = 'modal fade';
                        modalConfirm.id = 'modalConfirmarAcao';
                        modalConfirm.tabIndex = -1;

                        // Personaliza mensagem conforme ação
                        const texto = btnFecharProjeto.textContent.trim();
                        let acao = '';
                        if (texto === 'Fechar') acao = 'fechar o projeto';
                        else if (texto === 'Cancelar') acao = 'cancelar o projeto';
                        else if (texto === 'Desistir') acao = 'desistir deste projeto';
                        else acao = 'confirmar esta ação';

                        modalConfirm.innerHTML = `
                            <div class="modal-dialog modal-dialog-centered">
                              <div class="modal-content">
                                <div class="modal-header">
                                  <h5 class="modal-title">Confirmar ${texto.toLowerCase()}</h5>
                                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                                </div>
                                <div class="modal-body">
                                  <p>Tem certeza que deseja <strong>${acao}</strong>?</p>
                                </div>
                                <div class="modal-footer d-flex justify-content-center gap-2">
                                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                  <button type="button" class="btn btn-secondary" id="confirmarAcaoStatus">Confirmar</button>
                                </div>
                              </div>
                            </div>
                        `;
                        document.body.appendChild(modalConfirm);
                    } else {
                        // Atualiza mensagem se modal já existe
                        const texto = btnFecharProjeto.textContent.trim();
                        let acao = '';
                        if (texto === 'Fechar') acao = 'fechar o projeto';
                        else if (texto === 'Cancelar') acao = 'cancelar o projeto';
                        else if (texto === 'Desistir') acao = 'desistir deste projeto';
                        else acao = 'confirmar esta ação';
                        modalConfirm.querySelector('.modal-title').textContent = `Confirmar ${texto.toLowerCase()}`;
                        modalConfirm.querySelector('.modal-body p').innerHTML = `Tem certeza que deseja <strong>${acao}</strong>?`;
                    }
                    const modal = new bootstrap.Modal(modalConfirm);
                    modal.show();

                    const btnConfirmarAcao = document.getElementById('confirmarAcaoStatus');
                    btnConfirmarAcao.replaceWith(btnConfirmarAcao.cloneNode(true));
                    const btnConfirmarAcaoNovo = document.getElementById('confirmarAcaoStatus');
                    btnConfirmarAcaoNovo.addEventListener('click', async function () {
                        try {
                            const token = localStorage.getItem('token');
                            const texto = btnFecharProjeto.textContent.trim();
                            let endpoint = '';
                            if (tipoUsuario === 'FREELANCER' && texto === 'Desistir') {
                                endpoint = `/projetos/${projetoId}/status/cancelar`;
                            } else if (tipoUsuario === 'EMPRESA') {
                                if (texto === 'Cancelar') {
                                    endpoint = `/projetos/${projetoId}/status/cancelar`;
                                } else if (texto === 'Fechar') {
                                    endpoint = `/projetos/${projetoId}/status/concluir`;
                                }
                            }
                            if (!endpoint) return;
                            const resp = await fetch(endpoint, {
                                method: 'PUT',
                                headers: {
                                    'Authorization': 'Bearer ' + token
                                }
                            });
                            if (!resp.ok) throw new Error('Erro ao atualizar status');
                            modal.hide();
                            location.reload();
                        } catch (e) {
                            alert('Erro ao atualizar status do projeto.');
                        }
                    });
                });
            }
        }

        // ...após atualizarStepper(data.status);

        const cardsInstrucoes = document.querySelectorAll('.col-lg-8 .info-card');
        const cardInstrucoes = cardsInstrucoes[cardsInstrucoes.length - 1];
        if (cardInstrucoes) {
            // Remove o h5/h6 de título, se existir
            const h5 = cardInstrucoes.querySelector('h5, h6');
            if (h5) h5.remove();
            // Remove a ul, se existir
            const ul = cardInstrucoes.querySelector('ul');
            if (ul) ul.remove();

            const conteudoDiv = cardInstrucoes.querySelector('.descricao-instrucoes') || document.createElement('div');
            conteudoDiv.className = 'descricao-instrucoes';

            if ((data.status || '').toUpperCase() === 'CANCELADO') {
                cardInstrucoes.classList.add('cancelado');
                conteudoDiv.innerHTML = 'Este projeto foi cancelado e não está mais disponível para ações.';
            } else {
                cardInstrucoes.classList.remove('cancelado');
                // Mostra a descrição bruta, trocando \n por <br>
                if (data.mensagem) {
                    conteudoDiv.innerHTML = data.mensagem.replace(/\n/g, '<br>');
                } else {
                    conteudoDiv.innerHTML = 'Consulte o brief do projeto para mais detalhes.';
                }
            }
            // Adiciona ou atualiza o conteúdo no card
            if (!cardInstrucoes.querySelector('.descricao-instrucoes')) {
                cardInstrucoes.appendChild(conteudoDiv);
            }
        }

        // ...após const data = await response.json(); e antes de preencher o header do projeto...
        const linkProjetoInput = document.getElementById('linkProjeto');
        const linkProjetoContainer = linkProjetoInput ? linkProjetoInput.parentNode : null;
        // tipoUsuario já foi declarado anteriormente, então não redeclare aqui
        if (linkProjetoInput && linkProjetoContainer) {
            // Remove elementos antigos (para evitar duplicidade ao recarregar)
            Array.from(linkProjetoContainer.querySelectorAll('.nenhum-link-msg, #btnAlterarLinkProjeto, #btnInserirLinkProjeto, .d-flex, .link-clicavel, .msg-projeto-concluido')).forEach(e => e.remove());

            let valorOriginal = data.linkProjetoHospedagem || '';
            // Se não houver link, mostra mensagem e controla botões/inputs
            if (!valorOriginal) {
                // Esconde input
                linkProjetoInput.style.display = 'none';
                // Mensagem
                let msg = document.createElement('div');
                msg.className = 'nenhum-link-msg text-muted mb-2';
                msg.innerText = 'Nenhum link ainda';
                linkProjetoContainer.appendChild(msg);
                if (tipoUsuario === 'FREELANCER') {
                    // Botão para inserir link
                    let btnInserir = document.createElement('button');
                    btnInserir.type = 'button';
                    btnInserir.className = 'btn btn-outline-secondary btn-sm';
                    btnInserir.id = 'btnInserirLinkProjeto';
                    btnInserir.textContent = 'Inserir link';
                    linkProjetoContainer.appendChild(btnInserir);
                    btnInserir.onclick = function () {
                        msg.style.display = 'none';
                        btnInserir.style.display = 'none';
                        linkProjetoInput.style.display = '';
                        linkProjetoInput.readOnly = false;
                        linkProjetoInput.value = '';
                        linkProjetoInput.focus();
                        // Cria botões de confirmar/cancelar
                        let btnsEdicao = document.createElement('div');
                        btnsEdicao.className = 'mt-2 d-flex gap-3';
                        let btnConfirmar = document.createElement('button');
                        btnConfirmar.type = 'button';
                        btnConfirmar.className = 'btn btn-outline-secondary btn-sm';
                        btnConfirmar.textContent = 'Confirmar';
                        let btnCancelar = document.createElement('button');
                        btnCancelar.type = 'button';
                        btnCancelar.className = 'btn btn-outline-secondary btn-sm';
                        btnCancelar.textContent = 'Cancelar';
                        btnsEdicao.appendChild(btnConfirmar);
                        btnsEdicao.appendChild(btnCancelar);
                        linkProjetoContainer.appendChild(btnsEdicao);
                        btnCancelar.onclick = function () {
                            btnsEdicao.remove();
                            linkProjetoInput.style.display = 'none';
                            msg.style.display = '';
                            btnInserir.style.display = '';
                        };
                        btnConfirmar.onclick = async function () {
                            const novoLink = linkProjeto.value.trim();
                            let urlValido = false;
                            let urlParaValidar = novoLink.replace(/\s+/g, '');
                            let feedback;
                            if (urlParaValidar !== '') {
                                let urlTest = urlParaValidar;
                                if (!/^https?:\/\//i.test(urlTest)) {
                                    urlTest = 'https://' + urlTest;
                                }
                                try {
                                    const parsed = new URL(urlTest);
                                    urlValido = (parsed.protocol === 'http:' || parsed.protocol === 'https:') && /\./.test(parsed.hostname);
                                } catch (e) {
                                    urlValido = false;
                                }
                            }
                            if (!urlValido) {
                                linkProjetoInput.classList.add('is-invalid');
                                feedback = document.getElementById('linkProjetoFeedback');
                                if (!feedback) {
                                    feedback = document.createElement('div');
                                    feedback.id = 'linkProjetoFeedback';
                                    feedback.className = 'invalid-feedback d-block';
                                    feedback.innerText = 'Insira um link válido.';
                                    linkProjetoInput.parentNode.appendChild(feedback);
                                } else {
                                    feedback.style.display = 'block';
                                }
                                linkProjetoInput.focus();
                                linkProjetoInput.addEventListener('input', function limparInvalido() {
                                    linkProjetoInput.classList.remove('is-invalid');
                                    if (feedback) feedback.style.setProperty('display', 'none', 'important');
                                    linkProjetoInput.removeEventListener('input', limparInvalido);
                                });
                                return;
                            }
                            try {
                                const token = localStorage.getItem('token');
                                const resp = await fetch(`/projetos/${projetoId}/atualizar-link`, {
                                    method: 'PUT',
                                    headers: {
                                        'Authorization': 'Bearer ' + token,
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({ linkProjetoHospedagem: novoLink })
                                });
                                if (!resp.ok) throw new Error('Erro ao salvar link');
                                location.reload();
                            } catch (e) {
                                alert('Erro ao salvar link.');
                            }
                        };
                    };
                }
                // Para empresa, só mostra mensagem, nada mais
            } else {
                // Se houver link
                linkProjetoInput.style.display = '';
                if (tipoUsuario === 'FREELANCER') {
                    linkProjetoInput.value = valorOriginal;
                    linkProjetoInput.readOnly = true;
                    if (statusUpper === 'CONCLUIDO' || statusUpper === 'CANCELADO') {
                        // Mostra mensagem de projeto concluído
                        let msgConcluido = document.createElement('div');
                        msgConcluido.className = 'msg-projeto-concluido text-info mt-2';
                        msgConcluido.innerText = 'O projeto foi encerrado.';
                        linkProjetoContainer.appendChild(msgConcluido);
                    } else {
                        // Botão Alterar Link
                        let btnAlterar = document.createElement('button');
                        btnAlterar.type = 'button';
                        btnAlterar.className = 'btn btn-outline-secondary btn-sm ms-2';
                        btnAlterar.id = 'btnAlterarLinkProjeto';
                        btnAlterar.textContent = 'Alterar link';
                        linkProjetoContainer.appendChild(btnAlterar);
                        // Botões de edição (criados mas escondidos)
                        let btnsEdicao = document.createElement('div');
                        btnsEdicao.className = 'mt-2 d-flex gap-3';
                        // Garante ocultação com !important
                        btnsEdicao.style.setProperty('display', 'none', 'important');
                        let btnConfirmar = document.createElement('button');
                        btnConfirmar.type = 'button';
                        btnConfirmar.className = 'btn btn-outline-secondary btn-sm';
                        btnConfirmar.textContent = 'Confirmar';
                        let btnCancelar = document.createElement('button');
                        btnCancelar.type = 'button';
                        btnCancelar.className = 'btn btn-outline-secondary btn-sm';
                        btnCancelar.textContent = 'Cancelar';
                        btnsEdicao.appendChild(btnConfirmar);
                        btnsEdicao.appendChild(btnCancelar);
                        linkProjetoContainer.appendChild(btnsEdicao);
                        btnAlterar.onclick = function () {
                            linkProjetoInput.readOnly = false;
                            linkProjetoInput.focus();
                            btnAlterar.style.display = 'none';
                            btnsEdicao.style.setProperty('display', 'flex', 'important');
                        };
                        btnCancelar.onclick = function () {
                            linkProjetoInput.value = valorOriginal;
                            linkProjetoInput.readOnly = true;
                            btnAlterar.style.display = '';
                            btnsEdicao.style.setProperty('display', 'none', 'important');
                        };
                        btnConfirmar.onclick = async function () {
                            const novoLink = linkProjeto.value.trim();
                            let urlValido = false;
                            let urlParaValidar = novoLink.replace(/\s+/g, '');
                            let feedback;
                            if (urlParaValidar !== '') {
                                let urlTest = urlParaValidar;
                                if (!/^https?:\/\//i.test(urlTest)) {
                                    urlTest = 'https://' + urlTest;
                                }
                                try {
                                    const parsed = new URL(urlTest);
                                    urlValido = (parsed.protocol === 'http:' || parsed.protocol === 'https:') && /\./.test(parsed.hostname);
                                } catch (e) {
                                    urlValido = false;
                                }
                            }
                            if (!urlValido) {
                                linkProjetoInput.classList.add('is-invalid');
                                feedback = document.getElementById('linkProjetoFeedback');
                                if (!feedback) {
                                    feedback = document.createElement('div');
                                    feedback.id = 'linkProjetoFeedback';
                                    feedback.className = 'invalid-feedback d-block';
                                    feedback.innerText = 'Insira um link válido.';
                                    linkProjetoInput.parentNode.appendChild(feedback);
                                } else {
                                    feedback.style.display = 'block';
                                }
                                linkProjetoInput.focus();
                                linkProjetoInput.addEventListener('input', function limparInvalido() {
                                    linkProjetoInput.classList.remove('is-invalid');
                                    if (feedback) feedback.style.setProperty('display', 'none', 'important');
                                    linkProjetoInput.removeEventListener('input', limparInvalido);
                                });
                                return;
                            }
                            try {
                                const token = localStorage.getItem('token');
                                const resp = await fetch(`/projetos/${projetoId}/atualizar-link`, {
                                    method: 'PUT',
                                    headers: {
                                        'Authorization': 'Bearer ' + token,
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({ linkProjetoHospedagem: novoLink })
                                });
                                if (!resp.ok) throw new Error('Erro ao salvar link');
                                location.reload();
                            } catch (e) {
                                alert('Erro ao salvar link.');
                            }
                        };
                    }
                } else if (tipoUsuario === 'EMPRESA') {
                    // Esconde input
                    linkProjetoInput.style.display = 'none';
                    // Mostra link clicável
                    let link = valorOriginal;
                    if (!/^https?:\/\//i.test(link)) link = 'https://' + link;
                    let a = document.createElement('a');
                    a.href = link;
                    a.target = '_blank';
                    a.rel = 'noopener noreferrer';
                    a.className = 'link-clicavel';
                    a.innerText = valorOriginal;
                    linkProjetoContainer.appendChild(a);
                }
            }
        }
    } catch (e) {
        console.error(e);
        document.querySelector('.container').innerHTML = `
            <div class="alert alert-danger mt-5 text-center">Erro ao carregar dados do projeto.</div>
        `;
    }
});

function formatarStatus(status) {
    switch ((status || '').toUpperCase()) {
        case 'ABERTO': return 'Oportunidade';
        case 'EM_ANDAMENTO': return 'Em andamento';
        case 'REVISAO': return 'Revisão';
        case 'CONCLUIDO': return 'Concluído';
        case 'CANCELADO': return 'Cancelado';
        default: return status || '';
    }
}

function formatarData(dataStr) {
    // Aceita "2025-06-09" ou "2025-06-06T21:33:30.72728"
    if (!dataStr) return '';
    const d = dataStr.length > 10 ? dataStr.substring(0, 10) : dataStr;
    const [ano, mes, dia] = d.split('-');
    return `${dia}/${mes}/${ano}`;
}

function atualizarStepper(status) {
    // Remove classes de todas as etapas
    const steps = document.querySelectorAll('.stepper .step');
    steps.forEach(step => {
        step.classList.remove('completed', 'active', 'canceled');
        // Remove texto customizado do último step, se houver
        const label = step.querySelector('.step-label');
        if (label && label.dataset.originalLabel) {
            label.textContent = label.dataset.originalLabel;
        }
    });

    switch ((status || '').toUpperCase()) {
        case 'ABERTO':
            steps[0].classList.add('active');
            break;
        case 'EM_ANDAMENTO':
            steps[0].classList.add('completed');
            steps[1].classList.add('active');
            break;
        case 'REVISAO':
            steps[0].classList.add('completed');
            steps[1].classList.add('completed');
            steps[2].classList.add('active');
            break;
        case 'CONCLUIDO':
            steps[0].classList.add('completed');
            steps[1].classList.add('completed');
            steps[2].classList.add('completed');
            steps[3].classList.add('completed');
            break;
        case 'CANCELADO':
            // Apenas o último step fica vermelho e com o texto "CANCELADO"
            const lastStep = steps[steps.length - 1];
            lastStep.classList.add('active', 'canceled');
            const label = lastStep.querySelector('.step-label');
            if (label) {
                if (!label.dataset.originalLabel) {
                    label.dataset.originalLabel = label.textContent;
                }
                label.textContent = 'CANCELADO';
            }
            break;
    }
}

function getStatusBadgeClass(status) {
    switch ((status || '').toUpperCase()) {
        case 'ABERTO': return 'bg-primary';
        case 'EM_ANDAMENTO': return 'bg-info';
        case 'REVISAO': return 'bg-warning text-dark';
        case 'CONCLUIDO': return 'bg-success';
        case 'CANCELADO': return 'bg-danger';
        default: return 'bg-secondary';
    }
}