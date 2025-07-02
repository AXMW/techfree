// Lógica de listagem de freelancers
let freelancers = [];
let paginaAtual = 1;
const porPagina = 6;

async function carregarFreelancers() {
    try {
        const resp = await fetch('/freelancer/listar-todos');
        if (!resp.ok) throw new Error('Erro ao buscar freelancers');
        freelancers = await resp.json();
        renderFreelancers();
    } catch (e) {
        document.getElementById('freelancers-list').innerHTML = `<div class="alert alert-danger">Erro ao carregar freelancers.</div>`;
    }
}

function renderFreelancers() {
    const lista = document.getElementById('freelancers-list');
    lista.innerHTML = '';
    const search = (document.getElementById('searchInput')?.value || '').toLowerCase();
    let filtradas = freelancers.filter(f =>
        (!search ||
            f.nome?.toLowerCase().includes(search) ||
            f.areaAtuacao?.toLowerCase().includes(search) ||
            f.emailContato?.toLowerCase().includes(search) ||
            f.telefoneContato?.toLowerCase().includes(search) ||
            f.github?.toLowerCase().includes(search) ||
            f.linkedin?.toLowerCase().includes(search) ||
            (Array.isArray(f.habilidades) ? f.habilidades.join(',').toLowerCase().includes(search) : (f.habilidades || '').toLowerCase().includes(search))
        )
    );
    const inicio = 0;
    const fim = paginaAtual * porPagina;
    filtradas.slice(inicio, fim).forEach(f => {
        const col = document.createElement('div');
        col.className = 'col-12 col-md-6 col-lg-4 d-flex';
        function makeAbsolute(url) {
            if (!url) return '';
            if (/^https?:\/\//i.test(url)) return url;
            return 'https://' + url.replace(/^\/*/, '');
        }
        // Pega até 3 habilidades e monta as tags com cor personalizada
        let habilidadesTags = '-';
        const tagStyle = 'background:#FF6F00;color:#fff;font-weight:600;';
        if (Array.isArray(f.habilidades) && f.habilidades.length > 0) {
            habilidadesTags = f.habilidades.slice(0, 3).map(h => `<span class="badge me-1" style="${tagStyle}">${h}</span>`).join(' ');
        } else if (typeof f.habilidades === 'string' && f.habilidades.trim() !== '') {
            habilidadesTags = `<span class="badge me-1" style="${tagStyle}">${f.habilidades}</span>`;
        }
        col.innerHTML = `
            <div class="card h-100 empresa-card w-100 freelancer-card-clickable" data-id="${f.id}">
                <div class="card-body d-flex flex-column align-items-center text-center">
                    <div class="empresa-avatar-wrap mb-3">
                        <img src="${f.avatar || 'assets/img/default-avatar.png'}" alt="Avatar" class="rounded-circle" style="width:96px;height:96px;object-fit:cover;">
                    </div>
                    <h5 class="card-title mb-1">${f.nome || '-'}</h5>
                    <div class="empresa-area mb-2" style="color:#FF6F00;font-weight:600;">${f.areaAtuacao || '-'}</div>
                    <div class="mb-2 w-100 d-flex flex-column align-items-center gap-1">
                        <span><i class="bi bi-envelope"></i> <span class="ms-1">${f.emailContato || '-'}</span></span>
                        <span><i class="bi bi-whatsapp"></i> <span class="ms-1">${f.telefoneContato || '-'}</span></span>
                        <span class="d-flex flex-row gap-2">
                            ${f.github ? `<a href='${makeAbsolute(f.github)}' target='_blank' rel='noopener' class='ms-1' title='GitHub'><i class='bi bi-github'></i></a>` : ''}
                            ${f.linkedin ? `<a href='${makeAbsolute(f.linkedin)}' target='_blank' rel='noopener' class='ms-1' title='LinkedIn'><i class='bi bi-linkedin'></i></a>` : ''}
                            ${f.portfolio ? `<a href='${makeAbsolute(f.portfolio)}' target='_blank' rel='noopener' class='ms-1' title='Portfólio/Site'><i class='bi bi-globe'></i></a>` : ''}
                        </span>
                        <span class="w-100 d-block text-center mt-2" style="font-size:0.98rem;color:#a19e9e;">
                            <strong>Habilidades:</strong> ${habilidadesTags}
                        </span>
                    </div>
                </div>
            </div>
        `;
        // Adiciona evento de clique para redirecionar ao perfil do freelancer
        col.querySelector('.freelancer-card-clickable').addEventListener('click', function(evn) {
            // Evita que clique em links internos (github/linkedin/portfolio) dispare o redirecionamento do card
            if (evn.target.closest('a')) return;
            const id = this.getAttribute('data-id');
            if (id) {
                window.location.href = `/ver-perfil-freelancer/${id}`;
            }
        });
        lista.appendChild(col);
    });
    document.getElementById('loadMoreBtn').style.display = (filtradas.length > fim) ? '' : 'none';
}

document.getElementById('filterForm').onsubmit = function(e) {
    e.preventDefault();
    paginaAtual = 1;
    renderFreelancers();
};
document.getElementById('searchInput').oninput = function() {
    paginaAtual = 1;
    renderFreelancers();
};
document.getElementById('loadMoreBtn').onclick = function() {
    paginaAtual++;
    renderFreelancers();
};

document.addEventListener('DOMContentLoaded', carregarFreelancers);
