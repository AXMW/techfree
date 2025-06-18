const empresaProfileData = {
    avaliacao: 4.8, // valor fixo ou 0 se preferir
    flags: 1,       // valor fixo ou 0 se preferir
    feedbacks: [
        { texto: "Ótima empresa para projetos colaborativos, comunicação clara e pagamentos em dia." },
        { texto: "Equipe aberta a novas ideias e muito profissionalismo no acompanhamento dos projetos." },
        { texto: "Ambiente inovador e respeito com os freelancers. Recomendo!" }
    ]
};

async function buscarPerfilEmpresa() {
    const token = localStorage.getItem('token');
    try {
        const resp = await fetch('/empresa/perfil/verPerfil', {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
        if (!resp.ok) throw new Error('Erro ao buscar perfil da empresa');
        const data = await resp.json();

        const profile = {
            nome: data.nomeFantasia,
            areaAtuacao: data.areaAtuacao,
            avatar: data.avatar,
            emailContato: data.emailContato,
            telefone: data.telefone,
            site: data.site,
            linkedin: data.linkedin,
            descricao: data.bio,
            projetos: data.projetos,

            avaliacao: empresaProfileData.avaliacao,
            flags: empresaProfileData.flags,
            feedbacks: empresaProfileData.feedbacks
        };

        renderEmpresaProfile(profile);
        atualizarBarraProgressoEmpresa(profile);
        renderEmpresaFeedbacks(profile);
    } catch (e) {
        console.error(e);
    }
}

function renderEmpresaProfile(profile) {
    // Flags
    let flagsHtml = '';
    for (let i = 0; i < 3; i++) {
        flagsHtml += `
            <span class="flag-circle${i < (profile.flags || 0) ? ' filled' : ''}">
                <i class="bi bi-flag-fill" style="font-size:0.8em;${i < (profile.flags || 0) ? '' : 'opacity:0;'}"></i>
            </span>
        `;
    }

    // Avaliação (estrelas)
    let stars = '';
    let fullStars = Math.floor(profile.avaliacao || 0);
    let halfStar = (profile.avaliacao || 0) % 1 >= 0.5;
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

    // Contato
    let contatoHtml = `
        <div><i class="bi bi-envelope"></i><span>${profile.emailContato|| ""}</span></div>
        <div><i class="bi bi-telephone"></i><span>${profile.telefone || ""}</span></div>
    `;

    // Header
    document.querySelector('.profile-header').innerHTML = `
        <img src="${profile.avatar || 'assets/img/default-avatar.png'}" class="profile-avatar" alt="Logo da Empresa">
        <div class="profile-info flex-grow-1">
            <h2>${profile.nome|| ""}</h2>
            <div class="role mb-1">${profile.areaAtuacao || ""}</div>
            <div class="profile-contact mt-2">${contatoHtml|| ""}</div>
            <div class="profile-social mt-3">${redesHtml}</div>
            <div class="profile-rating mt-3">
                ${stars}
                <span class="ms-2" style="color:#fff;font-size:1rem;">${(profile.avaliacao || 0).toFixed(1)}/5.0</span>
            </div>
        </div>
        <div class="profile-flags-box d-flex flex-column align-items-center">
            <div class="d-flex align-items-center gap-2 mb-1">
                ${flagsHtml}
            </div>
            <span class="flags-text mt-1">
                ${(profile.flags || 0)}/3 flags
            </span>
        </div>
    `;

    const sobreEl = document.getElementById('empresaSobre');
    if (sobreEl) sobreEl.textContent = profile.descricao || '';
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

function calcularProgressoEmpresa(profile) {
    const campos = [
        { nome: "Logo", valor: profile.avatar },
        { nome: "Nome Fantasia", valor: profile.nome },
        { nome: 'Atuação', valor: profile.areaAtuacao },
        { nome: "E-mail de contato", valor: profile.emailContato },
        { nome: "Telefone", valor: profile.telefone },
        { nome: "LinkedIn", valor: profile.linkedin },
        { nome: "Site", valor: profile.site },
        { nome: "Sobre", valor: profile.descricao },
    ];
    const total = campos.length;
    const preenchidos = campos.filter(c => c.valor && String(c.valor).trim() !== "").length;
    const faltando = campos.filter(c => !c.valor || String(c.valor).trim() === "").map(c => c.nome);
    const porcentagem = Math.round((preenchidos / total) * 100);
    return { porcentagem, faltando };
}

function atualizarBarraProgressoEmpresa(profile) {
    const { porcentagem, faltando } = calcularProgressoEmpresa(profile);
    const bar = document.getElementById('empresaProfileProgressBar');
    const percent = document.getElementById('empresaProfileProgressPercent');
    const missing = document.getElementById('empresaProfileMissingFields');
    if(bar && percent) {
        bar.style.width = porcentagem + "%";
        bar.textContent = porcentagem + "%";
        percent.textContent = porcentagem + "%";
    }
    if(missing) {
        if(faltando.length === 0) {
            missing.innerHTML = `<li style="color:#28a745;">Tudo preenchido! 🎉</li>`;
        } else {
            missing.innerHTML = `<div class="mb-2" style="color:#fff;font-weight:600;margin-left:-2rem;">Itens ainda não preenchidos:</div>` +
                faltando.map(f => `<li>${f}</li>`).join('');
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    buscarPerfilEmpresa();
});