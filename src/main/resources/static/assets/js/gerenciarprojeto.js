// Exemplo de projetos simulados
let projects = [];

async function carregarProjects() {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('/projetos', {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
        if (!response.ok) throw new Error('Erro ao buscar projetos');
        const data = await response.json();
        // Adapte conforme o formato retornado pela API
        projects = data.map(p => {
            // Normaliza o status vindo da API
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
                tech: p.requisitos ? p.requisitos.split(',') : [],
                date: p.prazoEntrega != undefined ? convertDate(p.prazoEntrega) : "A definir",
                desc: p.descricao,
                id: p.id
            };
        });
        renderProjects();
    } catch (e) {
        console.error(e);
    }
}

function convertDate(dateString) {
    return dateString.substring(8,10) + "/" + dateString.substring(5,7) + "/" + dateString.substring(0,4);    
}

function renderProjects() {
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

        // Botões padrão (adiciona data-id no botão Visualizar e Ver candidatos)
        let actions = `
            <button class="btn btn-outline-light btn-sm visualizar-btn" data-id="${p.id}">
                <i class="bi bi-eye"></i> Visualizar
            </button>
        `;

        // Se não for fechado, mostra editar e desativar
        if (p.status !== 'fechado') {
            actions += `
                <button class="btn btn-outline-info btn-sm"><i class="bi bi-pencil"></i> Editar</button>
                <button class="btn btn-outline-danger btn-sm"><i class="bi bi-slash-circle"></i> Desativar</button>
            `;
        }

        // Se for fechado, mostra baixar certificado
        if (p.status === 'fechado') {
            actions += `<button class="btn btn-success btn-sm"><i class="bi bi-download"></i> Baixar certificado</button>`;
        }

        // Se for oportunidade, mostra ver candidatos (adiciona data-id)
        if (p.status === 'aberto') {
            actions += `<button class="btn btn-outline-warning btn-sm ver-candidatos-btn" data-id="${p.id}"><i class="bi bi-people"></i> Ver candidatos</button>`;
        }

        card.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <span class="project-title">${p.title}</span>
                <span class="project-status status-${p.status}">${p.status === 'aberto'
                ? 'Oportunidade'
                : p.status === 'andamento'
                    ? 'Em Andamento'
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
        if (p.status === 'aberto') document.getElementById('list-oportunidades').appendChild(card.cloneNode(true));
        if (p.status === 'andamento') document.getElementById('list-andamento').appendChild(card.cloneNode(true));
        if (p.status === 'fechado') document.getElementById('list-fechados').appendChild(card.cloneNode(true));
    });

    // Adiciona o evento de clique para todos os botões "Visualizar"
    document.querySelectorAll('.visualizar-btn').forEach(btn => {
        btn.onclick = function () {
            const id = this.getAttribute('data-id');
            window.location.href = `/detalhes-projeto/${id}`;
        };
    });

    // Adiciona o evento de clique para todos os botões "Ver candidatos"
    document.querySelectorAll('.ver-candidatos-btn').forEach(btn => {
        btn.onclick = function () {
            const id = this.getAttribute('data-id');
            window.location.href = `/lista-candidatos/${id}`;
        };
    });
}

document.getElementById('searchInput').addEventListener('input', renderProjects);
document.getElementById('clearFilters').addEventListener('click', function () {
    document.getElementById('searchInput').value = '';
    renderProjects();
});
carregarProjects();