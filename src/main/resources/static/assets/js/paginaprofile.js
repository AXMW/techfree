const profileData = {
    avaliacao: 4.7,
    flags: 3,
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

async function buscarPerfilFreelancer() {
    const token = localStorage.getItem('token');
    try {
        const resp = await fetch('/freelancer/perfil/verPerfil', {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
        if (!resp.ok) throw new Error('Erro ao buscar perfil');
        const data = await resp.json();

        renderProfile({
            ...data,
            avaliacao: profileData.avaliacao,
            flags: profileData.flags,
            feedbacks: profileData.feedbacks
        });
        atualizarBarraProgresso({
            ...data,
            avaliacao: profileData.avaliacao,
            flags: profileData.flags,
            feedbacks: profileData.feedbacks
        });
    } catch (e) {
        console.error(e);
    }
}

function renderProfile(profile) {
    // Flags
    let flagsHtml = '';
    for (let i = 0; i < 3; i++) {
        flagsHtml += `
            <span class="flag-circle${i < profile.flags ? ' filled' : ''}">
                <i class="bi bi-flag-fill" style="font-size:0.8em;${i < profile.flags ? '' : 'opacity:0;'}"></i>
            </span>
        `;
    }

    // Certificados
    let certificadosHtml = (profile.certificados || []).map(cert => `<span class="badge">${cert}</span>`).join('');

    // Habilidades
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

    // Contato
    let contatoHtml = `
        <div><i class="bi bi-envelope"></i><span>${profile.emailContato || ""}</span></div>
        <div><i class="bi bi-whatsapp"></i><span>${profile.telefone || ""}</span></div>
    `;

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

    // Monta o HTML
    document.querySelector('.profile-header').innerHTML = `
        <img src="${profile.avatar || 'assets/img/default-avatar.png'}" class="profile-avatar" alt="Avatar do Usuário">
        <div class="profile-info flex-grow-1">
            <h2>${profile.nome}</h2>
            <div class="role mb-1">${profile.areaAtuacao || ""}</div>
            <div class="profile-badges mb-2">${headerSkills}</div>
            <div class="profile-contact mt-2">${contatoHtml}</div>
            <div class="profile-social mt-3">${redesHtml}</div>
            <div class="profile-rating mt-3">
                ${stars}
                <span class="ms-2" style="color:#fff;font-size:1rem;">${profile.avaliacao.toFixed(1)}/5.0</span>
            </div>
        </div>
        <div class="profile-flags-box d-flex flex-column align-items-center" style="position: absolute; top: 1.5rem; right: 2rem;">
            <div class="d-flex align-items-center gap-2 mb-1">
                ${flagsHtml}
            </div>
            <span class="flags-text mt-1" style="color:#fff; font-size:0.97rem;">
                ${profile.flags}/3 flags
            </span>
        </div>
    `;

    // Sobre
    document.getElementById('profileSobre').innerHTML = profile.bio || "";

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
}

function calcularProgressoPerfil(profile) {
    const campos = [
        { nome: "Foto", valor: profile.avatar },
        { nome: "Nome", valor: profile.nome },
        { nome: "Cargo", valor: profile.areaAtuacao },
        { nome: "E-mail de contato", valor: profile.emailContato },
        { nome: "Telefone/WhatsApp", valor: profile.telefone },
        { nome: "Sobre", valor: profile.bio },
        { nome: "Habilidades", valor: (profile.habilidades && profile.habilidades.length > 0) ? "ok" : "" },
        { nome: "Certificados", valor: (profile.certificados && profile.certificados.length > 0) ? "ok" : "" },
        { nome: "Experiência Profissional", valor: (profile.experiencia && profile.experiencia.length > 0) ? "ok" : "" },
        { nome: "Experiência Acadêmica", valor: (profile.experienciaAcademica && profile.experienciaAcademica.length > 0) ? "ok" : "" }
    ];
    const total = campos.length;
    const preenchidos = campos.filter(c => c.valor && String(c.valor).trim() !== "").length;
    const faltando = campos.filter(c => !c.valor || String(c.valor).trim() === "").map(c => c.nome);
    const porcentagem = Math.round((preenchidos / total) * 100);
    return { porcentagem, faltando };
}

function atualizarBarraProgresso(profile) {
    const { porcentagem, faltando } = calcularProgressoPerfil(profile);
    const bar = document.getElementById('profileProgressBar');
    const percent = document.getElementById('profileProgressPercent');
    const missing = document.getElementById('profileMissingFields');
    if (bar && percent) {
        bar.style.width = porcentagem + "%";
        bar.textContent = porcentagem + "%";
        percent.textContent = porcentagem + "%";
    }
    if (missing) {
        if (faltando.length === 0) {
            missing.innerHTML = `<li style="color:#28a745;">Tudo preenchido! 🎉</li>`;
        } else {
            missing.innerHTML = `<div class="mb-2" style="color:#fff;font-weight:600;margin-left:-2rem;">Itens ainda não preenchidos:</div>` +
                faltando.map(f => `<li>${f}</li>`).join('');
        }
    }
}

// Chame ao carregar o perfil:
document.addEventListener('DOMContentLoaded', function () {
    buscarPerfilFreelancer();
});