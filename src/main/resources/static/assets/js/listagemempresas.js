// Lógica de listagem de empresas
let empresas = [];
let paginaAtual = 1;
const porPagina = 6;

async function carregarEmpresas() {
    try {
        const resp = await fetch('/empresa/listar-todos');
        if (!resp.ok) throw new Error('Erro ao buscar empresas');
        empresas = await resp.json();
        renderEmpresas();
    } catch (e) {
        document.getElementById('empresas-list').innerHTML = `<div class="alert alert-danger">Erro ao carregar empresas.</div>`;
    }
}

function renderEmpresas() {
    const lista = document.getElementById('empresas-list');
    lista.innerHTML = '';
    const search = (document.getElementById('searchInput')?.value || '').toLowerCase();
    let filtradas = empresas.filter(e =>
        (!search ||
            e.nomeFantasia?.toLowerCase().includes(search) ||
            e.areaAtuacao?.toLowerCase().includes(search) ||
            e.emailContato?.toLowerCase().includes(search) ||
            e.telefoneContato?.toLowerCase().includes(search) ||
            e.linkedin?.toLowerCase().includes(search) ||
            e.site?.toLowerCase().includes(search)
        )
    );
    const inicio = 0;
    const fim = paginaAtual * porPagina;
    filtradas.slice(inicio, fim).forEach(e => {
        const col = document.createElement('div');
        col.className = 'col-12 col-md-6 col-lg-4 d-flex';
        // Função para garantir que o link seja absoluto
        function makeAbsolute(url) {
            if (!url) return '';
            if (/^https?:\/\//i.test(url)) return url;
            return 'https://' + url.replace(/^\/*/, '');
        }
        col.innerHTML = `
            <div class="card h-100 empresa-card w-100">
                <div class="card-body d-flex flex-column align-items-center text-center">
                    <div class="empresa-avatar-wrap mb-3">
                        <img src="${e.avatar || 'assets/img/default-avatar.png'}" alt="Logo" class="rounded-circle" style="width:96px;height:96px;object-fit:cover;">
                    </div>
                    <h5 class="card-title mb-1">${e.nomeFantasia || '-'}</h5>
                    <div class="empresa-area mb-2" style="color:#06a0b2;font-weight:600;">${e.areaAtuacao || '-'}</div>
                    <div class="mb-2 w-100 d-flex flex-column align-items-center gap-1">
                        <span><i class="bi bi-envelope"></i> <span class="ms-1">${e.emailContato || '-'}</span></span>
                        <span><i class="bi bi-whatsapp"></i> <span class="ms-1">${e.telefoneContato || '-'}</span></span>
                        <span class="d-flex flex-row gap-2">
                            ${e.likedin ? `<a href='${makeAbsolute(e.likedin)}' target='_blank' rel='noopener' class='ms-1' title='LinkedIn'><i class='bi bi-linkedin'></i></a>` : ''}
                            ${e.site ? `<a href='${makeAbsolute(e.site)}' target='_blank' rel='noopener' class='ms-1' title='Site'><i class='bi bi-globe'></i></a>` : ''}
                        </span>
                    </div>
                </div>
            </div>
        `;
        lista.appendChild(col);
    });
    // Esconde botão se não houver mais
    document.getElementById('loadMoreBtn').style.display = (filtradas.length > fim) ? '' : 'none';
}

document.getElementById('filterForm').onsubmit = function(e) {
    e.preventDefault();
    paginaAtual = 1;
    renderEmpresas();
};
document.getElementById('searchInput').oninput = function() {
    paginaAtual = 1;
    renderEmpresas();
};
document.getElementById('loadMoreBtn').onclick = function() {
    paginaAtual++;
    renderEmpresas();
};

document.addEventListener('DOMContentLoaded', carregarEmpresas);
