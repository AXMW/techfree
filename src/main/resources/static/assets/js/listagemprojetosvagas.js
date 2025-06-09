// Carregamento dinâmico de projetos/vagas via API
let loaded = 0;
let projects = [];

// Busca projetos do backend
async function fetchProjects() {
    try {
        const response = await fetch('http://localhost:8080/projetos/listar-abertos-freelancer');
        if (!response.ok) throw new Error('Erro ao buscar projetos');
        projects = await response.json();
        loaded = 0;
        document.getElementById('projects-list').innerHTML = '';
        loadMoreProjects();
    } catch (e) {
        alert('Erro ao carregar projetos!');
        console.error(e);
    }
}

// Filtro de busca e seleção
document.getElementById('filterForm').addEventListener('submit', function (e) {
    e.preventDefault();
    filterProjects();
});

function filterProjects() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('#projects-list .project-card');
    cards.forEach(card => {
        const tags = card.getAttribute('data-tags') || '';
        const company = card.getAttribute('data-company') || '';
        const desc = card.getAttribute('data-desc') || '';
        let show = true;
        if (
            search &&
            !(
                card.textContent.toLowerCase().includes(search) ||
                tags.toLowerCase().includes(search) ||
                company.toLowerCase().includes(search) ||
                desc.toLowerCase().includes(search)
            )
        ) {
            show = false;
        }
        card.style.display = show ? '' : 'none';
    });
}

// Carregar mais projetos
function loadMoreProjects() {
    const list = document.getElementById('projects-list');
    for (let i = loaded; i < loaded + 2 && i < projects.length; i++) {
        const p = projects[i];
        const card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('data-tags', p.requisitos || '');
        card.setAttribute('data-company', p.empresa || '');
        card.setAttribute('data-desc', p.descricao || '');
        card.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <span class="project-title">${p.titulo}</span>
                <span class="project-company">${p.empresa}</span>
            </div>
            <div class="project-desc">${p.subtitulo || ''}</div>
            <div class="project-info">
                <i class="bi bi-clock"></i> Duração: ${p.duracao || '-'} meses
                &nbsp; | &nbsp;
                <i class="bi bi-cash-coin"></i> Orçamento: R$ ${Number(p.orcamento).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
            </div>
            <div class="project-tags mb-2">
                ${(p.requisitos || '').split(',').map(tag => `<span class="badge">${tag.trim()}</span>`).join('')}
            </div>
            <a href="#" class="btn btn-outline-light btn-sm mt-2 ver-detalhes-btn" data-id="${p.id}">
                <i class="bi bi-eye"></i> Ver Detalhes
            </a>
        `;
        list.appendChild(card);
    }
    loaded += 2;
    if (loaded >= projects.length) {
        document.getElementById('loadMoreBtn').style.display = 'none';
    } else {
        document.getElementById('loadMoreBtn').style.display = '';
    }
    filterProjects();

    // Adiciona o evento de clique para todos os botões "Ver Detalhes"
    document.querySelectorAll('.ver-detalhes-btn').forEach(btn => {
        btn.onclick = function(e) {
            e.preventDefault();
            const id = this.getAttribute('data-id');
            window.location.href = `/detalhes-projeto/${id}`;
        };
    });
}

document.getElementById('loadMoreBtn').addEventListener('click', loadMoreProjects);

// Inicialização
fetchProjects();