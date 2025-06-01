// Simulação de carregamento de mais projetos/vagas
const projects = [
    {
        title: "Sistema de Reservas de Salas",
        company: "BookEasy",
        desc: "Implemente um sistema web para reservas de salas em empresas, com calendário e notificações.",
        info: '<i class="bi bi-geo-alt"></i> Presencial &nbsp; | &nbsp; <i class="bi bi-calendar-event"></i> Início: 20/07/2025 &nbsp; | &nbsp; <i class="bi bi-clock"></i> Duração: 2 meses',
        tags: ["Vue.js", "Laravel", "MySQL"],
        lang: "PHP",
        dataTags: "Vue.js,Laravel,MySQL",
        dataDesc: "reservas salas calendário notificações"
    },
    {
        title: "Portal de Notícias Universitárias",
        company: "UniNews",
        desc: "Desenvolva um portal para publicação de notícias, eventos e comunicados acadêmicos.",
        info: '<i class="bi bi-geo-alt"></i> Remoto &nbsp; | &nbsp; <i class="bi bi-calendar-event"></i> Início: 05/08/2025 &nbsp; | &nbsp; <i class="bi bi-clock"></i> Duração: 5 meses',
        tags: ["WordPress", "SEO", "Jornalismo"],
        lang: "PHP",
        dataTags: "WordPress,SEO,Jornalismo",
        dataDesc: "portal notícias eventos comunicados"
    },
    {
        title: "E-commerce de Produtos Artesanais",
        company: "ArtesanatoBR",
        desc: "Participe da criação de uma loja virtual para artesãos, com integração de pagamentos e área do vendedor.",
        info: '<i class="bi bi-geo-alt"></i> Remoto &nbsp; | &nbsp; <i class="bi bi-calendar-event"></i> Início: 12/08/2025 &nbsp; | &nbsp; <i class="bi bi-clock"></i> Duração: 4 meses',
        tags: ["Shopify", "UX/UI", "Pagamentos"],
        lang: "JavaScript",
        dataTags: "Shopify,UX/UI,Pagamentos",
        dataDesc: "ecommerce loja virtual artesanato pagamentos"
    }
];
let loaded = 0;

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
document.getElementById('loadMoreBtn').addEventListener('click', function () {
    const list = document.getElementById('projects-list');
    for (let i = loaded; i < loaded + 2 && projects.length; i++) {
        if (projects.length === 0) break;
        const p = projects.shift();
        const card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('data-tags', p.dataTags);
        card.setAttribute('data-company', p.company);
        card.setAttribute('data-desc', p.dataDesc);
        card.setAttribute('data-lang', p.lang);
        card.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <span class="project-title">${p.title}</span>
                <span class="project-company">${p.company}</span>
            </div>
            <div class="project-desc">${p.desc}</div>
            <div class="project-info">${p.info}</div>
            <div class="project-tags mb-2">
                ${p.tags.map(tag => `<span class="badge">${tag}</span>`).join('')}
            </div>
            <a href="#" class="btn btn-outline-light btn-sm mt-2"><i class="bi bi-eye"></i> Ver Detalhes</a>
        `;
        list.appendChild(card);
    }
    loaded += 2;
    if (projects.length === 0) {
        this.style.display = 'none';
    }
    filterProjects();
});