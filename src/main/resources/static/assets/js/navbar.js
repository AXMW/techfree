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

// Exemplo de notificações em JSON
const notificacoes = [
    {
        titulo: "Novo comentário",
        detalhes: 'Projeto Z: "Gostei da sua ideia, podemos conversar?"',
        tempo: "5 min",
        unread: true,
        link: "/projetos/123"
    },
    {
        titulo: "Novo seguidor",
        detalhes: 'João Silva começou a seguir você.',
        tempo: "10 min",
        unread: true,
        link: "/perfil/joao-silva"
    },
    {
        titulo: "Nova mensagem no projeto X",
        detalhes: 'Projeto X: "Preciso de um desenvolvedor para app mobile..."',
        tempo: "2h",
        unread: true,
        link: "/mensagens"
    },
    {
        titulo: "Mensagem do suporte",
        detalhes: 'Seu chamado foi respondido pelo suporte técnico.',
        tempo: "3 horas",
        unread: false,
        link: "/suporte"
    },
    {
        titulo: "Atualização de proposta",
        detalhes: 'Sua proposta para o projeto "Dashboard" foi atualizada.',
        tempo: "8h",
        unread: false,
        link: "/propostas"
    },
    {
        titulo: "Seu perfil foi atualizado",
        detalhes: "As alterações no seu perfil foram salvas com sucesso.",
        tempo: "1 dia",
        unread: false,
        link: "/minha-conta.html"
    },
    {
        titulo: "Pagamento recebido",
        detalhes: 'Você recebeu um pagamento de R$ 500,00 pelo projeto "App Delivery".',
        tempo: "2 dias",
        unread: false,
        link: "/financeiro"
    },
    {
        titulo: "Prazo de entrega alterado",
        detalhes: 'O prazo do projeto "Landing Page" foi alterado para 30/06.',
        tempo: "2 dias",
        unread: false,
        link: "/projetos/landing-page"
    },
    {
        titulo: "Proposta recebida",
        detalhes: 'Projeto Y: "Temos interesse em sua proposta, confira os detalhes."',
        tempo: "3 dias",
        unread: false,
        link: "/propostas"
    },
    {
        titulo: "Projeto finalizado",
        detalhes: 'O projeto "Landing Page" foi marcado como concluído.',
        tempo: "4 dias",
        unread: false,
        link: "/projetos/landing-page"
    },
    {
        titulo: "Seu perfil foi atualizado",
        detalhes: "As alterações no seu perfil foram salvas com sucesso.",
        tempo: "1 dia",
        unread: false,
        link: "/minha-conta.html"
    },
    {
        titulo: "Avaliação recebida",
        detalhes: 'Você recebeu uma nova avaliação 5 estrelas no projeto "Site Portfólio".',
        tempo: "6 dias",
        unread: false,
        link: "/avaliacoes"
    },
    {
        titulo: "Convite para projeto",
        detalhes: 'Empresa ABC convidou você para participar do projeto "E-commerce".',
        tempo: "1 semana",
        unread: false,
        link: "/projetos/e-commerce"
    }
];

function criarNotificacaoLi(n, idx) {
    const li = document.createElement('li');
    li.innerHTML = `
        <a href="${n.link}" class="notification-link" style="text-decoration:none;display:block;">
            <div class="notification-item${n.unread ? ' unread' : ''}">
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
    const novas = notificacoes.filter(n => n.unread).length;
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

    // Delegação de eventos para remover notificação
    const notificacoesDropdown = document.getElementById('notificacoesDropdown');
    if (notificacoesDropdown) {
        notificacoesDropdown.addEventListener('click', function (e) {
            if (e.target.closest('.notification-remove')) {
                e.stopPropagation();
                e.preventDefault();
                const notificationItem = e.target.closest('.notification-item');
                if (notificationItem) {
                    const li = notificationItem.closest('li');
                    const title = notificationItem.querySelector('.notification-title').textContent;
                    const details = notificationItem.querySelector('.notification-details').textContent;
                    const idx = notificacoes.findIndex(n => n.titulo === title && n.detalhes === details);
                    if (idx !== -1) {
                        notificacoes.splice(idx, 1);
                        notificacoesVisiveis = Math.max(0, notificacoesVisiveis - 1);
                        renderNotificacoes(notificacoesVisiveis);
                    }
                }
            }
        });

        // Evento para ver mais notificações (+3 por clique)
        notificacoesDropdown.addEventListener('click', function (e) {
            if (e.target && e.target.id === 'verMaisBtn') {
                e.stopPropagation();
                notificacoesVisiveis = Math.min(notificacoesVisiveis + 3, notificacoes.length);
                renderNotificacoes(notificacoesVisiveis);
            }
        });
    }
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
        let avatarUrl = null;
        if (tipoUsuario === 'EMPRESA') {
            avatarUrl = perfil.logoUrl || '/assets/img/default-avatar.png';
        } else {
            avatarUrl = perfil.avatar || '/assets/img/default-avatar.png';
        }
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

document.addEventListener('DOMContentLoaded', function () {
    const tipoUsuario = localStorage.getItem('tipoUsuario');
    const projetoDropdownMenu = document.getElementById('projetoDropdownMenu');
    if (!projetoDropdownMenu) return;

    projetoDropdownMenu.innerHTML = ''; // Limpa antes

    if (tipoUsuario === 'EMPRESA') {
        // Empresa: Criar Vaga e Gerenciar Projetos
        projetoDropdownMenu.innerHTML = `
            <li><a class="dropdown-item" href="/publicar-vaga">Criar Vaga</a></li>
            <li><a class="dropdown-item" href="/gerenciar-projetos">Gerenciar Projetos</a></li>
        `;
    } else {
        // Freelancer ou visitante: Procurar Vaga e Gerenciar Projetos
        projetoDropdownMenu.innerHTML = `
            <li><a class="dropdown-item" href="/listagem-projetos-vagas">Procurar Vaga</a></li>
            <li><a class="dropdown-item" href="/gerenciar-projetos">Gerenciar Projetos</a></li>
        `;
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