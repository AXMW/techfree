const empresaId = document.body.getAttribute('data-empresa-id');

// Se o backend ainda não retorna avaliação e feedbacks, mantenha mocks:
const avaliacaoFixa = 4.8;
const feedbacksFixos = [
    { texto: "Ótima empresa para projetos colaborativos, comunicação clara e pagamentos em dia." },
    { texto: "Equipe aberta a novas ideias e muito profissionalismo no acompanhamento dos projetos." },
    { texto: "Ambiente inovador e respeito com os freelancers. Recomendo!" }
];

async function carregarPerfilEmpresa() {
    try {
        const resp = await fetch(`/empresa/perfil/${empresaId}`);
        if (!resp.ok) throw new Error('Erro ao buscar perfil da empresa');
        const data = await resp.json();

        // Mapeia os campos do backend para os usados no front
        const profile = {
            id: data.id,
            nome: data.nomeFantasia,
            cargo: data.areaAtuacao,
            emailContato: data.emailContato,
            site: data.site,
            linkedin: data.linkedin,
            telefoneContato: data.telefoneContato,
            sobre: data.bio,
            avatar: data.avatar,
            projetos: data.projetos || [],
            avaliacao: data.avaliacaoMedia || 0, // Use o valor fixo ou 0 se preferir
            feedbacks: data.feedbacks,
        };

        renderEmpresaProfile(profile);
        renderEmpresaProjetos(profile.projetos);
        renderEmpresaFeedbacks(profile);

        // Depois de carregar o profile:
        const link = document.getElementById('linkOportunidadesEmpresa');
        if (link && profile.nome) {
            // Codifica o nome para uso seguro na URL
            link.href = `/listagem-projetos-vagas?empresa=${encodeURIComponent(profile.nome)}`;
        }
    } catch (e) {
        alert('Erro ao carregar perfil da empresa');
        console.error(e);
    }
}

function renderEmpresaProfile(profile) {
    // Avaliação (sempre 5 estrelas)
    let stars = '';
    let media = profile.avaliacao || 0;
    let fullStars = Math.floor(media);
    let halfStar = media % 1 >= 0.5;
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars += '<i class="bi bi-star-fill"></i>';
        } else if (i === fullStars && halfStar) {
            stars += '<i class="bi bi-star-half"></i>';
        } else {
            stars += '<i class="bi bi-star"></i>';
        }
    }

    // Número de feedbacks
    const feedbackCount = (profile.feedbacks && profile.feedbacks.length) ? profile.feedbacks.length : 0;

    // Redes sociais (LinkedIn e Site)
    let redesHtml = '';
    if (profile.linkedin) {
        redesHtml += `<a href="${profile.linkedin}" target="_blank" rel="noopener noreferrer"><i class="bi bi-linkedin"></i></a>`;
    }
    if (profile.site) {
        redesHtml += `<a href="${profile.site}" target="_blank" rel="noopener noreferrer"><i class="bi bi-globe"></i></a>`;
    }

    // Header dinâmico igual ao padrão das outras páginas
    const header = document.querySelector('.profile-header');
    if (header) {
        header.classList.add('d-flex', 'align-items-center');
        header.innerHTML = `
            <img src="${profile.avatar || '/assets/img/default-avatar.png'}" class="profile-avatar" alt="Logo da Empresa" style="width: 120px; height: 120px; border-radius: 50%; object-fit: contain; border: 4px solid #FF6F00; background: #fff;">
            <div class="profile-info flex-grow-1">
                <h2>${profile.nome}</h2>
                <div class="role mb-1">${profile.cargo || ""}</div>
                <div class="profile-contact mt-2">
                    <div><i class="bi bi-envelope"></i><span>${profile.emailContato || ""}</span></div>
                    <div><i class="bi bi-telephone"></i><span>${profile.telefoneContato || ""}</span></div>
                </div>
                <div class="profile-social mt-3">
                    ${redesHtml}
                </div>
                <div class="profile-rating mt-3">
                    ${stars}
                    <span class="ms-2" style="color:#fff;font-size:1rem;">
                        ${media.toFixed(1)}/5.0
                        <span class="text-secondary ms-2">(${feedbackCount} feedback${feedbackCount === 1 ? '' : 's'})</span>
                    </span>
                </div>
            </div>
        `;
    }

    // Sobre
    const sobreEl = document.getElementById('empresaSobre');
    if (sobreEl) {
        sobreEl.innerHTML = profile.sobre && profile.sobre.trim()
            ? profile.sobre
            : '<p class="profile-timeline text-muted">Nenhuma informação sobre a empresa foi cadastrada ainda.</p>';
    }
}

function renderEmpresaProjetos(projetos) {
    const container = document.getElementById('empresaProjetos');
    if (!projetos || projetos.length === 0) {
        container.innerHTML = '<p class="text-muted">Nenhum projeto publicado ainda.</p>';
        return;
    }
    container.innerHTML = projetos.map(p => `
        <div class="timeline-item mb-3">
            <div class="timeline-title fw-bold">${p.nome || p.titulo || ''}</div>
            <div class="timeline-period">${p.data || ''}</div>
            <div class="timeline-item-desc">${p.descricao || ''}</div>
        </div>
    `).join('');
}

function renderEmpresaFeedbacks(profile) {
    const container = document.getElementById('empresaProfileFeedbacks');
    let feedbacksHtml = '';
    const feedbacks = (profile.feedbacks || []).slice().reverse().slice(0, 3);
    if (feedbacks.length === 0) {
        feedbacksHtml = '<p class="profile-timeline text-muted">Nenhum feedback recebido ainda.</p>';
    } else {
        feedbacksHtml = feedbacks.map(fb => `
            <div class="profile-feedback">
                "${fb.texto}"
            </div>
        `).join('');
    }
    if (container) container.innerHTML = feedbacksHtml;
}

document.addEventListener('DOMContentLoaded', function() {
    carregarPerfilEmpresa();
});