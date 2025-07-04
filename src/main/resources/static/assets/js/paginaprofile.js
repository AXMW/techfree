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

        const profile = {
            id: data.id,
            nome: data.nome,
            bio: data.bio,
            avatar: data.avatar,
            emailContato: data.emailContato,
            telefoneContato: data.telefoneContato,
            areaAtuacao: data.areaAtuacao,
            github: data.github,
            linkedin: data.linkedin,
            portfolio: data.portfolio,
            habilidades: data.habilidades,
            certificados: data.certificados,
            experiencia: data.experiencia,
            experienciaAcademica: data.experienciaAcademica,
            flags: data.quantidadeDeFlags,
            
            avaliacao: data.avaliacaoMedia || 0, // Use o valor fixo ou 0 se preferir
            feedbacks: data.feedbacks || []
        };

        renderProfile(profile);
        atualizarBarraProgresso(profile);
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
        <div><i class="bi bi-whatsapp"></i><span>${profile.telefoneContato || ""}</span></div>
    `;

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

    // Descobre o tipo de perfil logado
    const tipoUsuario = (localStorage.getItem('tipoUsuario') || '').toLowerCase();

    // Feedbacks (apenas os 3 mais recentes)
    let feedbacksHtml = (profile.feedbacks || [])
        .slice()
        .reverse()
        .slice(0, 3)
        .map(fb => {
            let nome = tipoUsuario === 'freelancer' ? fb.nomeEmpresa : fb.nomeFreelancer;
            let tituloProjeto = fb.tituloProjeto || '';
            let nota = typeof fb.nota === 'number' ? fb.nota : 0;
            let data = fb.dataCriacao ? new Date(fb.dataCriacao).toLocaleDateString('pt-BR') : '';
            let comentario = fb.comentario || fb.texto || '';

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
                    <div><strong>${tipoUsuario === 'freelancer' ? 'Empresa' : 'Freelancer'}:</strong> ${nome || '-'}</div>
                    <div><strong>Projeto:</strong> ${tituloProjeto}</div>
                    <div><strong>Nota:</strong> ${nota.toFixed(1)} ${stars}</div>
                    <div><strong>Comentário:</strong> "${comentario}"</div>
                </div>
            `;
        }).join('');

    // Botão "Ver todos" se houver mais de 3 feedbacks
    let verTodosBtn = '';
    if ((profile.feedbacks || []).length > 0) {
        verTodosBtn = `
            <div class="d-flex justify-content-center">
                <button class="btn btn-outline-warning btn-sm" id="btnVerTodosFeedbacks">
                    <i class="bi bi-list-stars"></i> Ver todos
                </button>
            </div>
        `;
    }

    // Monta o HTML
    document.querySelector('.profile-header').innerHTML = `
        <img src="${profile.avatar || 'assets/img/default-avatar.png'}" class="profile-avatar" alt="Avatar do Usuário" style="object-fit: cover;">
        <div class="profile-info flex-grow-1">
            <h2>${profile.nome}</h2>
            <div class="role mb-1">${profile.areaAtuacao || ""}</div>
            <div class="profile-badges mb-2">${headerSkills}</div>
            <div class="profile-contact mt-2">${contatoHtml}</div>
            <div class="profile-social mt-3">${redesHtml}</div>
            <div class="profile-rating mt-3">
                ${stars}
                <span class="ms-2" style="color:#fff;font-size:1rem;">
                    ${media.toFixed(1)}/5.0
                    <span class="text-secondary ms-2">(${feedbackCount} feedback${feedbackCount === 1 ? '' : 's'})</span>
                </span>
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
    const sobreEl = document.getElementById('profileSobre');
    if (sobreEl) {
        sobreEl.innerHTML = profile.bio && profile.bio.trim()
            ? profile.bio
            : '<p  class="profile-timeline text-muted">Nenhuma informação sobre você foi cadastrada ainda.</p>';
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

    // Feedbacks Recentes
    const feedbacksEl = document.getElementById('profileFeedbacks');
    if (feedbacksEl) {
        feedbacksEl.innerHTML = (feedbacksHtml && feedbacksHtml.trim()
            ? feedbacksHtml
            : '<p class="profile-timeline text-muted">Nenhum feedback recebido ainda.</p>')
            + verTodosBtn;
    }

    // Modal para todos os feedbacks (adicione só uma vez)
    if (!document.getElementById('modalTodosFeedbacks')) {
        const modalHtml = `
        <div class="modal fade" id="modalTodosFeedbacks" tabindex="-1" aria-labelledby="modalTodosFeedbacksLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg modal-dialog-scrollable">
            <div class="modal-content bg-dark text-light">
              <div class="modal-header">
                <h5 class="modal-title" id="modalTodosFeedbacksLabel">Todos os Feedbacks</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Fechar"></button>
              </div>
              <div class="modal-body" id="modalTodosFeedbacksBody"></div>
            </div>
          </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    // Evento do botão "Ver todos"
    const btnVerTodos = document.getElementById('btnVerTodosFeedbacks');
    if (btnVerTodos) {
        btnVerTodos.onclick = function () {
            const allFeedbacks = (profile.feedbacks || [])
                .slice()
                .reverse()
                .map(fb => {
                    let nome = tipoUsuario === 'freelancer' ? fb.nomeEmpresa : fb.nomeFreelancer;
                    let tituloProjeto = fb.tituloProjeto || '';
                    let nota = typeof fb.nota === 'number' ? fb.nota : 0;
                    let data = fb.dataCriacao ? new Date(fb.dataCriacao).toLocaleDateString('pt-BR') : '';
                    let comentario = fb.comentario || fb.texto || '';
                    let stars = '';
                    let fullStars = Math.floor(nota);
                    let halfStar = nota % 1 >= 0.5;
                    for (let i = 0; i < 5; i++) {
                        if (i < fullStars) {
                            stars += '<i class="bi bi-star-fill" style="color:#FFD700;font-size:1.1em;vertical-align:middle;"></i>';
                        } else if (i === fullStars && halfStar) {
                            stars += '<i class="bi bi-star-half" style="color:#FFD700;font-size:1.1em;vertical-align:middle;"></i>';
                        } else {
                            stars += '<i class="bi bi-star" style="color:#FFD700;font-size:1.1em;vertical-align:middle;"></i>';
                        }
                    }
                    return `
                        <div class="profile-feedback mb-3 border-bottom pb-2">
                            <div><strong>Data:</strong> ${data}</div>
                            <div><strong>${tipoUsuario === 'freelancer' ? 'Empresa' : 'Freelancer'}:</strong> ${nome || '-'}</div>
                            <div><strong>Projeto:</strong> ${tituloProjeto}</div>
                            <div><strong>Nota:</strong> ${nota.toFixed(1)} ${stars}</div>
                            <div><strong>Comentário:</strong> "${comentario}"</div>
                        </div>
                    `;
                }).join('');
            document.getElementById('modalTodosFeedbacksBody').innerHTML = allFeedbacks || '<p class="text-muted">Nenhum feedback recebido ainda.</p>';
            const modal = new bootstrap.Modal(document.getElementById('modalTodosFeedbacks'));
            modal.show();
        };
    }
}

function calcularProgressoPerfil(profile) {
    const campos = [
        { nome: "Foto", valor: profile.avatar },
        { nome: "Nome", valor: profile.nome },
        { nome: "Cargo", valor: profile.areaAtuacao },
        { nome: "E-mail de contato", valor: profile.emailContato },
        { nome: "Telefone de contato", valor: profile.telefoneContato },
        { nome: "GitHub", valor: profile.github },
        { nome: "LinkedIn", valor: profile.linkedin },
        { nome: "Site", valor: profile.portfolio },
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