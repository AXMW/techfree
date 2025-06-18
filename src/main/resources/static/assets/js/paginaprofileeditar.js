let currentPopupType = '';
// Sugestões para habilidades e certificados (adicione mais se quiser)
const sugestoesHabilidades = [
    "JavaScript", "Python", "Java", "C#", "PHP", "SQL", "React", "Node.js", "TypeScript", "Vue.js", "Angular", "Docker", "Figma", "Scrum", "Inglês Avançado"
];
const sugestoesCertificados = [
    "AWS Certified Developer", "Scrum Foundation", "Inglês Avançado", "Google Cloud", "Azure Fundamentals"
];

// Função para criar sistema de tags
function setupTagsInput(wrapperId, initialTags, suggestions) {
    const wrapper = document.getElementById(wrapperId);
    wrapper.innerHTML = `
        <div class="tags-input-wrapper" style="background: #22243a; border: 1.5px solid #44495a; border-radius: 0.7rem; min-height: 48px; display: flex; flex-wrap: wrap; align-items: center; padding: 0.5rem 0.7rem;">
            <input type="text" class="form-control border-0 shadow-none p-0 m-0" style="background: transparent; min-width: 120px; flex: 1 0 120px;" placeholder="Digite e pressione Enter..." autocomplete="off">
            <div class="bg-dark border rounded shadow-sm position-absolute w-100 mt-1" style="z-index: 10; display: none; max-height: 220px; overflow-y: auto; left: 0; top: 100%;"></div>
        </div>
    `;
    const tagsInputWrapper = wrapper.querySelector('.tags-input-wrapper');
    const input = tagsInputWrapper.querySelector('input');
    const dropdown = tagsInputWrapper.querySelector('div');
    let tags = [...initialTags];

    function renderTags() {
        tagsInputWrapper.querySelectorAll('.tag').forEach(el => el.remove());
        tags.forEach(tag => {
            const tagEl = document.createElement('span');
            tagEl.className = 'tag';
            tagEl.textContent = tag;
            const removeBtn = document.createElement('span');
            removeBtn.className = 'remove-tag';
            removeBtn.innerHTML = '&times;';
            removeBtn.onclick = function () {
                tags = tags.filter(t => t !== tag);
                renderTags();
            };
            tagEl.appendChild(removeBtn);
            tagsInputWrapper.insertBefore(tagEl, input);
        });
    }

    function renderDropdown(filter = "") {
        dropdown.innerHTML = "";
        let filtered = suggestions.filter(s => s.toLowerCase().includes(filter.toLowerCase()) && !tags.includes(s));
        if (filter && !suggestions.map(s=>s.toLowerCase()).includes(filter.toLowerCase()) && !tags.includes(filter)) {
            filtered.unshift(filter);
        }
        if (filtered.length === 0) {
            dropdown.style.display = "none";
            return;
        }
        filtered.forEach(opt => {
            const div = document.createElement('div');
            div.className = "px-3 py-2";
            div.style.cursor = "pointer";
            div.textContent = opt;
            div.onclick = function() {
                if (!tags.includes(opt)) {
                    tags.push(opt);
                    renderTags();
                }
                dropdown.style.display = "none";
                input.value = "";
                input.focus();
            };
            dropdown.appendChild(div);
        });
        dropdown.style.display = "block";
    }

    input.addEventListener('input', function () {
        renderDropdown(this.value.trim());
    });
    input.addEventListener('focus', function () {
        renderDropdown(this.value.trim());
    });
    input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            let val = this.value.trim();
            if (val && !tags.includes(val)) {
                tags.push(val);
                renderTags();
            }
            this.value = "";
            dropdown.style.display = "none";
        }
    });
    document.addEventListener('click', function(e) {
        if (!input.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.style.display = "none";
        }
    });

    renderTags();
    return () => tags;
}

