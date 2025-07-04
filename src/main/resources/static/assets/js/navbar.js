// Filtro de busca dinâmica nas perguntas
const faqSearch = document.getElementById('faqSearch');
if (faqSearch) {
    faqSearch.addEventListener('input', function () {
        const search = this.value.toLowerCase();
        document.querySelectorAll('.accordion-item').forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(search) ? '' : 'none';
        });
    });
}

// Buscar notificações do backend
let notificacoes = [];

async function carregarNotificacoes() {
    const token = localStorage.getItem('token');
    if (!token) return [];
    try {
        const resp = await fetch('/notificacoes', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if (!resp.ok) throw new Error('Erro ao buscar notificações');
        const data = await resp.json();
        // Mapeia para o formato usado no frontend
        return data.map(n => ({
            id: n.id,
            tituloOriginal: n.titulo, // salva o original para lógica de link
            titulo: n.titulo
                .replace(/_/g, ' ')
                .toLowerCase()
                .replace(/^\s*\w/, c => c.toUpperCase()),
            detalhes: n.mensagem,
            tempo: formatarTempo(n.data),
            lida: n.lida, // <-- alterado de unread para lida
            projetoId: n.projetoId,
            link: '' // será preenchido ao renderizar
        }));
    } catch (e) {
        return [];
    }
}

function criarNotificacaoLi(n, idx) {
    // Gera o link dinâmico
    const link = getNotificacaoLink(n);
    const li = document.createElement('li');
    li.innerHTML = `
        <a href="${link}" class="notification-link" style="text-decoration:none;display:block;">
            <div class="notification-item${!n.lida ? ' unread' : ''}">
                <div class="notification-content">
                    <div class="notification-title">${n.titulo}</div>
                    <div class="notification-details">${n.detalhes}</div>
                </div>
                <div class="notification-meta">
                    <span class="notification-time">${n.tempo}</span>
                    <button class="notification-remove" title="Remover notificação" type="button">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </div>
            </div>
        </a>
        <hr class="dropdown-divider">
    `;
    return li;
}

let notificacoesVisiveis = 3;

function renderNotificacoes(quantidade = 3) {
    const ul = document.getElementById('notificacoesDropdown');
    if (!ul) return;
    ul.innerHTML = '';
    const mostrar = Math.min(quantidade, notificacoes.length);
    notificacoes.slice(0, mostrar).forEach((n, idx) => {
        ul.appendChild(criarNotificacaoLi(n, idx));
    });
    if (notificacoes.length > mostrar) {
        const liVerMais = document.createElement('li');
        liVerMais.className = "text-center";
        liVerMais.id = "verMaisLi";
        liVerMais.innerHTML = `<button class="dropdown-item text-center" style="width: 97%" id="verMaisBtn" type="button">Ver mais</button>`;
        ul.appendChild(liVerMais);
    }
    if (mostrar > 6) {
        ul.classList.add('max-scroll');
    } else {
        ul.classList.remove('max-scroll');
    }
    atualizarBadgeNotificacoes();
}

function atualizarBadgeNotificacoes() {
    const badge = document.querySelector('#dropdownNotificacoes .badge');
    if (!badge) return;
    const novas = notificacoes.filter(n => !n.lida).length; // <-- alterado
    if (novas > 0) {
        badge.textContent = novas;
        badge.style.display = '';
    } else {
        badge.textContent = '';
        badge.style.display = 'none';
    }
}

// Inicializa notificações ao carregar
document.addEventListener('DOMContentLoaded', function () {
    renderNotificacoes(notificacoesVisiveis);

    const notificacoesDropdown = document.getElementById('notificacoesDropdown');
    if (notificacoesDropdown) {
        notificacoesDropdown.addEventListener('click', async function (e) {
            // Remover notificação (X)
            if (e.target.closest('.notification-remove')) {
                e.stopPropagation();
                e.preventDefault();
                const notificationItem = e.target.closest('.notification-item');
                if (notificationItem) {
                    const title = notificationItem.querySelector('.notification-title').textContent;
                    const details = notificationItem.querySelector('.notification-details').textContent;
                    const idx = notificacoes.findIndex(n => n.titulo === title && n.detalhes === details);
                    if (idx !== -1) {
                        const id = notificacoes[idx].id;
                        const token = localStorage.getItem('token');
                        await fetch(`/notificacoes/${id}`, {
                            method: 'DELETE',
                            headers: { 'Authorization': 'Bearer ' + token }
                        });
                        notificacoes.splice(idx, 1);
                        notificacoesVisiveis = Math.max(0, notificacoesVisiveis - 1);
                        renderNotificacoes(notificacoesVisiveis);
                    }
                }
            }

            // Marcar como lida ao clicar no link
            if (e.target.closest('.notification-link')) {
                e.preventDefault();
                const notificationItem = e.target.closest('.notification-item');
                if (notificationItem) {
                    const title = notificationItem.querySelector('.notification-title').textContent;
                    const details = notificationItem.querySelector('.notification-details').textContent;
                    const idx = notificacoes.findIndex(n => n.titulo === title && n.detalhes === details);
                    if (idx !== -1) {
                        const n = notificacoes[idx];
                        const link = getNotificacaoLink(n);
                        const token = localStorage.getItem('token');
                        // Marca como lida no backend antes de redirecionar
                        await fetch(`/notificacoes/${n.id}/lida`, {
                            method: 'PUT',
                            headers: { 'Authorization': 'Bearer ' + token }
                        });
                        if (link && link !== '#') {
                            window.location.href = link;
                        } else {
                            alert('Tipo de notificação desconhecido!');
                        }
                    }
                }
            }

            // Ver mais notificações
            if (e.target && e.target.id === 'verMaisBtn') {
                e.stopPropagation();
                e.preventDefault();
                notificacoesVisiveis = Math.min(notificacoesVisiveis + 3, notificacoes.length);
                renderNotificacoes(notificacoesVisiveis);
            }
        });
    }
});

// Carregar e renderizar notificações ao iniciar
document.addEventListener('DOMContentLoaded', async function () {
    notificacoes = await carregarNotificacoes();
    renderNotificacoes(notificacoesVisiveis);
});

// Perfil e botões dinâmicos
document.addEventListener('DOMContentLoaded', async function () {
    const tipoUsuario = localStorage.getItem('tipoUsuario');
    const token = localStorage.getItem('token');
    if (!tipoUsuario || !token) return;

    // Ajuste a URL conforme seu backend
    let urlPerfil = tipoUsuario === 'EMPRESA' ? '/empresa/perfil/verPerfil' : '/freelancer/perfil/verPerfil';

    try {
        const resp = await fetch(urlPerfil, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if (!resp.ok) throw new Error('Erro ao buscar perfil');
        const perfil = await resp.json();

        // Atualiza nome
        const nome = perfil.nome || perfil.nomeFantasia || 'Usuário';
        const nomeSpan = document.getElementById('navbarProfileName');
        if (nomeSpan) nomeSpan.textContent = nome;

        // Troca ícone pelo avatar, se houver
        const icon = document.querySelector('.dropdown-profile-header .bi-person-circle');
        let avatarUrl = perfil.avatar || '/assets/img/default-avatar.png';

        if (icon) {
            const img = document.createElement('img');
            img.src = avatarUrl;
            img.alt = 'Avatar';
            img.style.width = '2.2rem';
            img.style.height = '2.2rem';
            img.style.objectFit = 'cover';
            img.style.borderRadius = '50%';
            img.style.border = '3px solid #00294B';
            icon.replaceWith(img);
        }

        // Ajusta botões conforme tipo de usuário
        const btnEditar = document.querySelector('.dropdown-profile-header .profile-edit');
        const minhaConta = document.getElementById('minhaContaLink');
        if (btnEditar) {
            if (tipoUsuario === 'EMPRESA') {
                btnEditar.onclick = () => window.location.href = '/pagina-profile-empresa-editar';
                btnEditar.textContent = 'Editar perfil empresa';
                if (minhaConta) {
                    minhaConta.onclick = (e) => {
                        e.preventDefault();
                        window.location.href = '/pagina-profile-empresa';
                    };
                }
            } else {
                btnEditar.onclick = () => window.location.href = '/pagina-profile-editar';
                btnEditar.textContent = 'Editar perfil';
                if (minhaConta) {
                    minhaConta.onclick = (e) => {
                        e.preventDefault();
                        window.location.href = '/pagina-profile';
                    };
                }
            }
        }
    } catch (e) {
        // Se der erro, mantém padrão
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const tipoUsuario = localStorage.getItem('tipoUsuario');
    const projetoDropdownMenu = document.getElementById('projetoDropdownMenu');
    if (!projetoDropdownMenu) return;

    projetoDropdownMenu.innerHTML = ''; // Limpa antes

    if (tipoUsuario === 'EMPRESA') {
        // Empresa: Criar Oportunidade e Gerenciar Projetos
        projetoDropdownMenu.innerHTML = `
            <li><a class="dropdown-item" href="/publicar-vaga">Criar Oportunidade</a></li>
            <li><a class="dropdown-item" href="/gerenciar-projetos">Gerenciar Projetos</a></li>
        `;
    } else {
        // Freelancer ou visitante: Procurar Oportunidade e Gerenciar Projetos
        projetoDropdownMenu.innerHTML = `
            <li><a class="dropdown-item" href="/listagem-projetos-vagas">Procurar Oportunidade</a></li>
            <li><a class="dropdown-item" href="/gerenciar-projetos">Gerenciar Projetos</a></li>
        `;
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const tipoUsuario = localStorage.getItem('tipoUsuario');
    const buscarPerfisLink = document.getElementById('buscar-perfis-link');
    if (!buscarPerfisLink) return;

    if (tipoUsuario === 'EMPRESA') {
        buscarPerfisLink.setAttribute('href', '/listagem-freelancers');
    } else {
        buscarPerfisLink.setAttribute('href', '/listagem-empresas');
    }
});


// Seleciona o botão correto na navbar conforme a URL
document.addEventListener('DOMContentLoaded', function () {
    const path = window.location.pathname;
    const navLinks = document.querySelectorAll('#mainNav .navbar-nav .nav-link');
    let algumAtivo = false;

    navLinks.forEach(link => {
        // Remove qualquer active antigo
        link.classList.remove('active');
        // Marca como ativo se o href bate com o path
        if (link.getAttribute('href') === path) {
            link.classList.add('active');
            algumAtivo = true;
        }
    });
    
    // Se nenhum link bateu, nenhum fica ativo
    if (!algumAtivo) {
        navLinks.forEach(link => link.classList.remove('active'));
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const logoutLink = document.querySelector('.dropdown-item[href="/login"], .dropdown-item[href="login"], .dropdown-item[href="login.html"]');
    if (logoutLink) {
        logoutLink.addEventListener('click', function (e) {
            e.preventDefault();
            // Limpa localStorage
            localStorage.clear();
            // Limpa todos os cookies
            document.cookie.split(";").forEach(function(c) {
                document.cookie = c
                    .replace(/^ +/, "")
                    .replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/");
            });
            window.location.href = '/login';
        });
    }
});

const projetoDropdown = document.getElementById('projetoDropdown');
if (projetoDropdown) {
    projetoDropdown.addEventListener('show.bs.dropdown', function () {
        projetoDropdown.classList.add('active');
    });
    projetoDropdown.addEventListener('hide.bs.dropdown', function () {
        projetoDropdown.classList.remove('active');
    });
}

// Lista de títulos que levam para detalhes do projeto
const TITULOS_PROJETO = [
    'CERTIFICADO_DE_CONCLUSAO',
    'PROJETO_ENTREGUE',
    'PROJETO_FINALIZADO',
    'PROJETO_CANCELADO',
    'APROVACAO_DE_CANDIDATURA',
    'CANDIDATURA_APROVADA'
];

const TITULOS_VAGA = [
    'ALTERACAO_DE_PROJETO',
    'CRIACAO_DE_PROJETO',
    'CANDIDATURA_ENVIADA',
    'REJEICAO_DE_CANDIDATURA',
    'CONVITE_DE_EMPRESA'
];

// Função para decidir o link da notificação (NÃO chama alert aqui!)
function getNotificacaoLink(n) {
    const rawTitulo = n.tituloOriginal;
    const tipoUsuario = localStorage.getItem('tipoUsuario');
    if (rawTitulo === 'FLAG' || rawTitulo === 'FEEDBACK_RECEBIDO') {
        if (tipoUsuario === 'EMPRESA') return '/pagina-profile-empresa';
        if (tipoUsuario === 'FREELANCER') return '/pagina-profile';
        return '/pagina-profile';
    }
    if (TITULOS_PROJETO.includes(rawTitulo)) {
        if (n.projetoId) return `/andamento-projeto/${n.projetoId}`;
        return '#';
    }
    if (TITULOS_VAGA.includes(rawTitulo)) {
        if (n.projetoId) return `/detalhes-projeto/${n.projetoId}`;
        return '#';
    }
    if (rawTitulo === 'CANDIDATURA_RECEBIDA') {
        if (n.projetoId) return `/lista-candidatos/${n.projetoId}`;
        return '#';
    }
    // Se não for nenhum dos casos conhecidos, retorna '#'
    return '#';
}

// Função para formatar o tempo da notificação
function formatarTempo(dataIso) {
    const data = new Date(dataIso);
    const agora = new Date();
    const diffMs = agora - data;
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'agora';
    if (diffMin < 60) return `${diffMin} min`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `${diffH}h`;
    const diffD = Math.floor(diffH / 24);
    if (diffD < 7) return `${diffD} dia${diffD > 1 ? 's' : ''}`;
    return data.toLocaleDateString('pt-BR');
}

document.addEventListener('DOMContentLoaded', function () {
    const logoLink = document.getElementById('logoLink');
    if (logoLink) {
        logoLink.addEventListener('click', function (e) {
            e.preventDefault();
            const tipoUsuario = localStorage.getItem('tipoUsuario');
            const token = localStorage.getItem('token');
            if (token && (tipoUsuario === 'FREELANCER' || tipoUsuario === 'EMPRESA')) {
                window.location.href = '/dashboard';
            } else {
                window.location.href = '/';
            }
        });
    }
});