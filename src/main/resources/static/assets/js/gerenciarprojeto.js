// Exemplo de projetos simulados
const projects = [
    {
        title: "Plataforma de Gestão de Projetos Integrados",
        status: "aberto",
        tech: ["React", "Node.js"],
        date: "10/05/2025",
        desc: "Sistema web para conectar empresas, estudantes e instituições.",
        id: 1
    },
    {
        title: "Sistema de Controle de Estoque",
        status: "andamento",
        tech: ["Angular", "Firebase"],
        date: "15/04/2025",
        desc: "Dashboard de estoque com relatórios e integração mobile.",
        id: 2
    },
    {
        title: "App de Saúde Mental",
        status: "fechado",
        tech: ["Flutter", "Firebase"],
        date: "20/02/2025",
        desc: "Aplicativo mobile para acompanhamento de saúde mental.",
        id: 3
    },
    {
        title: "Portal de Notícias Universitárias",
        status: "aberto",
        tech: ["WordPress", "PHP"],
        date: "01/06/2025",
        desc: "Portal para publicação de notícias e eventos acadêmicos.",
        id: 4
    },
    {
        title: "E-commerce de Produtos Artesanais",
        status: "andamento",
        tech: ["Shopify", "UX/UI"],
        date: "28/03/2025",
        desc: "Loja virtual para artesãos com integração de pagamentos.",
        id: 5
    },
    {
        title: "Sistema de Reservas de Salas",
        status: "fechado",
        tech: ["Vue.js", "Laravel"],
        date: "12/01/2025",
        desc: "Sistema web para reservas de salas em empresas.",
        id: 6
    }
];

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
renderProjects();