// Exemplo de projetos simulados
let projects = [];

async function carregarProjects() {
    try {
        const response = await fetch('/projetos', {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlbXByZXNhQGxlZ2FsLmNvbSIsImlhdCI6MTc0ODkwOTczMiwiZXhwIjoxNzQ4OTk2MTMyfQ.-MA5MZ9OCDjgxOUcs0H1wFeTf3SG74DzMABW_kiRJ5I'
            }
        });
        if (!response.ok) throw new Error('Erro ao buscar projetos');
        const data = await response.json();
        // Adapte conforme o formato retornado pela API
        projects = data.map(p => ({
            title: p.titulo,
            status: 'aberto', // ajuste conforme o campo correto
            tech: p.requisitos ? p.requisitos.split(',') : [],
            date: p.prazoEntrega.substring(8,10) + "/" + p.prazoEntrega.substring(5,7) + "/" + p.prazoEntrega.substring(0,4), // <-- aqui faz a conversão
            desc: p.descricao,
            id: p.id
        }));
        renderProjects();
    } catch (e) {
        console.error(e);
    }
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

        // Botões padrão
        let actions = `
            <button class="btn btn-outline-light btn-sm"><i class="bi bi-eye"></i> Visualizar</button>
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

        // Se for oportunidade, mostra ver candidatos
        if (p.status === 'aberto') {
            actions += `<button class="btn btn-outline-warning btn-sm"><i class="bi bi-people"></i> Ver candidatos</button>`;
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
}

document.getElementById('searchInput').addEventListener('input', renderProjects);
document.getElementById('clearFilters').addEventListener('click', function () {
    document.getElementById('searchInput').value = '';
    renderProjects();
});
carregarProjects();