function renderProfile(profile) {
    let certificadosHtml = (profile.certificados || []).map(cert => `<span class="badge">${cert}</span>`).join('');
    let headerSkills = (profile.habilidades || []).slice(0, 3).map(h => `<span class="badge">${h}</span>`).join('');
    let allSkills = (profile.habilidades || []).map(h => `<span class="badge">${h}</span>`).join('');
    let redesHtml = `
        ${profile.github ? `<a href="${profile.github}" target="_blank" rel="noopener noreferrer"><i class="bi bi-github"></i></a>` : ''}
        ${profile.linkedin ? `<a href="${profile.linkedin}" target="_blank" rel="noopener noreferrer"><i class="bi bi-linkedin"></i></a>` : ''}
        ${profile.portfolio ? `<a href="${profile.portfolio}" target="_blank" rel="noopener noreferrer"><i class="bi bi-globe"></i></a>` : ''}
    `;
    let contatoHtml = `
        <div><i class="bi bi-envelope"></i><span>${profile.emailContato || ''}</span></div>
        <div><i class="bi bi-whatsapp"></i><span>${profile.telefone || ''}</span></div>
    `;
    let experienciaHtml = (profile.experiencia || []).map((exp, idx) => `
        <div class="timeline-item" data-exp-idx="${idx}">
            <div class="timeline-title">${exp.empresa}</div>
            <div class="timeline-period">${exp.cargo} (${exp.tempo})</div>
            <div>${exp.descricao}</div>
        </div>
    `).join('');
    let experienciaAcademicaHtml = (profile.experienciaAcademica || []).map((exp, idx) => `
        <div class="timeline-item" data-expacad-idx="${idx}">
            <div class="timeline-title">${exp.instituicao}</div>
            <div class="timeline-period">${exp.curso} (${exp.periodo})</div>
            <div>${exp.descricao}</div>
        </div>
    `).join('');

    document.querySelector('.profile-header').innerHTML = `
        <button class="btn btn-edit-icon edit-btn position-absolute top-0 end-0 m-2" data-edit="header" title="Editar"><i class="bi bi-pencil-square"></i></button>
        <img src="${avatarPreviewDataUrl || profile.avatar || 'assets/img/default-avatar.png'}" class="profile-avatar" alt="Avatar do Usuário">
        <div class="profile-info flex-grow-1">
            <h2>${profile.nome || ''}</h2>
            <div class="role mb-1">${profile.areaAtuacao || ''}</div>
            <div class="profile-badges mb-2">${headerSkills}</div>
            <div class="profile-contact mt-2">${contatoHtml}</div>
            <div class="profile-social mt-3">${redesHtml}</div>
        </div>
    `;

    document.getElementById('profileSobre').innerHTML = profile.bio || '';
    document.getElementById('profileSkills').innerHTML = allSkills;
    document.getElementById('profileExperiencia').innerHTML = experienciaHtml;
    document.getElementById('profileExperienciaAcademica').innerHTML = experienciaAcademicaHtml;
    document.getElementById('profileCertificados').innerHTML = certificadosHtml;
    atualizarBarraProgresso(profile);
}

document.addEventListener('DOMContentLoaded', function() {
    carregarPerfil();
});

function getPopupElements() {
    return {
        overlay: document.getElementById('editOverlay'),
        popup: document.getElementById('editPopup'),
        closeBtn: document.getElementById('closeEditPopup'),
        title: document.getElementById('editPopupTitle'),
        fields: document.getElementById('editFormFields')
    };
}

