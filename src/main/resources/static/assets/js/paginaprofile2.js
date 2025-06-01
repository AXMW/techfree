const profileData = {
    nome: "Lucas Silva",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    cargo: "Desenvolvedor Full Stack",
    contato: {
        email: "lucas@email.com",
        whatsapp: "(11) 99999-9999"
    },
    redes: [
        { icon: "bi-github", link: "#" },
        { icon: "bi-linkedin", link: "#" },
        { icon: "bi-globe", link: "#" }
    ],
    avaliacao: 4.7,
    habilidades: ["React", "Node.js", "MongoDB", "JavaScript", "TypeScript", "Express", "Docker", "Figma", "Scrum", "Inglês Avançado"],
    certificados: [
        "AWS Certified Developer",
        "Scrum Foundation",
        "Inglês Avançado"
    ],
    sobre: "Sou um desenvolvedor apaixonado por tecnologia, com experiência em projetos web e mobile. Gosto de trabalhar em equipe, aprender novas ferramentas e entregar soluções inovadoras. Busco sempre evoluir e contribuir para o sucesso dos projetos em que participo.",
    experiencia: [
        {
            empresa: "TechFree",
            cargo: "Desenvolvedor Full Stack",
            tempo: "2024-2025",
            descricao: "Desenvolvimento full stack, integração de APIs e liderança técnica."
        },
        {
            empresa: "MindCare",
            cargo: "Desenvolvedor Mobile",
            tempo: "2023-2024",
            descricao: "Desenvolvimento mobile com Flutter, gamificação e notificações."
        },
        {
            empresa: "LogiTech",
            cargo: "Desenvolvedor Frontend",
            tempo: "2022-2023",
            descricao: "Criação de dashboards, relatórios e integração mobile."
        }
    ],
    experienciaAcademica: [
        {
            instituicao: "FATEC Carapicuíba",
            curso: "Análise e Desenvolvimento de Sistemas",
            periodo: "2022-2025",
            descricao: "Graduação focada em desenvolvimento de software, banco de dados e projetos práticos."
        },
        {
            instituicao: "ETEC São Paulo",
            curso: "Técnico em Informática",
            periodo: "2020-2021",
            descricao: "Curso técnico com ênfase em lógica de programação, redes e suporte."
        }
    ],
    feedbacks: [
        {
            empresa: "MindCare",
            texto: "Excelente profissional, entregou antes do prazo e com ótima qualidade!"
        },
        {
            empresa: "LogiTech",
            texto: "Ótima comunicação e domínio técnico. Recomendo para projetos complexos."
        },
        {
            empresa: "TechFree",
            texto: "Sempre disposto a ajudar e propor soluções inovadoras. Trabalho impecável!"
        },
        {
            empresa: "OutraEmpresa",
            texto: "Profissional dedicado e muito competente."
        }
    ]
};

function renderProfile(profile) {
    // Certificados
    let certificadosHtml = profile.certificados.map(cert => `<span class="badge">${cert}</span>`).join('');

    // Habilidades (mostra só as principais no header, o resto na seção)
    let headerSkills = profile.habilidades.slice(0, 3).map(h => `<span class="badge">${h}</span>`).join('');
    let allSkills = profile.habilidades.map(h => `<span class="badge">${h}</span>`).join('');

    // Redes sociais
    let redesHtml = profile.redes.map(r => `<a href="${r.link}" target="_blank" rel="noopener noreferrer"><i class="bi ${r.icon}"></i></a>`).join('');

    // Avaliação
    let stars = '';
    let fullStars = Math.floor(profile.avaliacao);
    let halfStar = profile.avaliacao % 1 >= 0.5;
    for (let i = 0; i < fullStars; i++) stars += '<i class="bi bi-star-fill"></i>';
    if (halfStar) stars += '<i class="bi bi-star-half"></i>';
    while (stars.match(/star/g)?.length < 5) stars += '<i class="bi bi-star"></i>';

    // Experiência Profissional
    let experienciaHtml = profile.experiencia.map(exp => `
        <div class="timeline-item">
            <div class="timeline-title">${exp.empresa}</div>
            <div class="timeline-period">${exp.cargo} (${exp.tempo})</div>
            <div>${exp.descricao}</div>
        </div>
    `).join('');

    // Experiência Acadêmica
    let experienciaAcademicaHtml = (profile.experienciaAcademica || []).map(exp => `
        <div class="timeline-item">
            <div class="timeline-title">${exp.instituicao}</div>
            <div class="timeline-period">${exp.curso} (${exp.periodo})</div>
            <div>${exp.descricao}</div>
        </div>
    `).join('');

    // Feedbacks (apenas os 3 primeiros)
    let feedbacksHtml = profile.feedbacks.slice(0, 3).map(fb => `
        <div class="profile-feedback">
            <strong>Empresa: ${fb.empresa}</strong><br>
            "${fb.texto}"
        </div>
    `).join('');

    // Monta o HTML (sem email, telefone e sem flags)
    document.querySelector('.profile-header').innerHTML = `
        <img src="${profile.avatar}" class="profile-avatar" alt="Avatar do Usuário">
        <div class="profile-info flex-grow-1">
            <h2>${profile.nome}</h2>
            <div class="role mb-1">${profile.cargo}</div>
            <div class="profile-badges mb-2">${headerSkills}</div>
            <div class="profile-social mt-3">${redesHtml}</div>
            <div class="profile-rating mt-3">
                ${stars}
                <span class="ms-2" style="color:#fff;font-size:1rem;">${profile.avaliacao.toFixed(1)}/5.0</span>
            </div>
        </div>
    `;

    // Sobre
    document.getElementById('profileSobre').innerHTML = profile.sobre;

    // Habilidades
    document.getElementById('profileSkills').innerHTML = allSkills;

    // Experiência
    document.getElementById('profileExperiencia').innerHTML = experienciaHtml;

    // Experiência Acadêmica
    document.getElementById('profileExperienciaAcademica').innerHTML = experienciaAcademicaHtml;

    // Certificados
    document.getElementById('profileCertificados').innerHTML = certificadosHtml;

    // Feedbacks
    document.getElementById('profileFeedbacks').innerHTML = feedbacksHtml;

    // Atualiza o título da página
    document.title = `${profile.nome} - TechFree`;
    const titleTag = document.getElementById('profileTitle');
    if (titleTag) titleTag.textContent = `${profile.nome} - TechFree`;
}

document.addEventListener('DOMContentLoaded', function () {
    renderProfile(profileData);
});