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
                id: c.id // id da candidatura
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
        rawStatus: (p.status || ''), // <-- Adicionado para exibir o texto correto
        tech: p.requisitos ? p.requisitos.split(',') : [],
        date: p.prazoEntrega ? convertDate(p.prazoEntrega) : "A definir",
        desc: p.descricao,
        id: p.id
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

        // Empresa: editar/desativar/ver candidatos (NÃO mostra baixar certificado)
        if (tipoUsuario !== 'freelancer') {
            if (p.status !== 'fechado') {
                actions += `
                    <button class="btn btn-outline-info btn-sm"><i class="bi bi-pencil"></i> Editar</button>
                    <button class="btn btn-outline-danger btn-sm"><i class="bi bi-slash-circle"></i> Desativar</button>
                `;
            }
            if (p.status === 'aberto') {
                actions += `<button class="btn btn-outline-warning btn-sm ver-candidatos-btn" data-id="${p.id}"><i class="bi bi-people"></i> Ver candidatos</button>`;
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
                actions += `<button class="btn btn-success btn-sm"><i class="bi bi-download"></i> Baixar certificado</button>`;
            }
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
            window.location.href = `/detalhes-projeto/${id}`;
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
            btn.onclick = async function () {
                const id = this.getAttribute('data-id');
                if (confirm('Tem certeza que deseja desistir deste projeto?')) {
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
                            await carregarProjects();
                        } else {
                            alert('Erro ao desistir do projeto.');
                        }
                    } catch (e) {
                        alert('Erro ao desistir do projeto.');
                    }
                }
            };
        });
    }
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