function fillPopup(type, isFirstOpen = false) {
    // Inicializar arrays temporários ANTES de montar o HTML!
    if(isFirstOpen) {
        if(type === 'experiencia') {
            tempExperiencia = JSON.parse(JSON.stringify(profileData.experiencia || []));
        }
        if(type === 'experienciaAcademica') {
            tempExperienciaAcademica = JSON.parse(JSON.stringify(profileData.experienciaAcademica || []));
        }
    }

    const { title, fields } = getPopupElements();
    let html = '';
    switch(type) {
        case 'header':
            title.textContent = 'Editar Resumo';
            html = `
                <div class="mb-3 text-center">
                    <img src="${avatarPreviewDataUrl || profileData.avatar}" id="avatarPreview" class="rounded-circle mb-2" style="width:90px;height:90px;object-fit:cover;border:3px solid #FF6F00;background:#fff;">
                    <div>
                        <label class="form-label d-block">Avatar</label>
                        <input type="file" class="form-control mb-2" id="avatarInput" style="padding: 0 1.1rem !important; height: 50px; align-content: center;"  accept="image/*">
                        <input type="hidden" id="avatarUrlInput" value="${avatarPreviewDataUrl || profileData.avatar || ''}">
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Nome</label>
                    <input type="text" class="form-control" id="editNome" value="${profileData.nome || ''}">
                </div>
                <div class="mb-3">
                    <label class="form-label">Área de Atuação</label>
                    <input type="text" class="form-control" id="editCargo" value="${profileData.areaAtuacao || ''}">
                </div>
                <div class="mb-3">
                    <label class="form-label">E-mail de contato</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="bi bi-envelope"></i></span>
                        <input type="text" class="form-control no-margin" id="editEmail" placeholder="E-mail" value="${profileData.emailContato || ''}">
                    </div>
                    <div id="editEmailError" class="text-danger mt-1" style="font-size:0.98rem;"></div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Telefone</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="bi bi-whatsapp"></i></span>
                        <input type="text" class="form-control no-margin" id="editWhatsapp" placeholder="Telefone/WhatsApp" value="${profileData.telefone || ''}">
                    </div>
                    <div id="editWhatsappError" class="text-danger mt-1" style="font-size:0.98rem;"></div>
                </div>
                <div class="mb-3">
                    <label class="form-label">GitHub</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="bi bi-github"></i></span>
                        <input type="text" class="form-control no-margin" id="editGithub" placeholder="GitHub URL" value="${profileData.github || ''}">
                    </div>
                    <div id="editGithubError" class="text-danger mt-1" style="font-size:0.98rem;"></div>
                </div>
                <div class="mb-3">
                    <label class="form-label">LinkedIn</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="bi bi-linkedin"></i></span>
                        <input type="text" class="form-control no-margin" id="editLinkedin" placeholder="LinkedIn URL" value="${profileData.linkedin || ''}">
                    </div>
                    <div id="editLinkedinError" class="text-danger mt-1" style="font-size:0.98rem;"></div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Site/Portfólio</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="bi bi-globe"></i></span>
                        <input type="text" class="form-control no-margin" id="editSite" placeholder="Site URL" value="${profileData.portfolio || ''}">
                    </div>
                    <div id="editSiteError" class="text-danger mt-1" style="font-size:0.98rem;"></div>
                </div>
            `;
            break;
        case 'sobre':
            title.textContent = 'Editar Sobre';
            html = `
                <div class="mb-3">
                    <label class="form-label">Sobre</label>
                    <textarea class="form-control" id="editSobre" rows="5">${profileData.bio || ''}</textarea>
                </div>
            `;
            break;
        case 'habilidades':
            title.textContent = 'Editar Habilidades';
            html = `
                <div class="mb-3">
                    <label class="form-label">Habilidades</label>
                    <div id="tagsHabilidades"></div>
                </div>
            `;
            break;
        case 'certificados':
            title.textContent = 'Editar Certificados';
            html = `
                <div class="mb-3">
                    <label class="form-label">Certificados</label>
                    <div id="tagsCertificados"></div>
                </div>
            `;
            break;
        case 'experiencia':
            title.textContent = 'Editar Experiência';
            html = (tempExperiencia || []).map((exp, idx) => {
                let [anoInicio, anoFim] = (exp.tempo || '').split('-');
                const anoAtual = new Date().getFullYear();
                return `
                <div class="mb-3 border rounded p-2" id="exp-card-${idx}">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <div class="timeline-title" style="font-weight:700;color:#FF6F00;">${exp.empresa}</div>
                            <div class="timeline-period" style="font-size:0.95rem;color:#bdbdbd;">${exp.cargo} (${exp.tempo})</div>
                            <div>${exp.descricao}</div>
                        </div>
                        <div class="d-flex align-items-center gap-1">
                            <button type="button" class="btn btn-edit-icon btn-exp-edit" data-idx="${idx}" title="Editar"><i class="bi bi-pencil-square"></i></button>
                            <button type="button" class="btn btn-edit-icon btn-exp-remove" data-idx="${idx}" title="Excluir"><i class="bi bi-trash"></i></button>
                        </div>
                    </div>
                    <div class="exp-edit-fields mt-3" style="display:none;">
                        <label class="form-label">Empresa</label>
                        <input type="text" class="form-control mb-1" value="${exp.empresa}">
                        <label class="form-label">Cargo</label>
                        <input type="text" class="form-control mb-1" value="${exp.cargo}">
                        <label class="form-label">Tempo</label>
                        <div class="d-flex gap-2 align-items-center mb-1 flex-wrap">
                            <input type="number" class="form-control" style="max-width:100px;" min="1900" max="${anoAtual}" placeholder="Ano início" value="${anoInicio || ''}">
                            <span style="color:#fff;">até</span>
                            <input type="number" class="form-control" style="max-width:100px;" min="1900" max="${anoAtual}" placeholder="Ano fim" value="${anoFim || ''}">
                        </div>
                        <label class="form-label">Descrição</label>
                        <textarea class="form-control" rows="2">${exp.descricao}</textarea>
                        <button type="button" class="btn btn-success mt-2 btn-exp-save" data-idx="${idx}">Salvar</button>
                    </div>
                </div>
                `;
            }).join('');

            html += `
            <div id="exp-add-card" style="display:none;">
                <div class="mb-3 border rounded p-3 bg-dark">
                    <div class="fw-bold mb-2" style="color:#FF6F00;">Nova experiência</div>
                    <label class="form-label">Empresa</label>
                    <input type="text" class="form-control mb-1" id="expAddEmpresa">
                    <label class="form-label">Cargo</label>
                    <input type="text" class="form-control mb-1" id="expAddCargo">
                    <label class="form-label">Tempo</label>
                    <div class="d-flex gap-2 align-items-center mb-1 flex-wrap">
                        <input type="number" class="form-control" style="max-width:100px;" min="1900" max="${new Date().getFullYear()}" placeholder="Início" id="expAddAnoInicio">
                        <span style="color:#fff;">até</span>
                        <input type="number" class="form-control" style="max-width:100px;" min="1900" max="${new Date().getFullYear()}" placeholder="Fim" id="expAddAnoFim">
                    </div>
                    <label class="form-label">Descrição</label>
                    <textarea class="form-control" rows="2" id="expAddDescricao"></textarea>
                    <div class="d-flex gap-2 mt-3">
                        <button type="button" class="btn btn-primary flex-fill" id="btnAddExp">Adicionar</button>
                        <button type="button" class="btn btn-outline-secondary flex-fill" id="btnCancelAddExp">Cancelar</button>
                    </div>
                    <div id="expAddError" class="text-danger mt-2" style="display:none;font-size:0.98rem;"></div>
                </div>
            </div>
            <div class="mb-3" id="exp-add-btn-wrapper">
                <button type="button" class="btn btn-success w-100" id="btnShowAddExp" style="font-weight:600;">
                    <i class="bi bi-plus-lg"></i> Adicionar experiência
                </button>
            </div>
            `;
            break;
        case 'experienciaAcademica':
            title.textContent = 'Editar Experiência Acadêmica';
            html = (tempExperienciaAcademica || []).map((exp, idx) => {
                let [anoInicio, anoFim] = (exp.periodo || '').split('-');
                const anoAtual = new Date().getFullYear();
                return `
                <div class="mb-3 border rounded p-2" id="expacad-card-${idx}">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <div class="timeline-title" style="font-weight:700;color:#FF6F00;">${exp.instituicao}</div>
                            <div class="timeline-period" style="font-size:0.95rem;color:#bdbdbd;">${exp.curso} (${exp.periodo})</div>
                            <div>${exp.descricao}</div>
                        </div>
                        <div class="d-flex align-items-center gap-1">
                            <button type="button" class="btn btn-edit-icon btn-expacad-edit" data-idx="${idx}" title="Editar"><i class="bi bi-pencil-square"></i></button>
                            <button type="button" class="btn btn-edit-icon btn-expacad-remove" data-idx="${idx}" title="Excluir"><i class="bi bi-trash"></i></button>
                        </div>
                    </div>
                    <div class="expacad-edit-fields mt-3" style="display:none;">
                        <label class="form-label">Instituição</label>
                        <input type="text" class="form-control mb-1" value="${exp.instituicao}">
                        <label class="form-label">Curso</label>
                        <input type="text" class="form-control mb-1" value="${exp.curso}">
                        <label class="form-label">Período</label>
                        <div class="d-flex gap-2 align-items-center mb-1 flex-wrap">
                            <input type="number" class="form-control" style="max-width:100px;" min="1900" max="${anoAtual}" placeholder="Ano início" value="${anoInicio || ''}">
                            <span style="color:#fff;">até</span>
                            <input type="number" class="form-control" style="max-width:100px;" min="1900" max="${anoAtual}" placeholder="Ano fim" value="${anoFim || ''}">
                        </div>
                        <label class="form-label">Descrição</label>
                        <textarea class="form-control" rows="2">${exp.descricao}</textarea>
                        <button type="button" class="btn btn-success mt-2 btn-expacad-save" data-idx="${idx}">Salvar</button>
                    </div>
                </div>
                `;
            }).join('');
            html += `
            <div id="expacad-add-card" style="display:none;">
                <div class="mb-3 border rounded p-3 bg-dark">
                    <div class="fw-bold mb-2" style="color:#FF6F00;">Nova experiência acadêmica</div>
                    <label class="form-label">Instituição</label>
                    <input type="text" class="form-control mb-1" id="expacadAddInstituicao">
                    <label class="form-label">Curso</label>
                    <input type="text" class="form-control mb-1" id="expacadAddCurso">
                    <label class="form-label">Período</label>
                    <div class="d-flex gap-2 align-items-center mb-1 flex-wrap">
                        <input type="number" class="form-control" style="max-width:100px;" min="1900" max="${new Date().getFullYear()}" placeholder="Ano início" id="expacadAddAnoInicio">
                        <span style="color:#fff;">até</span>
                        <input type="number" class="form-control" style="max-width:100px;" min="1900" max="${new Date().getFullYear()}" placeholder="Ano fim" id="expacadAddAnoFim">
                    </div>
                    <label class="form-label">Descrição</label>
                    <textarea class="form-control" rows="2" id="expacadAddDescricao"></textarea>
                    <div class="d-flex gap-2 mt-3">
                        <button type="button" class="btn btn-primary flex-fill" id="btnAddExpAcad"><i class="bi bi-check-lg"></i> Adicionar</button>
                        <button type="button" class="btn btn-outline-secondary flex-fill" id="btnCancelAddExpAcad">Cancelar</button>
                    </div>
                    <div id="expacadAddError" class="text-danger mt-2" style="display:none;font-size:0.98rem;"></div>
                </div>
            </div>
            <div class="mb-3" id="expacad-add-btn-wrapper">
                <button type="button" class="btn btn-success w-100" id="btnShowAddExpAcad" style="font-weight:600;">
                    <i class="bi bi-plus-lg"></i> Adicionar experiência acadêmica
                </button>
            </div>
            `;
            break;
        default:
            title.textContent = 'Editar';
            html = '';
    }
    fields.innerHTML = html;

    if(type === 'header') {
        const avatarInput = document.getElementById('avatarInput');
        const avatarPreview = document.getElementById('avatarPreview');
        const avatarUrlInput = document.getElementById('avatarUrlInput');
        avatarInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if(file) {
                const reader = new FileReader();
                reader.onload = function(ev) {
                    avatarPreview.src = ev.target.result;
                    avatarPreviewDataUrl = ev.target.result;
                };
                reader.readAsDataURL(file);
                avatarInput._selectedFile = file;
            }
        });
        // APLICAR MÁSCARA DE TELEFONE
        const telInput = document.getElementById('editWhatsapp');
        if (telInput) aplicarMascaraTelefone(telInput);
    }
    if(type === 'habilidades') {
        window.getHabilidadesTags = setupTagsInput('tagsHabilidades', profileData.habilidades || [], sugestoesHabilidades);
    }
    if(type === 'certificados') {
        window.getCertificadosTags = setupTagsInput('tagsCertificados', profileData.certificados || [], sugestoesCertificados);
    }
    if(type === 'experiencia') {
        document.querySelectorAll('.btn-exp-edit').forEach(btn => {
            btn.onclick = function() {
                const idx = btn.getAttribute('data-idx');
                const card = document.getElementById(`exp-card-${idx}`);
                const fields = card.querySelector('.exp-edit-fields');
                fields.style.display = fields.style.display === 'none' ? 'block' : 'none';
            };
        });
        document.querySelectorAll('.btn-exp-remove').forEach(btn => {
            btn.onclick = function() {
                const idx = btn.getAttribute('data-idx');
                tempExperiencia.splice(idx, 1);
                fillPopup('experiencia');
            };
        });
        document.querySelectorAll('.btn-exp-save').forEach(btn => {
            btn.onclick = function() {
                const idx = btn.getAttribute('data-idx');
                const card = document.getElementById(`exp-card-${idx}`);
                const inputs = card.querySelectorAll('input');
                const textarea = card.querySelector('textarea');
                const empresa = inputs[0].value.trim();
                const cargo = inputs[1].value.trim();
                const anoInicio = inputs[2].value.trim();
                const anoFim = inputs[3].value.trim();
                const tempo = anoInicio && anoFim ? `${anoInicio}-${anoFim}` : '';
                const descricao = textarea.value.trim();
                let errorDiv = card.querySelector('.exp-edit-error');
                if (!errorDiv) {
                    errorDiv = document.createElement('div');
                    errorDiv.className = 'text-danger mt-2 exp-edit-error';
                    errorDiv.style.fontSize = '0.98rem';
                    card.querySelector('.exp-edit-fields').appendChild(errorDiv);
                }
                const anoAtual = new Date().getFullYear();
                if(!empresa || !cargo || !anoInicio || !anoFim || !descricao) {
                    errorDiv.textContent = "Preencha todos os campos para salvar.";
                    errorDiv.style.display = "block";
                    return;
                }
                if(Number(anoInicio) < 1900 || Number(anoFim) < 1900 || Number(anoInicio) > anoAtual || Number(anoFim) > anoAtual) {
                    errorDiv.textContent = "O ano de início e fim devem ser datas entre 1900 e o ano atual.";
                    errorDiv.style.display = "block";
                    return;
                }
                if(Number(anoInicio) > Number(anoFim)) {
                    errorDiv.textContent = "O ano de início não pode ser maior que o ano de fim.";
                    errorDiv.style.display = "block";
                    return;
                }
                errorDiv.style.display = "none";
                tempExperiencia[idx] = { empresa, cargo, tempo, descricao };
                fillPopup('experiencia');
            };
        });

        const btnShowAddExp = document.getElementById('btnShowAddExp');
        const expAddCard = document.getElementById('exp-add-card');
        if(btnShowAddExp && expAddCard) {
            btnShowAddExp.onclick = function() {
                expAddCard.style.display = 'block';
                btnShowAddExp.disabled = true;
            };
        }
        const btnCancelAddExp = document.getElementById('btnCancelAddExp');
        if(btnCancelAddExp && expAddCard && btnShowAddExp) {
            btnCancelAddExp.onclick = function() {
                expAddCard.style.display = 'none';
                btnShowAddExp.disabled = false;
            };
        }
        const btnAddExp = document.getElementById('btnAddExp');
        if(btnAddExp) {
            btnAddExp.onclick = function() {
                const empresa = document.getElementById('expAddEmpresa').value.trim();
                const cargo = document.getElementById('expAddCargo').value.trim();
                const anoInicio = document.getElementById('expAddAnoInicio').value.trim();
                const anoFim = document.getElementById('expAddAnoFim').value.trim();
                const descricao = document.getElementById('expAddDescricao').value.trim();
                const errorDiv = document.getElementById('expAddError');
                if(!empresa || !cargo || !anoInicio || !anoFim || !descricao) {
                    errorDiv.textContent = "Preencha todos os campos para adicionar uma experiência.";
                    errorDiv.style.display = "block";
                    return;
                }
                if(Number(anoInicio) < 1900 || Number(anoFim) < 1900 || Number(anoInicio) > new Date().getFullYear() || Number(anoFim) > new Date().getFullYear()) {
                    errorDiv.textContent = "O ano de início e fim devem ser datas entre 1900 e o ano atual.";
                    errorDiv.style.display = "block";
                    return;
                }
                if(Number(anoInicio) > Number(anoFim)) {
                    errorDiv.textContent = "O ano de início não pode ser maior que o ano de fim.";
                    errorDiv.style.display = "block";
                    return;
                }
                errorDiv.style.display = "none";
                tempExperiencia.push({
                    empresa,
                    cargo,
                    tempo: `${anoInicio}-${anoFim}`,
                    descricao
                });
                fillPopup('experiencia');
            };
        }
    }
    if(type === 'experienciaAcademica') {
        document.querySelectorAll('.btn-expacad-edit').forEach(btn => {
            btn.onclick = function() {
                const idx = btn.getAttribute('data-idx');
                const card = document.getElementById(`expacad-card-${idx}`);
                const fields = card.querySelector('.expacad-edit-fields');
                fields.style.display = fields.style.display === 'none' ? 'block' : 'none';
            };
        });
        document.querySelectorAll('.btn-expacad-remove').forEach(btn => {
            btn.onclick = function() {
                const idx = btn.getAttribute('data-idx');
                tempExperienciaAcademica.splice(idx, 1);
                fillPopup('experienciaAcademica');
            };
        });
        document.querySelectorAll('.btn-expacad-save').forEach(btn => {
            btn.onclick = function() {
                const idx = btn.getAttribute('data-idx');
                const card = document.getElementById(`expacad-card-${idx}`);
                const inputs = card.querySelectorAll('input');
                const textarea = card.querySelector('textarea');
                const instituicao = inputs[0].value.trim();
                const curso = inputs[1].value.trim();
                const anoInicio = inputs[2].value.trim();
                const anoFim = inputs[3].value.trim();
                const periodo = anoInicio && anoFim ? `${anoInicio}-${anoFim}` : '';
                const descricao = textarea.value.trim();
                let errorDiv = card.querySelector('.expacad-edit-error');
                if (!errorDiv) {
                    errorDiv = document.createElement('div');
                    errorDiv.className = 'text-danger mt-2 expacad-edit-error';
                    errorDiv.style.fontSize = '0.98rem';
                    card.querySelector('.expacad-edit-fields').appendChild(errorDiv);
                }
                const anoAtual = new Date().getFullYear();
                if(!instituicao || !curso || !anoInicio || !anoFim || !descricao) {
                    errorDiv.textContent = "Preencha todos os campos para salvar.";
                    errorDiv.style.display = "block";
                    return;
                }
                if(Number(anoInicio) < 1900 || Number(anoFim) < 1900 || Number(anoInicio) > anoAtual || Number(anoFim) > anoAtual) {
                    errorDiv.textContent = "O ano de início e fim devem ser datas entre 1900 e o ano atual.";
                    errorDiv.style.display = "block";
                    return;
                }
                if(Number(anoInicio) > Number(anoFim)) {
                    errorDiv.textContent = "O ano de início não pode ser maior que o ano de fim.";
                    errorDiv.style.display = "block";
                    return;
                }
                errorDiv.style.display = "none";
                tempExperienciaAcademica[idx] = { instituicao, curso, periodo, descricao };
                fillPopup('experienciaAcademica');
            };
        });

        const btnShowAddExpAcad = document.getElementById('btnShowAddExpAcad');
        const expacadAddCard = document.getElementById('expacad-add-card');
        if(btnShowAddExpAcad && expacadAddCard) {
            btnShowAddExpAcad.onclick = function() {
                expacadAddCard.style.display = 'block';
                btnShowAddExpAcad.disabled = true;
            };
        }
        const btnCancelAddExpAcad = document.getElementById('btnCancelAddExpAcad');
        if(btnCancelAddExpAcad && expacadAddCard && btnShowAddExpAcad) {
            btnCancelAddExpAcad.onclick = function() {
                expacadAddCard.style.display = 'none';
                btnShowAddExpAcad.disabled = false;
            };
        }
        const btnAddExpAcad = document.getElementById('btnAddExpAcad');
        if(btnAddExpAcad) {
            btnAddExpAcad.onclick = function() {
                const instituicao = document.getElementById('expacadAddInstituicao').value.trim();
                const curso = document.getElementById('expacadAddCurso').value.trim();
                const anoInicio = document.getElementById('expacadAddAnoInicio').value.trim();
                const anoFim = document.getElementById('expacadAddAnoFim').value.trim();
                const periodo = anoInicio && anoFim ? `${anoInicio}-${anoFim}` : '';
                const descricao = document.getElementById('expacadAddDescricao').value.trim();
                const errorDiv = document.getElementById('expacadAddError');
                if(!instituicao || !curso || !anoInicio || !anoFim || !descricao) {
                    errorDiv.textContent = "Preencha todos os campos para adicionar uma experiência acadêmica.";
                    errorDiv.style.display = "block";
                    return;
                }
                if(Number(anoInicio) < 1900 || Number(anoFim) < 1900 || Number(anoInicio) > new Date().getFullYear() || Number(anoFim) > new Date().getFullYear()) {
                    errorDiv.textContent = "O ano de início e fim devem ser datas entre 1900 e o ano atual.";
                    errorDiv.style.display = "block";
                    return;
                }
                if(Number(anoInicio) > Number(anoFim)) {
                    errorDiv.textContent = "O ano de início não pode ser maior que o ano de fim.";
                    errorDiv.style.display = "block";
                    return;
                }
                errorDiv.style.display = "none";
                tempExperienciaAcademica.push({
                    instituicao, curso, periodo, descricao
                });
                fillPopup('experienciaAcademica');
            };
        }
    }

    // Inicializar arrays temporários APENAS na primeira abertura do popup
    if(isFirstOpen) {
        if(type === 'experiencia') {
            tempExperiencia = JSON.parse(JSON.stringify(profileData.experiencia || []));
        }
        if(type === 'experienciaAcademica') {
            tempExperienciaAcademica = JSON.parse(JSON.stringify(profileData.experienciaAcademica || []));
        }
    }
}

