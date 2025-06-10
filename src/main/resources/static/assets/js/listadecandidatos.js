document.addEventListener('DOMContentLoaded', async function () {
    const projetoId = document.body.getAttribute('data-projeto-id');
    const candidatesList = document.getElementById('candidates-list');
    const pagination = document.querySelector('.pagination');
    const searchInput = document.getElementById('searchInput');
    const searchForm = document.getElementById('searchForm');
    let candidatos = [];
    let candidatosFiltrados = [];
    let currentPage = 1;
    const perPage = 5;

    async function carregarCandidatos() {
        try {
            const response = await fetch(`http://localhost:8080/candidaturas/projeto/${projetoId}`);
            if (!response.ok) throw new Error('Erro ao buscar candidatos');
            candidatos = await response.json();

            // Verifica se algum candidato já foi aprovado
            if (candidatos.some(c => (c.status || '').toUpperCase() === 'ACEITA')) {
                document.body.innerHTML = `
                    <div class="d-flex flex-column justify-content-center align-items-center vh-100 bg-dark text-white">
                        <h2>Um candidato já foi aprovado para este projeto.</h2>
                    </div>
                `;
                return;
            }

            candidatosFiltrados = candidatos;
            currentPage = 1;
            renderCandidatos();
            renderPagination();
        } catch (e) {
            document.body.innerHTML = `
                <div class="d-flex flex-column justify-content-center align-items-center vh-100 bg-dark text-white">
                    <h2>Erro ao carregar candidatos.</h2>
                </div>
            `;
            console.error(e);
        }
    }

    function filtrarCandidatos() {
        const termo = (searchInput.value || '').toLowerCase().trim();
        if (!termo) {
            candidatosFiltrados = candidatos;
        } else {
            candidatosFiltrados = candidatos.filter(c => {
                return (
                    (c.freelancerNome && c.freelancerNome.toLowerCase().includes(termo)) ||
                    (c.freelancerAreaDeAtuacao && c.freelancerAreaDeAtuacao.toLowerCase().includes(termo)) ||
                    (c.freelancerTecnologias && c.freelancerTecnologias.toLowerCase().includes(termo)) ||
                    (c.freelancerEmail && c.freelancerEmail.toLowerCase().includes(termo)) ||
                    (c.frelancerTelefone && c.frelancerTelefone.toLowerCase().includes(termo)) ||
                    (c.mensagem && c.mensagem.toLowerCase().includes(termo))
                );
            });
        }
        currentPage = 1;
        renderCandidatos();
        renderPagination();
    }

    function renderCandidatos() {
        candidatesList.innerHTML = '';

        // Separar candidatos pendentes e recusados
        const pendentes = candidatosFiltrados.filter(c => c.status !== 'RECUSADA');
        const recusados = candidatosFiltrados.filter(c => c.status === 'RECUSADA');

        // Paginação só para pendentes
        const start = (currentPage - 1) * perPage;
        const end = start + perPage;
        const pagePendentes = pendentes.slice(start, end);

        // Renderizar pendentes
        if (pagePendentes.length) {
            const pendentesHeader = document.createElement('h4');
            pendentesHeader.className = 'mb-3 text-info';
            pendentesHeader.textContent = 'Candidatos Pendentes';
            candidatesList.appendChild(pendentesHeader);

            pagePendentes.forEach(c => {
                const card = document.createElement('div');
                card.className = 'candidate-card';

                card.innerHTML = `
                    <img src="https://randomuser.me/api/portraits/men/${c.freelancerId % 99}.jpg" class="candidate-avatar" alt="Avatar">
                    <div class="candidate-info">
                        <h5>${c.freelancerNome || 'Nome não informado'}</h5>
                        ${c.freelancerAreaDeAtuacao ? `<span class="badge bg-info">${c.freelancerAreaDeAtuacao}</span>` : ''}
                        ${c.freelancerTecnologias ? c.freelancerTecnologias.split(',').map(tec => `<span class="badge bg-info">${tec.trim()}</span>`).join('') : ''}
                        <div class="small mt-1"><i class="bi bi-envelope"></i> ${c.freelancerEmail || '-'}</div>
                        <div class="small"><i class="bi bi-telephone"></i> ${c.frelancerTelefone || '-'}</div>
                    </div>
                    <div class="candidate-actions">
                        <button class="btn btn-success btn-sm aprovar-btn" data-freelancer-id="${c.freelancerId}" data-projeto-id="${projetoId}" data-candidatura-id="${c.id}"><i class="bi bi-check-circle"></i> Aprovar</button>
                        <button class="btn btn-danger btn-sm recusar-btn" data-freelancer-id="${c.freelancerId}" data-projeto-id="${projetoId}" data-candidatura-id="${c.id}"><i class="bi bi-x-circle"></i> Rejeitar</button>
                        <a href="#" class="btn btn-outline-light btn-sm"><i class="bi bi-eye"></i> Ver Perfil</a>
                    </div>
                `;
                candidatesList.appendChild(card);
            });
        } else {
            candidatesList.innerHTML += `<div class="text-center text-muted py-3">Nenhum candidato pendente encontrado para este projeto.</div>`;
        }

        // Renderizar recusados (sem paginação)
        if (recusados.length) {
            const recusadosHeader = document.createElement('h4');
            recusadosHeader.className = 'mb-3 mt-4 text-danger';
            recusadosHeader.textContent = 'Candidatos Recusados';
            candidatesList.appendChild(recusadosHeader);

            recusados.forEach(c => {
                const card = document.createElement('div');
                card.className = 'candidate-card';

                card.innerHTML = `
                    <img src="https://randomuser.me/api/portraits/men/${c.freelancerId % 99}.jpg" class="candidate-avatar" alt="Avatar">
                    <div class="candidate-info">
                        <h5>${c.freelancerNome || 'Nome não informado'}</h5>
                        ${c.freelancerAreaDeAtuacao ? `<span class="badge bg-info">${c.freelancerAreaDeAtuacao}</span>` : ''}
                        ${c.freelancerTecnologias ? c.freelancerTecnologias.split(',').map(tec => `<span class="badge bg-info">${tec.trim()}</span>`).join('') : ''}
                        <div class="small mt-1"><i class="bi bi-envelope"></i> ${c.freelancerEmail || '-'}</div>
                        <div class="small"><i class="bi bi-telephone"></i> ${c.frelancerTelefone || '-'}</div>
                        <div class="mt-2"><span class="badge bg-danger">Candidato Recusado</span></div>
                    </div>
                    <div class="candidate-actions">
                        <a href="#" class="btn btn-outline-light btn-sm"><i class="bi bi-eye"></i> Ver Perfil</a>
                    </div>
                `;
                candidatesList.appendChild(card);
            });
        }

        // Eventos para Aprovar e Recusar (apenas para pendentes)
        document.querySelectorAll('.aprovar-btn').forEach(btn => {
            btn.onclick = function () {
                // Cria modal de confirmação customizada se não existir
                let modalConfirm = document.getElementById('modalConfirmarAprovar');
                if (!modalConfirm) {
                    modalConfirm = document.createElement('div');
                    modalConfirm.className = 'modal fade';
                    modalConfirm.id = 'modalConfirmarAprovar';
                    modalConfirm.tabIndex = -1;
                    modalConfirm.innerHTML = `
                        <div class="modal-dialog modal-dialog-centered">
                          <div class="modal-content">
                            <div class="modal-header">
                              <h5 class="modal-title">Confirmar aprovação</h5>
                              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                            </div>
                            <div class="modal-body">
                              <p>Tem certeza que deseja <strong>aprovar este freelancer</strong> para o projeto?</p>
                            </div>
                            <div class="modal-footer d-flex justify-content-center gap-2">
                              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                              <button type="button" class="btn btn-secondary" id="confirmarAprovarBtn">Confirmar</button>
                            </div>
                          </div>
                        </div>
                    `;
                    document.body.appendChild(modalConfirm);
                }
                const modal = new bootstrap.Modal(modalConfirm);
                modal.show();

                // Remove event listeners antigos
                const btnConfirmar = document.getElementById('confirmarAprovarBtn');
                btnConfirmar.replaceWith(btnConfirmar.cloneNode(true));
                const btnConfirmarNovo = document.getElementById('confirmarAprovarBtn');
                btnConfirmarNovo.onclick = async () => {
                    const projetoId = btn.getAttribute('data-projeto-id');
                    const freelancerId = btn.getAttribute('data-freelancer-id');
                    const token = localStorage.getItem('token');
                    try {
                        const response = await fetch('/projetos/selecionar-freelancer', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + token
                            },
                            body: JSON.stringify({
                                projetoId: Number(projetoId),
                                freelancerId: Number(freelancerId)
                            })
                        });
                        if (response.ok) {
                            window.location.href = `/andamento-projeto/${projetoId}`;
                        } else {
                            const data = await response.json();
                            alert(data.message || 'Erro ao aprovar freelancer.');
                        }
                    } catch (err) {
                        alert('Erro ao conectar ao servidor.');
                        console.error(err);
                    }
                };
            };
        });

        document.querySelectorAll('.recusar-btn').forEach(btn => {
            btn.onclick = function () {
                // Cria modal de confirmação customizada se não existir
                let modalConfirm = document.getElementById('modalConfirmarRecusar');
                if (!modalConfirm) {
                    modalConfirm = document.createElement('div');
                    modalConfirm.className = 'modal fade';
                    modalConfirm.id = 'modalConfirmarRecusar';
                    modalConfirm.tabIndex = -1;
                    modalConfirm.innerHTML = `
                        <div class="modal-dialog modal-dialog-centered">
                          <div class="modal-content">
                            <div class="modal-header">
                              <h5 class="modal-title">Confirmar recusa</h5>
                              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                            </div>
                            <div class="modal-body">
                              <p>Tem certeza que deseja <strong>recusar este freelancer</strong> para o projeto?</p>
                            </div>
                            <div class="modal-footer d-flex justify-content-center gap-2">
                              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                              <button type="button" class="btn btn-secondary" id="confirmarRecusarBtn">Confirmar</button>
                            </div>
                          </div>
                        </div>
                    `;
                    document.body.appendChild(modalConfirm);
                }
                const modal = new bootstrap.Modal(modalConfirm);
                modal.show();

                // Remove event listeners antigos
                const btnConfirmar = document.getElementById('confirmarRecusarBtn');
                btnConfirmar.replaceWith(btnConfirmar.cloneNode(true));
                const btnConfirmarNovo = document.getElementById('confirmarRecusarBtn');
                btnConfirmarNovo.onclick = async () => {
                    const candidaturaId = btn.getAttribute('data-candidatura-id');
                    const token = localStorage.getItem('token');
                    try {
                        const response = await fetch(`/candidaturas/${candidaturaId}/recusar`, {
                            method: 'PUT',
                            headers: {
                                'Authorization': 'Bearer ' + token
                            }
                        });
                        if (response.ok) {
                            alert('Freelancer recusado com sucesso!');
                            modal.hide();
                            carregarCandidatos();
                        } else {
                            const data = await response.json();
                            alert(data.message || 'Erro ao recusar freelancer.');
                        }
                    } catch (err) {
                        alert('Erro ao conectar ao servidor.');
                        console.error(err);
                    }
                };
            };
        });
    }

    function renderPagination() {
        if (!pagination) return;
        // Paginação só para pendentes
        const pendentes = candidatosFiltrados.filter(c => c.status !== 'RECUSADA');
        const totalPages = Math.ceil(pendentes.length / perPage);
        let html = '';

        html += `<li class="page-item${currentPage === 1 ? ' disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage - 1}"><i class="bi bi-chevron-left"></i></a>
        </li>`;

        for (let i = 1; i <= totalPages; i++) {
            html += `<li class="page-item${i === currentPage ? ' active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>`;
        }

        html += `<li class="page-item${currentPage === totalPages ? ' disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage + 1}"><i class="bi bi-chevron-right"></i></a>
        </li>`;

        pagination.innerHTML = html;

        // Eventos de clique
        pagination.querySelectorAll('a.page-link').forEach(link => {
            link.onclick = function (e) {
                e.preventDefault();
                const page = Number(this.getAttribute('data-page'));
                if (page >= 1 && page <= totalPages && page !== currentPage) {
                    currentPage = page;
                    renderCandidatos();
                    renderPagination();
                }
            };
        });
    }

    // Evento de busca
    searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        filtrarCandidatos();
    });

    searchInput.addEventListener('input', function () {
        filtrarCandidatos();
    });

    carregarCandidatos();
});