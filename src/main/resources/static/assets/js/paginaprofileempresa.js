const empresaProfileData = {
    avaliacao: 0.2, // valor fixo ou 0 se preferir
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
            telefoneContato: data.telefoneContato,
            site: data.site,
            linkedin: data.linkedin,
            descricao: data.bio,
            projetos: data.projetos,
            flags: data.quantidadeDeFlags,
            avaliacao: data.avaliacaoMedia || 0, // Use o valor fixo ou 0 se preferir
            feedbacks: data.feedbacks,
            assinaturaPath: data.assinaturaPath || ''
        };

        renderEmpresaProfile(profile);
        atualizarBarraProgressoEmpresa(profile);
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
        <div><i class="bi bi-telephone"></i><span>${profile.telefoneContato || ""}</span></div>
    `;

    // Avaliação média
    let avaliacaoHtml = '';
    if (profile.avaliacaoMedia) {
        let stars = '';
        let fullStars = Math.floor(profile.avaliacaoMedia);
        let halfStar = profile.avaliacaoMedia % 1 >= 0.5;
        for (let i = 0; i < fullStars; i++) stars += '<i class="bi bi-star-fill"></i>';
        if (halfStar) stars += '<i class="bi bi-star-half"></i>';
        while (stars.match(/star/g)?.length < 5) stars += '<i class="bi bi-star"></i>';
        avaliacaoHtml = `
            <div class="mb-2">
                <span class="fw-bold">Avaliação geral:</span>
                <span class="text-warning">${profile.avaliacaoMedia.toFixed(1)} ${stars}</span>
            </div>
        `;
    }

    // Avaliação no header
    const feedbackCount = (profile.feedbacks && profile.feedbacks.length) ? profile.feedbacks.length : 0;
    let media = profile.avaliacaoMedia !== undefined ? profile.avaliacaoMedia : (profile.avaliacao || 0);
    let starsHeader = '';
    let fullStarsHeader = Math.floor(media);
    let halfStarHeader = media % 1 >= 0.5;
    for (let i = 0; i < 5; i++) {
        if (i < fullStarsHeader) {
            starsHeader += '<i class="bi bi-star-fill"></i>';
        } else if (i === fullStarsHeader && halfStarHeader) {
            starsHeader += '<i class="bi bi-star-half"></i>';
        } else {
            starsHeader += '<i class="bi bi-star"></i>';
        }
    }

    // Header
    document.querySelector('.profile-header').innerHTML = `
        <img src="${profile.avatar || 'assets/img/default-avatar.png'}" class="profile-avatar" alt="Logo da Empresa" style="object-fit: cover;">
        <div class="profile-info flex-grow-1">
            <h2>${profile.nome|| ""}</h2>
            <div class="role mb-1">${profile.areaAtuacao || ""}</div>
            <div class="profile-contact mt-2">${contatoHtml|| ""}</div>
            <div class="profile-social mt-3">${redesHtml}</div>
            <div class="profile-rating mt-3">
                ${starsHeader}
                <span class="ms-2" style="color:#fff;font-size:1rem;">
                    ${media.toFixed(1)}/5.0
                    <span class="text-secondary ms-2">(${feedbackCount} feedback${feedbackCount === 1 ? '' : 's'})</span>
                </span>
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
        <div class="assinatura-status position-absolute" style="bottom: 10px; right: 20px; min-width: 120px; text-align: right;">
            <span style="font-weight:600;color:#fff;">Assinatura:</span>
            ${profile.assinaturaPath
                ? '<span class="text-success ms-1" title="Assinatura cadastrada"><i class="bi bi-check-circle-fill"></i></span>'
                : '<span class="text-danger ms-1" title="Assinatura não cadastrada"><i class="bi bi-x-circle-fill"></i></span>'
            }
        </div>
    `;

    // Sobre a Empresa
    const sobreEl = document.getElementById('empresaSobre');
    if (sobreEl) {
        sobreEl.innerHTML = profile.descricao && profile.descricao.trim()
            ? profile.descricao
            : '<p class="profile-timeline text-muted">Nenhuma informação sobre a empresa foi cadastrada ainda.</p>';
    }

    // Projetos Publicados
    const projetosEl = document.getElementById('empresaProjetos');
    if (projetosEl) {
        if (profile.projetos && profile.projetos.length > 0) {
            projetosEl.innerHTML = profile.projetos.map(p => `
                <div class="timeline-item mb-3">
                    <div class="timeline-title fw-bold">${p.nome || p.titulo || ''}</div>
                    <div class="timeline-period">${p.data || ''}</div>
                    <div class="timeline-item-desc">${p.descricao || ''}</div>
                </div>
            `).join('');
        } else {
            projetosEl.innerHTML = '<p class="text-muted">Nenhum projeto publicado ainda.</p>';
        }
    }

    // Feedbacks de Freelancers
    const feedbacksEl = document.getElementById('empresaProfileFeedbacks');
    if (feedbacksEl) {
        const feedbacks = (profile.feedbacks || []).slice().reverse().slice(0, 3);
        let feedbacksHtml = '';
        feedbacksHtml = feedbacks.length > 0
            ? feedbacks.map(fb => {
                // Se o backend trouxer mais campos, ajuste aqui
                let nota = typeof fb.nota === 'number' ? fb.nota : 0;
                let data = fb.dataCriacao ? new Date(fb.dataCriacao).toLocaleDateString('pt-BR') : '';
                let comentario = fb.comentario || fb.texto || '';
                let nomeFreelancer = fb.nomeFreelancer || '-';
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
                        <div><strong>Freelancer:</strong> ${nomeFreelancer}</div>
                        <div><strong>Projeto:</strong> ${tituloProjeto}</div>
                        <div><strong>Nota:</strong> ${nota.toFixed(1)} ${stars}</div>
                        <div><strong>Comentário:</strong> "${comentario}"</div>
                    </div>
                `;
            }).join('')
            : '<p class="profile-timeline text-muted">Nenhum feedback recebido ainda.</p>';

        // Botão "Ver todos" se houver pelo menos 1 feedback
        let verTodosBtn = '';
        if ((profile.feedbacks || []).length > 0) {
            verTodosBtn = `
                <div class="d-flex justify-content-center">
                    <button class="btn btn-outline-warning btn-sm" id="btnVerTodosFeedbacksEmpresa">
                        <i class="bi bi-list-stars"></i> Ver todos
                    </button>
                </div>
            `;
        }

        feedbacksEl.innerHTML = feedbacksHtml + verTodosBtn;

        // Modal para todos os feedbacks (adicione só uma vez)
        if (!document.getElementById('modalTodosFeedbacksEmpresa')) {
            const modalHtml = `
            <div class="modal fade" id="modalTodosFeedbacksEmpresa" tabindex="-1" aria-labelledby="modalTodosFeedbacksEmpresaLabel" aria-hidden="true">
              <div class="modal-dialog modal-lg modal-dialog-scrollable">
                <div class="modal-content bg-dark text-light">
                  <div class="modal-header">
                    <h5 class="modal-title" id="modalTodosFeedbacksEmpresaLabel">Todos os Feedbacks</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Fechar"></button>
                  </div>
                  <div class="modal-body" id="modalTodosFeedbacksEmpresaBody"></div>
                </div>
              </div>
            </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHtml);
        }

        // Evento do botão "Ver todos"
        const btnVerTodos = document.getElementById('btnVerTodosFeedbacksEmpresa');
        if (btnVerTodos) {
            btnVerTodos.onclick = function () {
                const allFeedbacks = (profile.feedbacks || [])
                    .slice()
                    .reverse()
                    .map(fb => {
                        let nota = typeof fb.nota === 'number' ? fb.nota : 0;
                        let data = fb.dataCriacao ? new Date(fb.dataCriacao).toLocaleDateString('pt-BR') : '';
                        let comentario = fb.comentario || fb.texto || '';
                        let nomeFreelancer = fb.nomeFreelancer || '-';
                        let tituloProjeto = fb.tituloProjeto || '';
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
                                <div><strong>Freelancer:</strong> ${nomeFreelancer}</div>
                                <div><strong>Projeto:</strong> ${tituloProjeto}</div>
                                <div><strong>Nota:</strong> ${nota.toFixed(1)} ${stars}</div>
                                <div><strong>Comentário:</strong> "${comentario}"</div>
                            </div>
                        `;
                    }).join('');
                document.getElementById('modalTodosFeedbacksEmpresaBody').innerHTML = allFeedbacks || '<p class="text-muted">Nenhum feedback recebido ainda.</p>';
                const modal = new bootstrap.Modal(document.getElementById('modalTodosFeedbacksEmpresa'));
                modal.show();
            };
        }
    }
}

function calcularProgressoEmpresa(profile) {
    const campos = [
        { nome: 'Nome da Empresa', valor: profile.nome },
        { nome: 'Atuação', valor: profile.areaAtuacao },
        { nome: 'Avatar', valor: profile.avatar },
        { nome: 'E-mail de contato', valor: profile.emailContato },
        { nome: 'Telefone de contato', valor: profile.telefoneContato },
        { nome: 'LinkedIn', valor: profile.linkedin },
        { nome: 'Site', valor: profile.site },
        { nome: 'Sobre', valor: profile.descricao },
        { nome: 'Assinatura', valor: profile.assinaturaPath }
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