document.body.addEventListener('click', function(e) {
    const btn = e.target.closest('.edit-btn');
    if (btn) {
        const { overlay, popup } = getPopupElements();
        const type = btn.getAttribute('data-edit');
        currentPopupType = type;
        if (type === 'header') {
            // Salva o preview atual antes de editar
            avatarPreviewDataUrlBeforeEdit = avatarPreviewDataUrl;
        }
        fillPopup(type, true);
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
getPopupElements().closeBtn.onclick = function() {
    closeOverlay();
    if (currentPopupType === 'experiencia') {
        tempExperiencia = JSON.parse(JSON.stringify(profileData.experiencia || []));
    }
    if (currentPopupType === 'experienciaAcademica') {
        tempExperienciaAcademica = JSON.parse(JSON.stringify(profileData.experienciaAcademica || []));
    }
    if (currentPopupType === 'header') {
        avatarPreviewDataUrl = avatarPreviewDataUrlBeforeEdit;
        // Limpa o arquivo selecionado ao fechar/cancelar
        const avatarInput = document.getElementById('avatarInput');
        if (avatarInput) avatarInput._selectedFile = null;
    }
};
getPopupElements().overlay.onclick = function(e) {
    if (e.target === getPopupElements().overlay) {
        closeOverlay();
        if (currentPopupType === 'experiencia') {
            tempExperiencia = JSON.parse(JSON.stringify(profileData.experiencia || []));
        }
        if (currentPopupType === 'experienciaAcademica') {
            tempExperienciaAcademica = JSON.parse(JSON.stringify(profileData.experienciaAcademica || []));
        }
        if (currentPopupType === 'header') {
            avatarPreviewDataUrl = avatarPreviewDataUrlBeforeEdit;
            // Limpa o arquivo selecionado ao fechar/cancelar
            const avatarInput = document.getElementById('avatarInput');
            if (avatarInput) avatarInput._selectedFile = null;
        }
    }
};
document.getElementById('editForm').onsubmit = function(e) {
    e.preventDefault();
    const type = currentPopupType; // Use sempre o tipo do botão, não o texto do título!

    if(type === 'header') {
        const nome = document.getElementById('editNome').value.trim();
        const areaAtuacao = document.getElementById('editCargo').value.trim();
        const avatar = document.getElementById('avatarUrlInput').value;
        const emailContato = document.getElementById('editEmail').value.trim();
        const telefone = document.getElementById('editWhatsapp').value.trim();
        const github = document.getElementById('editGithub').value.trim();
        const linkedin = document.getElementById('editLinkedin').value.trim();
        const portfolio = document.getElementById('editSite').value.trim();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const telRegex = /^\+?\d{8,11}$/;
        const urlRegex = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i;

        function setError(id, msg) {
            let el = document.getElementById(id);
            if (!el) {
                const input = document.getElementById(id.replace('Error',''));
                el = document.createElement('div');
                el.id = id;
                el.className = 'text-danger mt-1';
                input.parentNode.appendChild(el);
            }
            el.innerHTML = msg || '';
            el.style.display = msg ? 'block' : 'none';
        }
        setError('editEmailError', '');
        setError('editWhatsappError', '');
        setError('editGithubError', '');
        setError('editLinkedinError', '');
        setError('editSiteError', '');

        let hasError = false;
        if(emailContato && !emailRegex.test(emailContato)) {
            setError('editEmailError', 'E-mail inválido.');
            hasError = true;
        }
        if(telefone && !telRegex.test(telefone.replace(/\D/g, ''))) {
            setError('editWhatsappError', 'Telefone/WhatsApp inválido.');
            hasError = true;
        }
        if(github && github !== "#" && !urlRegex.test(github)) {
            setError('editGithubError', 'GitHub URL inválido.');
            hasError = true;
        }
        if(linkedin && linkedin !== "#" && !urlRegex.test(linkedin)) {
            setError('editLinkedinError', 'LinkedIn URL inválido.');
            hasError = true;
        }
        if(portfolio && portfolio !== "#" && !urlRegex.test(portfolio)) {
            setError('editSiteError', 'Site/Portfólio URL inválido.');
            hasError = true;
        }
        if(hasError) return false;

        profileData.nome = nome;
        profileData.areaAtuacao = areaAtuacao;
        profileData.avatar = avatar;
        profileData.emailContato = emailContato;
        profileData.telefone = telefone;
        profileData.github = github;
        profileData.linkedin = linkedin;
        profileData.portfolio = portfolio;
    }
    if(type === 'sobre') {
        profileData.bio = document.getElementById('editSobre').value.trim();
    }
    if(type === 'habilidades') {
        if(window.getHabilidadesTags) {
            profileData.habilidades = window.getHabilidadesTags();
        }
    }
    if(type === 'certificados') {
        if(window.getCertificadosTags) {
            profileData.certificados = window.getCertificadosTags();
        }
    }
    // ALTERAÇÃO: Use apenas os tipos camelCase, igual ao data-edit dos botões!
    if(type === 'experiencia') {
        profileData.experiencia = JSON.parse(JSON.stringify(tempExperiencia));
    }
    if(type === 'experienciaAcademica') {
        profileData.experienciaAcademica = JSON.parse(JSON.stringify(tempExperienciaAcademica));
    }

    if(document.getElementById('avatarPreview')) {
        avatarPreviewDataUrl = document.getElementById('avatarPreview').src;
    }
    renderProfile(profileData);
    closeOverlay();
    return false;
};

function aplicarMascaraTelefone(input) {
    input.addEventListener('input', function() {
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

function calcularProgressoPerfil(profile) {
    const campos = [
        { nome: "Foto", valor: profile.avatar },
        { nome: "Nome", valor: profile.nome },
        { nome: "Área de Atuação", valor: profile.areaAtuacao },
        { nome: "E-mail de Contato", valor: profile.emailContato },
        { nome: "Telefone/WhatsApp", valor: profile.telefone },
        { nome: "GitHub", valor: profile.github },
        { nome: "LinkedIn", valor: profile.linkedin },
        { nome: "Site", valor: profile.portfolio },
        { nome: "Sobre", valor: profile.bio }, // corrigido para bio
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
    atualizarBarraProgresso(profileData);
});

let profileData = {};
let avatarPreviewDataUrl = '';
let avatarPreviewDataUrlBeforeEdit = '';
let tempExperiencia = [];
let tempExperienciaAcademica = [];

async function carregarPerfil() {
    const resp = await fetch('/freelancer/perfil/verPerfil', {
        method: 'GET'
    });
    if (!resp.ok) return alert('Erro ao carregar perfil');
    profileData = await resp.json();
    if (profileData.avatar === "null") profileData.avatar = null;
    renderProfile(profileData);
    atualizarBarraProgresso(profileData);
}

document.getElementById('btnAplicarAlteracoes').onclick = async function () {
    if(document.getElementById('avatarInput')?._selectedFile) {
        const file = document.getElementById('avatarInput')._selectedFile;
        const formData = new FormData();
        formData.append('file', file);
        if(profileData.avatar) {
            formData.append('oldFile', profileData.avatar);
        }
        const resp = await fetch('/api/files/upload', {
            method: 'POST',
            body: formData
        });
        if(resp.ok) {
            profileData.avatar = await resp.text();
            avatarPreviewDataUrl = '';
        } else {
            alert('Erro ao enviar imagem');
            return;
        }
    }

    // Monte o DTO apenas com os campos esperados
    const dto = {
        nome: profileData.nome,
        bio: profileData.bio,
        telefone: profileData.telefone,
        areaAtuacao: profileData.areaAtuacao,
        github: profileData.github,
        linkedin: profileData.linkedin,
        portfolio: profileData.portfolio,
        emailContato: profileData.emailContato,
        habilidades: profileData.habilidades || [],
        certificados: profileData.certificados || [],
        avatar: (profileData.avatar === "null" ? null : profileData.avatar),
        experiencia: (profileData.experiencia || []).map(exp => ({
            id: exp.id || null,
            empresa: exp.empresa,
            cargo: exp.cargo,
            tempo: exp.tempo,
            descricao: exp.descricao
        })),
        experienciaAcademica: (profileData.experienciaAcademica || []).map(exp => ({
            id: exp.id || null,
            instituicao: exp.instituicao,
            curso: exp.curso,
            periodo: exp.periodo,
            descricao: exp.descricao
        }))
    };
    dto.bio = dto.bio || "";

    const resp = await fetch('/freelancer/perfil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
    });
    if(resp.ok) {
        alert('Perfil atualizado com sucesso!');
        carregarPerfil();
    } else {
        alert('Erro ao atualizar perfil');
    }
};