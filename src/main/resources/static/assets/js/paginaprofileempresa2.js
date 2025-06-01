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

// Preenche o header, sobre, projetos e feedbacks
function renderEmpresaProfile(profile) {
    // Header
    document.querySelector('.profile-header').innerHTML = `
        <img src="${profile.avatar}" class="profile-avatar" alt="Logo da Empresa">
        <div class="profile-info">
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
    `;

    // Sobre
    document.querySelector('.profile-section h4').nextElementSibling.innerHTML = profile.sobre;

    // Projetos
    const projetosHtml = profile.projetos.map(p => `
        <div class="timeline-item">
            <div class="timeline-title">${p.titulo}</div>
            <div class="timeline-period">${p.periodo}</div>
            <div>${p.descricao}</div>
        </div>
    `).join('');
    document.querySelectorAll('.profile-section')[1].querySelector('.profile-timeline').innerHTML = projetosHtml;

    // Feedbacks (apenas os 3 primeiros)
    const feedbacksHtml = profile.feedbacks.slice(0, 3).map(fb => `
        <div class="profile-feedback">
            "${fb.texto}"
        </div>
    `).join('');
    document.querySelectorAll('.profile-section')[2].innerHTML = `
        <h4>Feedbacks de Freelancers</h4>
        ${feedbacksHtml}
    `;

    // Atualiza o título da página
    document.title = `${profile.nome} - TechFree`;
    const titleTag = document.getElementById('profileTitle');
    if (titleTag) titleTag.textContent = `${profile.nome} - TechFree`;
}

// Função para renderizar apenas os 3 primeiros feedbacks do JSON
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
    renderEmpresaProfile(empresaProfileData);
    renderEmpresaFeedbacks(empresaProfileData);
});