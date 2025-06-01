const empresaProfileData = {
    nome: "TechFree",
    avatar: "assets/img/Captura_de_tela_2025-05-16_211248-removebg-preview.png",
    cargo: "Plataforma de Gestão de Projetos",
    contato: {
        email: "contato@techfree.com",
        telefone: "(11) 12345-6789"
    },
    redes: [
        { icon: "bi-linkedin", link: "#" },
        { icon: "bi-globe", link: "#" }
    ],
    flags: 1,
    sobre: "A TechFree conecta empresas, estudantes e instituições para realização de projetos reais, promovendo inovação e desenvolvimento de talentos.",
    projetos: [
        {
            titulo: "Plataforma de Gestão de Projetos Integrados",
            periodo: "2024-2025",
            descricao: "Projeto para conectar empresas e estudantes em desafios reais."
        },
        {
            titulo: "App de Saúde Mental",
            periodo: "2023-2024",
            descricao: "Aplicativo focado em bem-estar e acompanhamento psicológico."
        }
    ],
    feedbacks: [
        {
            texto: "Ótima empresa para projetos colaborativos, comunicação clara e pagamentos em dia."
        },
        {
            texto: "Equipe aberta a novas ideias e muito profissionalismo no acompanhamento dos projetos."
        },
        {
            texto: "Ambiente inovador e respeito com os freelancers. Recomendo!"
        },
        {
            texto: "Processos bem definidos e feedbacks constantes durante o projeto."
        },
        {
            texto: "Pagamento sempre em dia e abertura para sugestões técnicas."
        }
    ]
};

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

    // Header
    document.querySelector('.profile-header').innerHTML = `
        <img src="${profile.avatar}" class="profile-avatar" alt="Logo da Empresa">
        <div class="profile-info flex-grow-1">
            <h2>${profile.nome}</h2>
            <div class="role mb-1">${profile.cargo}</div>
            <div class="profile-contact mt-2">
                <div><i class="bi bi-envelope"></i><span>${profile.contato.email}</span></div>
                <div><i class="bi bi-telephone"></i><span>${profile.contato.telefone}</span></div>
            </div>
            <div class="profile-social mt-3">
                ${profile.redes.map(r => `<a href="${r.link}" target="_blank" rel="noopener noreferrer"><i class="bi ${r.icon}"></i></a>`).join('')}
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
        { nome: "Nome", valor: profile.nome },
        { nome: "Descrição", valor: profile.sobre },
        { nome: "E-mail", valor: profile.contato.email },
        { nome: "Telefone", valor: profile.contato.telefone },
        { nome: "LinkedIn", valor: (profile.redes && profile.redes[0]?.link) ? profile.redes[0].link : "" },
        { nome: "Site", valor: (profile.redes && profile.redes[1]?.link) ? profile.redes[1].link : "" },
        { nome: "Projetos Publicados", valor: (profile.projetos && profile.projetos.length > 0) ? "ok" : "" }
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
    renderEmpresaProfile(empresaProfileData);
    atualizarBarraProgressoEmpresa(empresaProfileData);
    renderEmpresaFeedbacks(empresaProfileData);
});