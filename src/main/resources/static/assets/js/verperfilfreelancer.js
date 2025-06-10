const freelancerId = document.body.getAttribute('data-freelancer-id');

// Feedbacks e avaliação ainda não existem no backend, então mantemos fixos:
const feedbacksFixos = [
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
];
const avaliacaoFixa = 4.7;

async function carregarPerfilFreelancer() {
    try {
        const resp = await fetch(`/freelancer/perfil/${freelancerId}`);
        if (!resp.ok) throw new Error('Erro ao buscar perfil do freelancer');
        const data = await resp.json();

        // Monta o objeto de perfil para o renderizador
        const profile = {
            ...data,
            cargo: data.areaAtuacao,
            sobre: data.bio,
            experiencia: data.experiencia || [],
            experienciaAcademica: data.experienciaAcademica || [],
            feedbacks: feedbacksFixos,
            avaliacao: avaliacaoFixa
        };

        renderProfile(profile);
    } catch (e) {
        alert('Erro ao carregar perfil do freelancer');
        console.error(e);
    }
}

function renderProfile(profile) {
    // Certificados
    let certificadosHtml = (profile.certificados || []).map(cert => `<span class="badge">${cert}</span>`).join('');

    // Habilidades (mostra só as principais no header, o resto na seção)
    let headerSkills = (profile.habilidades || []).slice(0, 3).map(h => `<span class="badge">${h}</span>`).join('');
    let allSkills = (profile.habilidades || []).map(h => `<span class="badge">${h}</span>`).join('');

    // Redes sociais (usando os campos individuais)
    let redesHtml = '';
    if (profile.github) {
        redesHtml += `<a href="${profile.github}" target="_blank" rel="noopener noreferrer"><i class="bi bi-github"></i></a>`;
    }
    if (profile.linkedin) {
        redesHtml += `<a href="${profile.linkedin}" target="_blank" rel="noopener noreferrer"><i class="bi bi-linkedin"></i></a>`;
    }
    if (profile.portfolio) {
        redesHtml += `<a href="${profile.portfolio}" target="_blank" rel="noopener noreferrer"><i class="bi bi-globe"></i></a>`;
    }

    // Avaliação
    let stars = '';
    let fullStars = Math.floor(profile.avaliacao);
    let halfStar = profile.avaliacao % 1 >= 0.5;
    for (let i = 0; i < fullStars; i++) stars += '<i class="bi bi-star-fill"></i>';
    if (halfStar) stars += '<i class="bi bi-star-half"></i>';
    while (stars.match(/star/g)?.length < 5) stars += '<i class="bi bi-star"></i>';

    // Experiência Profissional
    let experienciaHtml = (profile.experiencia || []).map(exp => `
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
    let feedbacksHtml = (profile.feedbacks || []).slice(0, 3).map(fb => `
        <div class="profile-feedback">
            <strong>Empresa: ${fb.empresa}</strong><br>
            "${fb.texto}"
        </div>
    `).join('');

    // Monta o HTML (sem email, telefone e sem flags)
    document.querySelector('.profile-header').innerHTML = `
        <img src="${profile.avatar || '/assets/img/default-avatar.png'}" class="profile-avatar" alt="Avatar do Usuário">
        <div class="profile-info flex-grow-1">
            <h2>${profile.nome}</h2>
            <div class="role mb-1">${profile.cargo || ''}</div>
            <div class="profile-badges mb-2">${headerSkills}</div>
            <div class="profile-social mt-3">${redesHtml}</div>
            <div class="profile-rating mt-3">
                ${stars}
                <span class="ms-2" style="color:#fff;font-size:1rem;">${profile.avaliacao.toFixed(1)}/5.0</span>
            </div>
        </div>
    `;

    // Sobre
    document.getElementById('profileSobre').innerHTML = profile.sobre || '';

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
    carregarPerfilFreelancer();
});
