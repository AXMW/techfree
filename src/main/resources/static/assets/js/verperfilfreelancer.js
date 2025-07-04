const freelancerId = document.body.getAttribute('data-freelancer-id');

// Mocks para avaliação e feedbacks, caso o backend ainda não retorne:
const avaliacaoFixa = 4.7;
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
            feedbacks: data.feedbacks || [],
            avaliacao: data.avaliacaoMedia || 0
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

    // Feedbacks (apenas os 3 últimos enviados)
    let feedbacksHtml = (profile.feedbacks || [])
        .slice()
        .reverse()
        .slice(0, 3)
        .map(fb => {
            let nota = typeof fb.nota === 'number' ? fb.nota : 0;
            let data = fb.dataCriacao ? new Date(fb.dataCriacao).toLocaleDateString('pt-BR') : '';
            let comentario = fb.comentario || fb.texto || '';
            let nomeEmpresa = fb.nomeEmpresa || fb.empresa || '-';
            let tituloProjeto = fb.tituloProjeto || '';
            // Estrelas amarelas e menores
            let stars = '';
            let fullStars = Math.floor(nota);
            let halfStar = nota % 1 >= 0.5;
            for (let i = 0; i < 5; i++) {
                if (i < fullStars) {
                    stars += '<i class="bi bi-star-fill" style="color:#FFD700;font-size:0.8em;vertical-align:middle;"></i>';
                } else if (i === fullStars && halfStar) {
                    stars += '<i class="bi bi-star-half" style="color:#FFD700;font-size:0.8em;vertical-align:middle;"></i>';
                } else {
                    stars += '<i class="bi bi-star" style="color:#FFD700;font-size:0.8em;vertical-align:middle;"></i>';
                }
            }
            return `
                <div class="profile-feedback mb-3">
                    <div><strong>Data:</strong> ${data}</div>
                    <div><strong>Empresa:</strong> ${nomeEmpresa}</div>
                    <div><strong>Projeto:</strong> ${tituloProjeto}</div>
                    <div><strong>Nota:</strong> ${nota.toFixed(1)} ${stars}</div>
                    <div><strong>Comentário:</strong> "${comentario}"</div>
                </div>
            `;
        }).join('');

    // Monta o HTML (sem email, telefone e sem flags)
    document.querySelector('.profile-header').innerHTML = `
        <img src="${profile.avatar || '/assets/img/default-avatar.png'}" class="profile-avatar" alt="Avatar do Usuário" style="object-fit: cover;">
        <div class="profile-info flex-grow-1">
            <h2>${profile.nome}</h2>
            <div class="role mb-1">${profile.cargo || ''}</div>
            <div class="profile-badges mb-2">${headerSkills}</div>
            <div class="profile-social mt-3">${redesHtml}</div>
            <div class="profile-rating mt-3">
                ${stars}
                <span class="ms-2" style="color:#fff;font-size:1rem;">
                    ${media.toFixed(1)}/5.0
                    <span class="text-secondary ms-2">(${feedbackCount} feedback${feedbackCount === 1 ? '' : 's'})</span>
                </span>
            </div>
        </div>
    `;

    // Sobre
    const sobreEl = document.getElementById('profileSobre');
    if (sobreEl) {
        sobreEl.innerHTML = profile.sobre && profile.sobre.trim()
            ? profile.sobre
            : '<p class="profile-timeline text-muted">Nenhuma informação sobre você foi cadastrada ainda.</p>';
    }

    // Habilidades
    const skillsEl = document.getElementById('profileSkills');
    if (skillsEl) {
        skillsEl.innerHTML = allSkills && allSkills.trim()
            ? allSkills
            : '<p class="profile-timeline text-muted">Nenhuma habilidade cadastrada ainda.</p>';
    }

    // Experiência Profissional
    const expEl = document.getElementById('profileExperiencia');
    if (expEl) {
        expEl.innerHTML = experienciaHtml && experienciaHtml.trim()
            ? experienciaHtml
            : '<p class="text-muted">Nenhuma experiência profissional cadastrada ainda.</p>';
    }

    // Experiência Acadêmica
    const expAcadEl = document.getElementById('profileExperienciaAcademica');
    if (expAcadEl) {
        expAcadEl.innerHTML = experienciaAcademicaHtml && experienciaAcademicaHtml.trim()
            ? experienciaAcademicaHtml
            : '<p class="text-muted">Nenhuma experiência acadêmica cadastrada ainda.</p>';
    }

    // Certificados
    const certsEl = document.getElementById('profileCertificados');
    if (certsEl) {
        certsEl.innerHTML = certificadosHtml && certificadosHtml.trim()
            ? certificadosHtml
            : '<p class="profile-timeline text-muted">Nenhum certificado cadastrado ainda.</p>';
    }

    // Feedbacks
    const feedbacksEl = document.getElementById('profileFeedbacks');
    if (feedbacksEl) {
        feedbacksEl.innerHTML = feedbacksHtml && feedbacksHtml.trim()
            ? feedbacksHtml
            : '<p class="profile-timeline text-muted">Nenhum feedback recebido ainda.</p>';
    }

    // Atualiza o título da página
    document.title = `${profile.nome} - TechFree`;
    const titleTag = document.getElementById('profileTitle');
    if (titleTag) titleTag.textContent = `${profile.nome} - TechFree`;
}

async function carregarProjetosAbertos() {
    try {
        const resp = await fetch('/projetos');
        if (!resp.ok) throw new Error('Erro ao buscar projetos');
        const projetos = await resp.json();
        // Filtra apenas projetos com status "ABERTO"
        return projetos.filter(p => p.status === 'ABERTO');
    } catch (e) {
        return [];
    }
}

function popularSelectProjetos(projetos) {
    const select = document.getElementById('selectProject');
    if (!select) return;
    // Limpa opções antigas, mantém o placeholder
    select.innerHTML = '<option selected disabled>Escolha uma opção</option>';
    projetos.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = p.titulo || p.nome || `Projeto ${p.id}`;
        select.appendChild(opt);
    });
}

async function enviarConviteProjeto() {
    const select = document.getElementById('selectProject');
    if (!select) return;
    const projetoId = select.value;
    if (!projetoId || projetoId === 'Escolha uma opção') {
        alert('Selecione um projeto para convidar!');
        return;
    }
    try {
        const resp = await fetch('/convites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ projetoId, freelancerId })
        });
        if (!resp.ok) throw new Error('Erro ao enviar convite');
        alert('Convite enviado com sucesso!');
    } catch (e) {
        alert('Erro ao enviar convite.');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    carregarPerfilFreelancer();
    carregarProjetosAbertos().then(popularSelectProjetos);
    const btn = document.querySelector('.invite-btn');
    if (btn) {
        btn.onclick = enviarConviteProjeto;
    }
});
