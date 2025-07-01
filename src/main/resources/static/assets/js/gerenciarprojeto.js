// Exemplo de projetos simulados
let projects = [];
const tipoUsuario = (localStorage.getItem('tipoUsuario') || '').toLowerCase();

async function carregarProjects() {
    const token = localStorage.getItem('token');
    if (tipoUsuario === 'freelancer') {
        await carregarProjectsFreelancer(token);
    } else {
        await carregarProjectsEmpresa(token);
    }
}

async function carregarProjectsEmpresa(token) {
    try {
        const response = await fetch('/projetos', {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
        if (!response.ok) throw new Error('Erro ao buscar projetos');
        const data = await response.json();
        projects = data.map(p => normalizarProjeto(p));
        renderProjects();
    } catch (e) {
        console.error(e);
    }
}

async function carregarProjectsFreelancer(token) {
    try {
        // 1. Candidaturas (status em aberto)
        const respCandidaturas = await fetch('/candidaturas', {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
        let candidaturas = [];
        if (respCandidaturas.ok) {
            candidaturas = await respCandidaturas.json();
        }

        // 2. Projetos do freelancer (em andamento, concluídos e cancelados)
        const respProjetosAndamento = await fetch('/projetos/listar-em-andamento-freelancer', {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
        const respProjetosRevisao = await fetch('/projetos/listar-em-revisao-freelancer', {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
        const respProjetosConcluidos = await fetch('/projetos/listar-concluido-freelancer', {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
        const respProjetosCancelados = await fetch('/projetos/listar-cancelados-freelancer', {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });

        let projetosAndamento = respProjetosAndamento.ok ? await respProjetosAndamento.json() : [];
        let projetosConcluidos = respProjetosConcluidos.ok ? await respProjetosConcluidos.json() : [];
        let projetosCancelados = respProjetosCancelados.ok ? await respProjetosCancelados.json() : [];
        let projetosRevisao = respProjetosRevisao.ok ? await respProjetosRevisao.json() : [];

        // Monta lista de projetos para o renderizador
        projects = [];

        // Candidaturas em aberto (substitui "Oportunidades" para freelancer)
        projects.push(...candidaturas
            .filter(c => (c.status || '').toUpperCase() === 'ENVIADA' || (c.status || '').toUpperCase() === 'PENDENTE')
            .map(c => ({
                title: c.projetoTitulo,
                status: 'aberto',
                tech: c.feelancerHabilidades || [],
                date: c.data ? convertDate(c.data) : "A definir",
                desc: c.mensagem || '',
                id: c.projetoId // id da candidatura
            }))
        );

        // Projetos em andamento
        projects.push(...projetosAndamento.map(p => normalizarProjeto(p)));

        // Projetos concluídos
        projects.push(...projetosConcluidos.map(p => normalizarProjeto(p)));

        // Projetos cancelados
        projects.push(...projetosCancelados.map(p => normalizarProjeto(p)));

        // Projetos revisao
        projects.push(...projetosRevisao.map(p => normalizarProjeto(p)));

        renderProjects();
    } catch (e) {
        console.error(e);
    }
}

function normalizarProjeto(p) {
    let status;
    switch ((p.status || '').toUpperCase()) {
        case 'ABERTO':
            status = 'aberto';
            break;
        case 'EM_ANDAMENTO':
        case 'REVISAO':
            status = 'andamento';
            break;
        case 'CONCLUIDO':
        case 'CANCELADO':
            status = 'fechado';
            break;
        default:
            status = (p.status || '').toLowerCase();
    }
    return {
        title: p.titulo,
        status: status,
        rawStatus: (p.status || ''),
        tech: p.requisitos ? p.requisitos.split(',') : [],
        date: p.prazoEntrega ? convertDate(p.prazoEntrega) : "A definir",
        desc: p.descricao,
        id: p.id || p.projetoId // <-- ajuste aqui
    };
}

function convertDate(dateString) {
    return dateString.substring(8,10) + "/" + dateString.substring(5,7) + "/" + dateString.substring(0,4);    
}

function renderProjects() {
    // Sempre exibe os filtros, independente do tipo de usuário
    document.querySelector('.project-filters').style.display = '';

    // Ajusta o texto da aba de oportunidades conforme o tipo de usuário
    if (tipoUsuario === 'freelancer') {
        document.getElementById('tab-oportunidades').textContent = 'Candidaturas em Aberto';
    } else {
        document.getElementById('tab-oportunidades').textContent = 'Oportunidades';
    }

    const search = document.getElementById('searchInput').value.toLowerCase();
    document.getElementById('list-todos').innerHTML = '';
    document.getElementById('list-oportunidades').innerHTML = '';
    document.getElementById('list-andamento').innerHTML = '';
    document.getElementById('list-fechados').innerHTML = '';
    projects.forEach(p => {
        let show = true;
        if (
            search &&
            !(
                p.title.toLowerCase().includes(search) ||
                p.desc.toLowerCase().includes(search) ||
                p.tech.join(',').toLowerCase().includes(search)
            )
        )
            show = false;
        if (!show) return;
        const card = document.createElement('div');
        card.className = 'project-card';

        // Botões padrão
        let actions = `
            <button class="btn btn-outline-light btn-sm visualizar-btn" data-id="${p.id}">
                <i class="bi bi-eye"></i> Visualizar
            </button>
        `;

        // Empresa: editar/cancelar/ver candidatos (NÃO mostra baixar certificado)
        if (tipoUsuario !== 'freelancer') {
            // Só mostra editar para projetos ABERTOS
            if (p.status === 'aberto') {
                actions += `
                    <button class="btn btn-outline-info btn-sm editar-btn" data-id="${p.id}">
                        <i class="bi bi-pencil"></i> Editar
                    </button>
                `;
                actions += `<button class="btn btn-outline-danger btn-sm desativar-btn" data-id="${p.id}"><i class="bi bi-slash-circle"></i> Cancelar</button>`;
                actions += `<button class="btn btn-outline-warning btn-sm ver-candidatos-btn" data-id="${p.id}"><i class="bi bi-people"></i> Ver candidatos</button>`;
            } else {
                // Para outros status, só mostra visualizar (e outros botões, se houver)
                // Não mostra o botão Editar
                if (p.status !== 'fechado') {
                    actions += `<button class="btn btn-outline-danger btn-sm desativar-btn" data-id="${p.id}"><i class="bi bi-slash-circle"></i> Cancelar</button>`;
                }
            }
        } else {
            // Freelancer: só visualizar, desistir e baixar certificado se CONCLUIDO
            if (p.status === 'andamento') {
                actions += `<button class="btn btn-outline-danger btn-sm desistir-btn" data-id="${p.id}"><i class="bi bi-slash-circle"></i> Desistir</button>`;
            }
            if (
                p.status === 'fechado' &&
                p.rawStatus &&
                p.rawStatus.toUpperCase() === 'CONCLUIDO'
            ) {
                actions += `<button class="btn btn-success btn-sm baixar-certificado-btn" data-id="${p.id}"><i class="bi bi-download"></i> Baixar certificado</button>`;
            }

    // Ação do botão Baixar certificado
    setTimeout(() => {
        document.querySelectorAll('.baixar-certificado-btn').forEach(btn => {
            btn.onclick = async function () {
                const idProjeto = this.getAttribute('data-id');
                const token = localStorage.getItem('token');
                try {
                    // Primeiro GET para obter o id do certificado
                    const respCert = await fetch(`/certificados/projetos/${idProjeto}`, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                            'Authorization': 'Bearer ' + token
                        }
                    });
                    if (!respCert.ok) {
                        alert('Erro ao buscar certificado do projeto.');
                        return;
                    }
                    const certData = await respCert.json();
                    const idCertificado = certData.id;
                    if (!idCertificado) {
                        alert('Certificado não encontrado para este projeto.');
                        return;
                    }
                    // Segundo GET para baixar o certificado
                    const respDownload = await fetch(`/certificados/${idCertificado}/download`, {
                        method: 'GET',
                        headers: {
                            'Authorization': 'Bearer ' + token
                        }
                    });
                    if (!respDownload.ok) {
                        alert('Erro ao baixar o certificado.');
                        return;
                    }
                    // Baixar arquivo
                    const blob = await respDownload.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    // Tenta obter nome do arquivo do header ou usa padrão
                    let filename = `certificado_${idProjeto}.pdf`;
                    const disposition = respDownload.headers.get('Content-Disposition');
                    if (disposition && disposition.indexOf('filename=') !== -1) {
                        filename = disposition.split('filename=')[1].replace(/"/g, '').trim();
                    }
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    setTimeout(() => {
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                    }, 100);
                } catch (e) {
                    alert('Erro ao baixar o certificado.');
                }
            };
        });
    }, 0);
        }

        // Adiciona botão Enviar Feedback para projetos fechados
        if (p.status === 'fechado' && p.rawStatus && p.rawStatus.toUpperCase() !== 'CANCELADO') {
            // Somente se não for cancelado
            actions += `<button class="btn btn-primary btn-sm enviar-feedback-btn" data-id="${p.id}"><i class="bi bi-star"></i> Enviar Feedback</button>`;
        }

        if (p.status === 'aberto') {
            statusClass = 'status-aberto';
        } else if (p.status === 'andamento') {
            statusClass = 'status-andamento';
        } else if (
            p.status === 'fechado' &&
            p.rawStatus &&
            p.rawStatus.toUpperCase() === 'CANCELADO'
        ) {
            statusClass = 'status-cancelado';
        } else if (
            p.status === 'fechado' &&
            p.rawStatus &&
            p.rawStatus.toUpperCase() === 'CONCLUIDO'
        ) {
            statusClass = 'status-concluido';
        } else {
            statusClass = 'status-fechado';
        }

        card.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <span class="project-title">${p.title}</span>
                <span class="project-status ${statusClass}">${
                    p.status === 'aberto'
                        ? (tipoUsuario === 'freelancer' ? 'Candidatura em Aberto' : 'Oportunidade')
                        : p.status === 'andamento'
                            ? 'Em Andamento'
                            : (p.rawStatus && p.rawStatus.toUpperCase() === 'CANCELADO')
                                ? 'Cancelado'
                                : (p.rawStatus && p.rawStatus.toUpperCase() === 'CONCLUIDO')
                                    ? 'Concluído'
                                    : 'Fechado'
                }</span>
            </div>
            <div class="project-meta mb-1"><i class="bi bi-calendar-event"></i> ${p.date} &nbsp; | &nbsp; <i class="bi bi-code-slash"></i> ${p.tech.join(', ')}</div>
            <div class="mb-2">${p.desc}</div>
            <div class="project-actions">
                ${actions}
            </div>
        `;
        document.getElementById('list-todos').appendChild(card.cloneNode(true));
        // Freelancer: candidaturas em aberto vão para "Oportunidades"
        if (tipoUsuario === 'freelancer' && p.status === 'aberto') document.getElementById('list-oportunidades').appendChild(card.cloneNode(true));
        // Empresa: oportunidades normais
        if (tipoUsuario !== 'freelancer' && p.status === 'aberto') document.getElementById('list-oportunidades').appendChild(card.cloneNode(true));
        if (p.status === 'andamento') document.getElementById('list-andamento').appendChild(card.cloneNode(true));
        if (p.status === 'fechado') document.getElementById('list-fechados').appendChild(card.cloneNode(true));
    });

    // Botões de ação
    document.querySelectorAll('.visualizar-btn').forEach(btn => {
        btn.onclick = function () {
            const id = this.getAttribute('data-id');
            // Busca o projeto correspondente
            const projeto = projects.find(p => String(p.id) === String(id));
            // Se não for Oportunidade ou Candidatura em Aberto, redireciona para andamento-projeto
            if (
                projeto &&
                projeto.status !== 'aberto'
            ) {
                window.location.href = `/andamento-projeto/${id}`;
            } else {
                window.location.href = `/detalhes-projeto/${id}`;
            }
        };
    });
    if (tipoUsuario !== 'freelancer') {
        document.querySelectorAll('.ver-candidatos-btn').forEach(btn => {
            btn.onclick = function () {
                const id = this.getAttribute('data-id');
                window.location.href = `/lista-candidatos/${id}`;
            };
        });
    } else {
        // Ação do botão desistir para freelancers
        document.querySelectorAll('.desistir-btn').forEach(btn => {
            btn.onclick = function () {
                const id = this.getAttribute('data-id');
                let modalDesistir = document.getElementById('modalDesistirProjeto');
                if (!modalDesistir) {
                    modalDesistir = document.createElement('div');
                    modalDesistir.className = 'modal fade';
                    modalDesistir.id = 'modalDesistirProjeto';
                    modalDesistir.tabIndex = -1;
                    modalDesistir.innerHTML = `
                        <div class="modal-dialog" style="min-width: 420px; max-width: 540px;">
                          <div class="modal-content">
                            <div class="modal-header">
                              <h5 class="modal-title">Desistir do Projeto</h5>
                              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                            </div>
                            <div class="modal-body">
                              Tem certeza que deseja desistir deste projeto? Esta ação não pode ser desfeita.
                            </div>
                            <div class="modal-footer d-flex justify-content-center gap-2">
                              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                              <button type="button" class="btn btn-secondary" id="confirmarDesistirProjeto">Confirmar Desistência</button>
                            </div>
                          </div>
                        </div>
                    `;
                    document.body.appendChild(modalDesistir);
                }
                const modal = new bootstrap.Modal(modalDesistir);
                modal.show();

                // Remove event listener anterior para evitar múltiplos binds
                const btnConfirmar = document.getElementById('confirmarDesistirProjeto');
                btnConfirmar.onclick = null;
                btnConfirmar.onclick = async function () {
                    const token = localStorage.getItem('token');
                    try {
                        const resp = await fetch(`/projetos/${id}/status/cancelar`, {
                            method: 'PUT',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + token
                            }
                        });
                        if (resp.ok) {
                            modal.hide();
                            alert('Você desistiu do projeto com sucesso!');
                            carregarProjects();
                        } else {
                            alert('Erro ao desistir do projeto.');
                        }
                    } catch (e) {
                        alert('Erro ao desistir do projeto.');
                    }
                };
            };
        });
    }

    // Ação do botão Enviar Feedback
    document.querySelectorAll('.enviar-feedback-btn').forEach(btn => {
        btn.onclick = async function () {
            const id = this.getAttribute('data-id');
            const token = localStorage.getItem('token');
            let endpoint = '';
            if (tipoUsuario === 'freelancer') {
                endpoint = `/avaliacoes/empresa/projeto/${id}`;
            } else {
                endpoint = `/avaliacoes/freelancer/projeto/${id}`;
            }
            try {
                const resp = await fetch(endpoint, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                });
                if (resp.status === 404) {
                    // Abrir modal de feedback igual ao andamentoprojeto.js
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
                            if (value >= i) fill = 1;
                            else if (value >= i - 0.5) fill = 0.5;
                            stars += `<span class="star-clickable" data-value="${i - 0.5}" style="position:relative; display:inline-block; width:1.5em; height:1.5em;">
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
                            star.onmousemove = function (e) {
                                let rect = star.getBoundingClientRect();
                                let x = e.clientX - rect.left;
                                let percent = x / rect.width;
                                let val = percent < 0.5 ? parseFloat(star.getAttribute('data-value')) : parseFloat(star.getAttribute('data-value')) + 0.5;
                                renderStarRating(val);
                            };
                            star.onclick = function (e) {
                                let rect = star.getBoundingClientRect();
                                let x = e.clientX - rect.left;
                                let percent = x / rect.width;
                                let val = percent < 0.5 ? parseFloat(star.getAttribute('data-value')) : parseFloat(star.getAttribute('data-value')) + 0.5;
                                document.getElementById('notaFeedback').value = val;
                                renderStarRating(val);
                            };
                        });
                        starDiv.onmouseleave = function () {
                            let val = parseFloat(document.getElementById('notaFeedback').value) || 0;
                            renderStarRating(val);
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
                            feedbackMsg.innerText = 'Selecione uma nota válida entre 0 e 5.';
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
                        // Envia feedback
                        let postEndpoint = '';
                        if (tipoUsuario === 'freelancer') {
                            postEndpoint = '/avaliacoes/empresa';
                        } else {
                            postEndpoint = '/avaliacoes/freelancer';
                        }
                        try {
                            const resp = await fetch(postEndpoint, {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer ' + token
                                },
                                body: JSON.stringify({
                                    projetoId: id,
                                    nota: Math.round(nota * 2) / 2, // Garante 0.5 steps
                                    comentario: comentario
                                })
                            });
                            if (resp.ok) {
                                modal.hide();
                                alert('Feedback enviado com sucesso!');
                                carregarProjects();
                            } else {
                                feedbackMsg.innerText = 'Erro ao enviar feedback.';
                            }
                        } catch (e) {
                            feedbackMsg.innerText = 'Erro ao enviar feedback.';
                        }
                    };
                } else {
                    alert('Você já enviou um feedback para esse projeto');
                }
            } catch (e) {
                alert('Erro ao verificar feedback.');
            }
        };
    });

    document.querySelectorAll('.desativar-btn').forEach(btn => {
        btn.onclick = function () {
            const id = this.getAttribute('data-id');
            let modalCancel = document.getElementById('modalCancelarProjeto');
            if (!modalCancel) {
                modalCancel = document.createElement('div');
                modalCancel.className = 'modal fade';
                modalCancel.id = 'modalCancelarProjeto';
                modalCancel.tabIndex = -1;
                modalCancel.innerHTML = `
                <div class="modal-dialog" style="min-width: 420px; max-width: 540px;">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title">Cancelar Projeto</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                    </div>
                    <div class="modal-body">
                      Tem certeza que deseja cancelar este projeto? Esta ação não pode ser desfeita.
                    </div>
                    <div class="modal-footer d-flex justify-content-center gap-2">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                      <button type="button" class="btn btn-secondary" id="confirmarCancelarProjeto">Confirmar Cancelamento</button>
                    </div>
                  </div>
                </div>
            `;
                document.body.appendChild(modalCancel);
            }
            const modal = new bootstrap.Modal(modalCancel);
            modal.show();

            // Remove event listener anterior para evitar múltiplos binds
            const btnConfirmar = document.getElementById('confirmarCancelarProjeto');
            btnConfirmar.onclick = null;
            btnConfirmar.onclick = async function () {
                const token = localStorage.getItem('token');
                try {
                    const resp = await fetch(`/projetos/${id}/status/cancelar`, {
                        method: 'PUT',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + token
                        }
                    });
                    if (resp.ok) {
                        modal.hide();
                        alert('Projeto cancelado com sucesso!');
                        carregarProjects();
                    } else {
                        alert('Erro ao cancelar o projeto.');
                    }
                } catch (e) {
                    alert('Erro ao cancelar o projeto.');
                }
            };
        };
    });

    // Ação do botão Editar
    document.querySelectorAll('.editar-btn').forEach(btn => {
        btn.onclick = function () {
            const id = this.getAttribute('data-id');
            // Redireciona para detalhes-projeto com parâmetro para abrir o modal de edição
            window.location.href = `/detalhes-projeto/${id}?editar=1`;
        };
    });
}

if (document.getElementById('searchInput')) {
    document.getElementById('searchInput').addEventListener('input', renderProjects);
}
if (document.getElementById('clearFilters')) {
    document.getElementById('clearFilters').addEventListener('click', function () {
        document.getElementById('searchInput').value = '';
        renderProjects();
    });
}
carregarProjects();

// document.addEventListener('DOMContentLoaded', function () {
//     const params = new URLSearchParams(window.location.search);
//     if (params.get('tab') === 'fechados') {
//         // Ativa a aba "Fechados"
//         const tabFechados = document.getElementById('tab-fechados');
//         if (tabFechados) {
//             tabFechados.click();
//         }
//     }
// });