// Função de máscara para telefone
function aplicarMascaraTelefone(input) {
    input.addEventListener('input', function () {
        let v = input.value.replace(/\D/g, '');
        if (v.length > 11) v = v.slice(0, 11);
        if (v.length > 0) v = '(' + v;
        if (v.length > 3) v = v.slice(0, 3) + ') ' + v.slice(3);
        if (v.length > 10) v = v.slice(0, 10) + '-' + v.slice(10);
        else if (v.length > 6) v = v.slice(0, 9) + (v.length > 6 ? '-' + v.slice(9) : '');
        if (v.endsWith('-')) v = v.slice(0, -1);
        input.value = v;
    });
}

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
    ]
    // feedbacks removido
};

function renderEmpresaProfile(profile) {
    // Header
    document.querySelector('.profile-header').innerHTML = `
        <button class="btn btn-edit-icon edit-btn position-absolute top-0 end-0 m-2" data-edit="header" title="Editar"><i class="bi bi-pencil-square"></i></button>
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
    document.getElementById('empresaSobre').innerHTML = profile.sobre;

    // Projetos
    const projetosHtml = profile.projetos.map((p, idx) => `
        <div class="timeline-item" data-proj-idx="${idx}">
            <div class="timeline-title">${p.titulo}</div>
            <div class="timeline-period">${p.periodo}</div>
            <div>${p.descricao}</div>
        </div>
    `).join('');
    document.getElementById('empresaProjetos').innerHTML = projetosHtml;

    atualizarBarraProgressoEmpresa(profile);
}

document.addEventListener('DOMContentLoaded', function () {
    renderEmpresaProfile(empresaProfileData);

    // Popup helpers
    function getPopupElements() {
        return {
            overlay: document.getElementById('editOverlay'),
            popup: document.getElementById('editPopup'),
            closeBtn: document.getElementById('closeEditPopup'),
            title: document.getElementById('editPopupTitle'),
            fields: document.getElementById('editFormFields')
        };
    }

    // Preencher popup de edição
    function fillPopup(type) {
        const { title, fields } = getPopupElements();
        let html = '';
        switch (type) {
            case 'header':
                title.textContent = 'Editar Dados da Empresa';
                html = `
                    <div class="mb-3 text-center">
                        <img src="${empresaProfileData.avatar}" id="avatarPreview" class="rounded-circle mb-2" style="width:90px;height:90px;object-fit:contain;border:3px solid #FF6F00;background:#fff;">
                        <div>
                            <label class="form-label d-block">Logo</label>
                            <input type="file" class="form-control mb-2" id="avatarInput" accept="image/*">
                            <input type="hidden" id="avatarUrlInput" value="${empresaProfileData.avatar}">
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Nome da Empresa</label>
                        <input type="text" class="form-control" id="editNome" value="${empresaProfileData.nome}">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Descrição</label>
                        <input type="text" class="form-control" id="editCargo" value="${empresaProfileData.cargo}">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">E-mail</label>
                        <input type="text" class="form-control" id="editEmail" value="${empresaProfileData.contato.email}">
                        <div id="editEmailError" class="text-danger mt-1" style="font-size:0.98rem;"></div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Telefone</label>
                        <input type="text" class="form-control" id="editTelefone" value="${empresaProfileData.contato.telefone}">
                        <div id="editTelefoneError" class="text-danger mt-1" style="font-size:0.98rem;"></div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Redes Sociais</label>
                        <div class="mb-2">
                            <div class="input-group">
                                <span class="input-group-text"><i class="bi bi-linkedin"></i></span>
                                <input type="text" class="form-control" id="editLinkedin" placeholder="LinkedIn URL" value="${empresaProfileData.redes[0]?.link || ''}">
                            </div>
                            <div id="editLinkedinError" class="text-danger mt-1" style="font-size:0.98rem;"></div>
                        </div>
                        <div class="mb-2">
                            <div class="input-group">
                                <span class="input-group-text"><i class="bi bi-globe"></i></span>
                                <input type="text" class="form-control" id="editSite" placeholder="Site URL" value="${empresaProfileData.redes[1]?.link || ''}">
                            </div>
                            <div id="editSiteError" class="text-danger mt-1" style="font-size:0.98rem;"></div>
                        </div>
                    </div>
                `;
                break;
            case 'sobre':
                title.textContent = 'Editar Sobre';
                html = `
                    <div class="mb-3">
                        <label class="form-label">Sobre</label>
                        <textarea class="form-control" id="editSobre" rows="5">${empresaProfileData.sobre}</textarea>
                    </div>
                `;
                break;
            case 'projetos':
                title.textContent = 'Editar Projetos Publicados';
                html = empresaProfileData.projetos.map((proj, idx) => {
                    let [anoInicio, anoFim] = (proj.periodo || '').split('-');
                    const anoAtual = new Date().getFullYear();
                    return `
                    <div class="mb-3 border rounded p-2" id="proj-card-${idx}">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <div class="timeline-title" style="font-weight:700;color:#FF6F00;">${proj.titulo}</div>
                                <div class="timeline-period" style="font-size:0.95rem;color:#bdbdbd;">${proj.periodo}</div>
                                <div>${proj.descricao}</div>
                            </div>
                            <div class="d-flex align-items-center gap-1">
                                <button type="button" class="btn btn-edit-icon btn-proj-edit" data-idx="${idx}" title="Editar"><i class="bi bi-pencil-square"></i></button>
                                <button type="button" class="btn btn-edit-icon btn-proj-remove" data-idx="${idx}" title="Excluir"><i class="bi bi-trash"></i></button>
                            </div>
                        </div>
                        <div class="proj-edit-fields mt-3" style="display:none;">
                            <label class="form-label">Título</label>
                            <input type="text" class="form-control mb-1" value="${proj.titulo}">
                            <label class="form-label">Período</label>
                            <div class="d-flex gap-2 align-items-center mb-1 flex-wrap">
                                <input type="number" class="form-control" style="max-width:100px;" min="1900" max="${anoAtual}" placeholder="Ano início" value="${anoInicio || ''}">
                                <span style="color:#fff;">até</span>
                                <input type="number" class="form-control" style="max-width:100px;" min="1900" max="${anoAtual}" placeholder="Ano fim" value="${anoFim || ''}">
                            </div>
                            <label class="form-label">Descrição</label>
                            <textarea class="form-control" rows="2">${proj.descricao}</textarea>
                            <div class="text-danger mt-1 proj-edit-error" style="font-size:0.98rem; display:none;"></div>
                            <button type="button" class="btn btn-success mt-2 btn-proj-save" data-idx="${idx}" style="min-width:120px;"><i class="bi bi-check"></i> Salvar</button>
                        </div>
                    </div>
                    `;
                }).join('');
                html += `
                <div id="proj-add-card" style="display:none;">
                    <div class="mb-3 border rounded p-3 bg-dark">
                        <div class="fw-bold mb-2" style="color:#FF6F00;">Novo Projeto</div>
                        <label class="form-label">Título</label>
                        <input type="text" class="form-control mb-1" id="projAddTitulo">
                        <label class="form-label">Período</label>
                        <div class="d-flex gap-2 align-items-center mb-1 flex-wrap">
                            <input type="number" class="form-control" style="max-width:100px;" min="1900" max="${new Date().getFullYear()}" placeholder="Ano início" id="projAddAnoInicio">
                            <span style="color:#fff;">até</span>
                            <input type="number" class="form-control" style="max-width:100px;" min="1900" max="${new Date().getFullYear()}" placeholder="Ano fim" id="projAddAnoFim">
                        </div>
                        <label class="form-label">Descrição</label>
                        <textarea class="form-control" rows="2" id="projAddDescricao"></textarea>
                        <div id="projAddError" class="text-danger mt-2" style="display:none;font-size:0.98rem;"></div>
                        <div class="d-flex gap-2 mt-3">
                            <button type="button" class="btn btn-primary flex-fill" id="btnAddProj"><i class="bi bi-check-lg"></i> Adicionar</button>
                            <button type="button" class="btn btn-outline-secondary flex-fill" id="btnCancelAddProj">Cancelar</button>
                        </div>
                    </div>
                </div>
                <div class="mb-3" id="proj-add-btn-wrapper">
                    <button type="button" class="btn btn-success w-100" id="btnShowAddProj" style="font-weight:600;">
                        <i class="bi bi-plus-lg"></i> Adicionar projeto
                    </button>
                </div>
                `;
                break;
            default:
                title.textContent = 'Editar';
                html = '';
        }
        fields.innerHTML = html;

        // Avatar preview ao selecionar arquivo
        if (type === 'header') {
            const avatarInput = document.getElementById('avatarInput');
            const avatarPreview = document.getElementById('avatarPreview');
            const avatarUrlInput = document.getElementById('avatarUrlInput');
            avatarInput.addEventListener('change', function (e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function (ev) {
                        avatarPreview.src = ev.target.result;
                        avatarUrlInput.value = ev.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            });
            // Aplica máscara ao telefone
            const telefoneInput = document.getElementById('editTelefone');
            if (telefoneInput) aplicarMascaraTelefone(telefoneInput);
        }
        if (type === 'projetos') {
            // Expandir edição
            document.querySelectorAll('.btn-proj-edit').forEach(btn => {
                btn.onclick = function () {
                    const idx = btn.getAttribute('data-idx');
                    const card = document.getElementById(`proj-card-${idx}`);
                    const fields = card.querySelector('.proj-edit-fields');
                    fields.style.display = fields.style.display === 'none' ? 'block' : 'none';
                };
            });
            // Excluir projeto
            document.querySelectorAll('.btn-proj-remove').forEach(btn => {
                btn.onclick = function () {
                    const idx = btn.getAttribute('data-idx');
                    empresaProfileData.projetos.splice(idx, 1);
                    fillPopup('projetos');
                };
            });
            // Salvar projeto editado
            document.querySelectorAll('.btn-proj-save').forEach(btn => {
                btn.onclick = function () {
                    const idx = btn.getAttribute('data-idx');
                    const card = document.getElementById(`proj-card-${idx}`);
                    const inputs = card.querySelectorAll('input');
                    const textarea = card.querySelector('textarea');
                    const errorDiv = card.querySelector('.proj-edit-error');
                    const titulo = inputs[0].value.trim();
                    const anoInicio = inputs[1].value.trim();
                    const anoFim = inputs[2].value.trim();
                    const descricao = textarea.value.trim();
                    const anoAtual = new Date().getFullYear();

                    // Validação obrigatória
                    if (!titulo || !anoInicio || !anoFim || !descricao) {
                        errorDiv.textContent = "Preencha todos os campos para salvar o projeto.";
                        errorDiv.style.display = "block";
                        return;
                    }
                    // Validação de ano mínimo/máximo
                    if (Number(anoInicio) < 1900 || Number(anoFim) < 1900 || Number(anoInicio) > anoAtual || Number(anoFim) > anoAtual) {
                        errorDiv.textContent = "O ano de início e fim devem ser datas entre 1900 e o ano atual.";
                        errorDiv.style.display = "block";
                        return;
                    }
                    // Validação de ordem dos anos
                    if (Number(anoInicio) > Number(anoFim)) {
                        errorDiv.textContent = "Ano início não pode ser maior que ano fim.";
                        errorDiv.style.display = "block";
                        return;
                    }
                    errorDiv.style.display = "none";
                    empresaProfileData.projetos[idx] = {
                        titulo,
                        periodo: `${anoInicio}-${anoFim}`,
                        descricao
                    };
                    fillPopup('projetos');
                };
            });

            // Adicionar novo projeto
            const btnShowAddProj = document.getElementById('btnShowAddProj');
            const projAddCard = document.getElementById('proj-add-card');
            if (btnShowAddProj && projAddCard) {
                btnShowAddProj.onclick = function () {
                    projAddCard.style.display = 'block';
                    btnShowAddProj.disabled = true;
                };
            }
            const btnCancelAddProj = document.getElementById('btnCancelAddProj');
            if (btnCancelAddProj && projAddCard && btnShowAddProj) {
                btnCancelAddProj.onclick = function () {
                    projAddCard.style.display = 'none';
                    btnShowAddProj.disabled = false;
                };
            }
            const btnAddProj = document.getElementById('btnAddProj');
            if (btnAddProj) {
                btnAddProj.onclick = function () {
                    const titulo = document.getElementById('projAddTitulo').value.trim();
                    const anoInicio = document.getElementById('projAddAnoInicio').value.trim();
                    const anoFim = document.getElementById('projAddAnoFim').value.trim();
                    const descricao = document.getElementById('projAddDescricao').value.trim();
                    const errorDiv = document.getElementById('projAddError');
                    const anoAtual = new Date().getFullYear();

                    if (!titulo || !anoInicio || !anoFim || !descricao) {
                        errorDiv.textContent = "Preencha todos os campos para adicionar um projeto.";
                        errorDiv.style.display = "block";
                        return;
                    }
                    if (Number(anoInicio) < 1900 || Number(anoFim) < 1900 || Number(anoInicio) > anoAtual || Number(anoFim) > anoAtual) {
                        errorDiv.textContent = "O ano de início e fim devem ser datas entre 1900 e o ano atual.";
                        errorDiv.style.display = "block";
                        return;
                    }
                    if (Number(anoInicio) > Number(anoFim)) {
                        errorDiv.textContent = "Ano início não pode ser maior que ano fim.";
                        errorDiv.style.display = "block";
                        return;
                    }
                    errorDiv.style.display = "none";
                    empresaProfileData.projetos.push({
                        titulo,
                        periodo: `${anoInicio}-${anoFim}`,
                        descricao
                    });
                    fillPopup('projetos');
                };
            }
        }

        // Sempre associa o evento de submit ao abrir o popup
        const form = document.getElementById('editForm');
        if (form) {
            form.onsubmit = function (e) {
                e.preventDefault();
                const type = document.getElementById('editPopupTitle').textContent.replace('Editar ', '').toLowerCase();

                if (type.includes('empresa') || type.includes('dados')) {
                    // Pega valores
                    const nome = document.getElementById('editNome').value.trim();
                    const cargo = document.getElementById('editCargo').value.trim();
                    const avatar = document.getElementById('avatarUrlInput').value;
                    const email = document.getElementById('editEmail').value.trim();
                    const telefone = document.getElementById('editTelefone').value.trim();
                    const linkedin = document.getElementById('editLinkedin').value.trim();
                    const site = document.getElementById('editSite').value.trim();

                    // Regex simples para validação
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    const telRegex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
                    const urlRegex = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i;

                    // Limpa mensagens antigas
                    function setError(id, msg) {
                        let el = document.getElementById(id);
                        el.innerHTML = msg || '';
                        el.style.display = msg ? 'block' : 'none';
                    }
                    setError('editEmailError', '');
                    setError('editTelefoneError', '');
                    setError('editLinkedinError', '');
                    setError('editSiteError', '');

                    let hasError = false;
                    if (email && !emailRegex.test(email)) {
                        setError('editEmailError', 'E-mail inválido.');
                        hasError = true;
                    }
                    if (telefone && !telRegex.test(telefone)) {
                        setError('editTelefoneError', 'Telefone inválido.');
                        hasError = true;
                    }
                    if (linkedin && linkedin !== "#" && !urlRegex.test(linkedin)) {
                        setError('editLinkedinError', 'LinkedIn URL inválido.');
                        hasError = true;
                    }
                    if (site && site !== "#" && !urlRegex.test(site)) {
                        setError('editSiteError', 'Site URL inválido.');
                        hasError = true;
                    }
                    if (hasError) return false;

                    empresaProfileData.nome = nome;
                    empresaProfileData.cargo = cargo;
                    empresaProfileData.avatar = avatar;
                    empresaProfileData.contato.email = email;
                    empresaProfileData.contato.telefone = telefone;
                    empresaProfileData.redes[0].link = linkedin;
                    empresaProfileData.redes[1].link = site;
                }
                if (type.includes('sobre')) {
                    empresaProfileData.sobre = document.getElementById('editSobre').value.trim();
                }
                // Projetos são salvos individualmente nos botões de salvar de cada projeto
                renderEmpresaProfile(empresaProfileData);
                closeOverlay();
                return false;
            };
        }
    }

    // Abrir popup ao clicar em qualquer botão de edição
    document.body.addEventListener('click', function (e) {
        const btn = e.target.closest('.edit-btn');
        if (btn) {
            const { overlay, popup } = getPopupElements();
            const type = btn.getAttribute('data-edit');
            fillPopup(type);
            overlay.classList.add('active');
            popup.classList.add('active');
            popup.style.display = 'block';
        }
    });

    function closeOverlay() {
        const { overlay, popup } = getPopupElements();
        overlay.classList.remove('active');
        popup.classList.remove('active');
        setTimeout(() => { popup.style.display = 'none'; }, 200);
    }
    getPopupElements().overlay.onclick = closeOverlay;
    getPopupElements().closeBtn.onclick = closeOverlay;

    // Salvar alterações ao enviar o formulário
    document.getElementById('editForm').onsubmit = function (e) {
        e.preventDefault();
        const type = document.getElementById('editPopupTitle').textContent.replace('Editar ', '').toLowerCase();

        if (type.includes('empresa') || type.includes('dados')) {
            // Pega valores
            const nome = document.getElementById('editNome').value.trim();
            const cargo = document.getElementById('editCargo').value.trim();
            const avatar = document.getElementById('avatarUrlInput').value;
            const email = document.getElementById('editEmail').value.trim();
            const telefone = document.getElementById('editTelefone').value.trim();
            const linkedin = document.getElementById('editLinkedin').value.trim();
            const site = document.getElementById('editSite').value.trim();

            // Regex simples para validação
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const telRegex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
            const urlRegex = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i;

            // Limpa mensagens antigas
            function setError(id, msg) {
                let el = document.getElementById(id);
                el.innerHTML = msg || '';
                el.style.display = msg ? 'block' : 'none';
            }
            setError('editEmailError', '');
            setError('editTelefoneError', '');
            setError('editLinkedinError', '');
            setError('editSiteError', '');

            let hasError = false;
            if (email && !emailRegex.test(email)) {
                setError('editEmailError', 'E-mail inválido.');
                hasError = true;
            }
            if (telefone && !telRegex.test(telefone)) {
                setError('editTelefoneError', 'Telefone inválido.');
                hasError = true;
            }
            if (linkedin && linkedin !== "#" && !urlRegex.test(linkedin)) {
                setError('editLinkedinError', 'LinkedIn URL inválido.');
                hasError = true;
            }
            if (site && site !== "#" && !urlRegex.test(site)) {
                setError('editSiteError', 'Site URL inválido.');
                hasError = true;
            }
            if (hasError) return false;

            empresaProfileData.nome = nome;
            empresaProfileData.cargo = cargo;
            empresaProfileData.avatar = avatar;
            empresaProfileData.contato.email = email;
            empresaProfileData.contato.telefone = telefone;
            empresaProfileData.redes[0].link = linkedin;
            empresaProfileData.redes[1].link = site;
        }
        if (type.includes('sobre')) {
            empresaProfileData.sobre = document.getElementById('editSobre').value.trim();
        }
        // Projetos são salvos individualmente nos botões de salvar de cada projeto
        renderEmpresaProfile(empresaProfileData);
        closeOverlay();
        return false;
    };
});

function calcularProgressoEmpresa(profile) {
    const campos = [
        { nome: "Logo", valor: profile.avatar },
        { nome: "Nome", valor: profile.nome },
        { nome: "Descrição", valor: profile.cargo },
        { nome: "Sobre", valor: profile.sobre },
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