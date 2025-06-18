const empresaId = document.body.getAttribute('data-empresa-id');

// Avaliação e feedbacks ainda não existem no backend, então mantemos fixos:
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
            telefone: data.telefone,
            sobre: data.bio,
            avatar: data.avatar,
            avaliacao: avaliacaoFixa,
            feedbacks: feedbacksFixos
        };

        renderEmpresaProfile(profile);
        renderEmpresaFeedbacks(profile);
    } catch (e) {
        alert('Erro ao carregar perfil da empresa');
        console.error(e);
    }
}

function renderEmpresaProfile(profile) {
    // Avaliação (estrelas)
    let stars = '';
    let fullStars = Math.floor(profile.avaliacao);
    let halfStar = profile.avaliacao % 1 >= 0.5;
    for (let i = 0; i < fullStars; i++) stars += '<i class="bi bi-star-fill"></i>';
    if (halfStar) stars += '<i class="bi bi-star-half"></i>';
    while (stars.match(/star/g)?.length < 5) stars += '<i class="bi bi-star"></i>';

    // Redes sociais (LinkedIn e Site)
    let redesHtml = '';
    if (profile.linkedin) {
        redesHtml += `<a href="${profile.linkedin}" target="_blank" rel="noopener noreferrer"><i class="bi bi-linkedin"></i></a>`;
    }
    if (profile.site) {
        redesHtml += `<a href="${profile.site}" target="_blank" rel="noopener noreferrer"><i class="bi bi-globe"></i></a>`;
    }

    // Header
    document.querySelector('.profile-header').innerHTML = `
        <img src="${profile.avatar || '/assets/img/default-avatar.png'}" class="profile-avatar" alt="Logo da Empresa" style="width: 120px; height: 120px; border-radius: 50%; object-fit: contain; border: 4px solid #FF6F00; background: #fff;">
        <div class="profile-info">
            <h2>${profile.nome}</h2>
            <div class="role mb-1">${profile.cargo || ""}</div>
            <div class="profile-contact mt-2">
                <div><i class="bi bi-envelope"></i><span>${profile.emailContato}</span></div>
                <div><i class="bi bi-telephone"></i><span>${profile.telefone || ""}</span></div>
            </div>
            <div class="profile-social mt-3">
                ${redesHtml}
            </div>
            <div class="profile-rating mt-3">
                ${stars}
                <span class="ms-2" style="color:#fff;font-size:1rem;">${profile.avaliacao.toFixed(1)}/5.0</span>
            </div>
        </div>
    `;

    // Sobre
    document.querySelector('.profile-section h4').nextElementSibling.innerHTML = profile.sobre || '';
}

function renderEmpresaFeedbacks(profile) {
    const feedbacksHtml = (profile.feedbacks || []).slice(0, 3).map(fb => `
        <div class="profile-feedback">
            "${fb.texto}"
        </div>
    `).join('');
    const container = document.getElementById('empresaProfileFeedbacks');
    if (container) container.innerHTML = feedbacksHtml;
}

document.addEventListener('DOMContentLoaded', function() {
    carregarPerfilEmpresa();
});