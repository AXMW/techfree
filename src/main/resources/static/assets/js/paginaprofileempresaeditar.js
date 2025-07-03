// Variáveis globais para os dados do perfil

let nomeFantasia = '';
let bio = '';
let avatar = '';
let emailContato = '';
let telefoneContato = '';
let linkedin = '';
let site = '';
let descricao = '';
let assinaturaPath = '';
let currentPopupType = '';

// Variável para armazenar o preview da imagem do avatar
let avatarPreviewDataUrl = '';
// Variável para armazenar o preview anterior da imagem do avatar, antes da edição
let avatarPreviewDataUrlBeforeEdit = '';
// Variável para armazenar o preview da assinatura
let assinaturaPreviewDataUrl = '';
let assinaturaPreviewDataUrlBeforeEdit = '';

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

// Busca dados do perfil da empresa e preenche as variáveis
async function carregarPerfilEmpresa() {
    const resp = await fetch('/empresa/perfil/verPerfil');
    if (!resp.ok) return alert('Erro ao carregar perfil');
    const data = await resp.json();
    nomeFantasia = data.nomeFantasia || '';
    areaatuacao = data.areaAtuacao || '';
    avatar = data.avatar || '';
    emailContato = data.emailContato || '';
    telefoneContato = data.telefoneContato || '';
    linkedin = data.linkedin || '';
    site = data.site || '';
    descricao = data.bio || '';
    assinaturaPath = data.assinaturaPath || '';
    assinaturaPreviewDataUrl = '';
    renderEmpresaProfile();
}

// Renderiza o perfil na tela usando as variáveis
function renderEmpresaProfile() {
    const profileHeader = document.querySelector('.profile-header');
    profileHeader.classList.add('d-flex', 'align-items-center', 'position-relative');
    profileHeader.innerHTML = `
        <button class="btn btn-edit-icon edit-btn position-absolute top-0 end-0 m-2" data-edit="header" title="Editar"><i class="bi bi-pencil-square"></i></button>
        <img src="${avatarPreviewDataUrl || avatar || 'assets/img/default-avatar.png'}" class="profile-avatar" alt="Logo da Empresa" style="object-fit: cover;">
        <div class="profile-info flex-grow-1">
            <h2>${nomeFantasia}</h2>
            <div class="role mb-1">${areaatuacao}</div>
            <div class="profile-contact mt-2">
                <div><i class="bi bi-envelope"></i><span>${emailContato}</span></div>
                <div><i class="bi bi-whatsapp"></i><span>${telefoneContato}</span></div>
            </div>
            <div class="profile-social mt-3">
                ${linkedin && linkedin.trim() ? `<a href="${linkedin}" target="_blank"><i class="bi bi-linkedin"></i></a>` : ''}
                ${site && site.trim() ? `<a href="${site}" target="_blank"><i class="bi bi-globe"></i></a>` : ''}
            </div>
        </div>
        <div class="assinatura-status position-absolute" style="bottom: 10px; right: 20px; min-width: 120px; text-align: right;">
            <span style="font-weight:600;color:#fff;">Assinatura:</span>
            ${assinaturaPath
                ? '<span class="text-success ms-1" title="Assinatura cadastrada"><i class="bi bi-check-circle-fill"></i></span>'
                : '<span class="text-danger ms-1" title="Assinatura não cadastrada"><i class="bi bi-x-circle-fill"></i></span>'
            }
        </div>
    `;
    // Sobre
    const sobreEl = document.getElementById('empresaSobre');
    if (sobreEl) {
        sobreEl.innerHTML = descricao && descricao.trim()
            ? descricao
            : '<p class="profile-timeline text-muted">Nenhuma informação sobre a empresa foi cadastrada ainda.</p>';
    }
    atualizarBarraProgressoEmpresa();
}

// Helpers do popup
function getPopupElements() {
    return {
        overlay: document.getElementById('editOverlay'),
        popup: document.getElementById('editPopup'),
        closeBtn: document.getElementById('closeEditPopup'),
        title: document.getElementById('editPopupTitle'),
        fields: document.getElementById('editFormFields')
    };
}

// Preencher popup de edição com dados atuais das variáveis
function fillPopup(type) {
    const { title, fields } = getPopupElements();
    let html = '';
    switch (type) {
        case 'header':
            title.textContent = 'Editar Dados da Empresa';
            html = `
        <div class="mb-3 text-center">
            <img src="${avatarPreviewDataUrl || avatar || 'assets/img/default-avatar.png'}" id="avatarPreview" class="rounded-circle mb-2" style="width:90px;height:90px;object-fit:cover;border:3px solid #FF6F00;background:#fff;">
            <div>
                <label class="form-label d-block">Logo</label>
                <input type="file" class="form-control mb-2" id="avatarInput" style="padding: 0 1.1rem !important; height: 50px; align-content: center; margin-bottom: 2.2rem !important;" accept="image/*">
                <input type="hidden" id="avatarUrlInput" value="${avatarPreviewDataUrl || avatar || ''}">
            </div>
        </div>
        <div class="mb-3 text-center">
            <div>
                <label class="form-label d-block" style="margin-bottom:1.2rem;">Assinatura</label>
                ${(assinaturaPreviewDataUrl || assinaturaPath) ? `<div><img src="${assinaturaPreviewDataUrl || assinaturaPath}" id="assinaturaPreview" class="mb-2" style="width:220px;height:110px;object-fit:contain;border:2px solid #FF6F00;background:#fff;"></div>` : ''}
                <input type="file" class="form-control mb-2" id="assinaturaInput" style="padding: 0 1.1rem !important; height: 50px; align-content: center; margin-bottom:2.2rem !important;" accept="image/png">
                <input type="hidden" id="assinaturaUrlInput" value="${assinaturaPreviewDataUrl || assinaturaPath || ''}">
            </div>
        </div>
        <div class="mb-3" style="margin-top:2.2rem;">
            <label class="form-label">Nome da Empresa</label>
            <input type="text" class="form-control" id="editNome" value="${nomeFantasia}">
        </div>
                <div class="mb-3">
                    <label class="form-label">Nome da Empresa</label>
                    <input type="text" class="form-control" id="editNome" value="${nomeFantasia}">
                </div>
                <div class="mb-3">
                    <label class="form-label">Área de atuação</label>
                    <input type="text" class="form-control" id="editCargo" value="${areaatuacao}">
                </div>
                <div class="mb-3">
                    <label class="form-label">E-mail de contato</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="bi bi-envelope"></i></span>
                        <input type="text" class="form-control no-margin" id="editEmail" placeholder="E-mail" value="${emailContato}">
                    </div>
                    <div id="editEmailError"></div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Telefone de contato</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="bi bi-whatsapp"></i></span>
                        <input type="text" class="form-control no-margin" id="editTelefone" placeholder="Telefone/WhatsApp" value="${telefoneContato}">
                    </div>
                    <div id="editTelefoneError"></div>
                </div>
                <div class="mb-3">
                    <label class="form-label">LinkedIn</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="bi bi-linkedin"></i></span>
                        <input type="text" class="form-control no-margin" id="editLinkedin" placeholder="LinkedIn URL" value="${linkedin}">
                    </div>
                    <div id="editLinkedinError"></div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Site</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="bi bi-globe"></i></span>
                        <input type="text" class="form-control no-margin" id="editSite" placeholder="Site URL" value="${site}">
                    </div>
                    <div id="editSiteError"></div>
                </div>
            `;
            break;
        case 'sobre':
            title.textContent = 'Editar Sobre';
            html = `
                <div class="mb-3">
                    <label class="form-label">Sobre</label>
                    <textarea class="form-control" id="editSobre" rows="5">${descricao}</textarea>
                </div>
            `;
            break;
        default:
            title.textContent = 'Editar';
            html = '';
    }
    fields.innerHTML = html;

    // Avatar e assinatura preview ao selecionar arquivo
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
                    avatarPreviewDataUrl = ev.target.result; // Armazena o dado da URL para envio posterior
                    avatarUrlInput.value = ev.target.result; // Atualiza o campo hidden
                };
                reader.readAsDataURL(file);
                avatarInput._selectedFile = file; // Guarda o arquivo para upload posterior
            }
        });
        // Assinatura preview ao selecionar arquivo
        const assinaturaInput = document.getElementById('assinaturaInput');
        const assinaturaPreview = document.getElementById('assinaturaPreview');
        const assinaturaUrlInput = document.getElementById('assinaturaUrlInput');
        assinaturaInput.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (file) {
                if (file.type !== 'image/png') {
                    showModalAssinaturaPng();
                    assinaturaInput.value = '';
                    assinaturaInput._selectedFile = null;
                    assinaturaPreviewDataUrl = '';
                    assinaturaUrlInput.value = '';
                    assinaturaPreview.src = 'assets/img/default-signature.png';
                    return;
                }
                const reader = new FileReader();
                reader.onload = function (ev) {
                    assinaturaPreview.src = ev.target.result;
                    assinaturaPreviewDataUrl = ev.target.result;
                    assinaturaUrlInput.value = ev.target.result;
                };
                reader.readAsDataURL(file);
                assinaturaInput._selectedFile = file; // Guarda o arquivo para upload posterior
            } else {
                assinaturaPreview.src = assinaturaPath || 'assets/img/default-signature.png';
            }
        });

// Função para mostrar modal de erro de assinatura PNG
function showModalAssinaturaPng() {
    let modal = document.getElementById('assinaturaPngModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'assinaturaPngModal';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100vw';
        modal.style.height = '100vh';
        modal.style.background = 'rgba(0,0,0,0.5)';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.zIndex = '9999';
        modal.innerHTML = `
            <div style="background:#fff;padding:2rem 2.5rem;border-radius:1rem;min-width:320px;max-width:90vw;text-align:center;box-shadow:0 2px 16px #0002;">
                <h5 style="color:#FF6F00;font-weight:700;">Atenção</h5>
                <p style="margin:1.5rem 0 2rem 0;">O arquivo de assinatura deve estar no formato de PNG.</p>
                <button id="closeAssinaturaPngModal" class="btn btn-warning" style="font-weight:700;min-width:120px;">OK</button>
            </div>
        `;
        document.body.appendChild(modal);
        document.getElementById('closeAssinaturaPngModal').onclick = function() {
            modal.style.display = 'none';
        };
    } else {
        modal.style.display = 'flex';
    }
}
        // Aplica máscara ao telefone
        const telefoneInput = document.getElementById('editTelefone');
        if (telefoneInput) aplicarMascaraTelefone(telefoneInput);
    }
}

// Abrir popup ao clicar em qualquer botão de edição
document.body.addEventListener('click', function (e) {
    const btn = e.target.closest('.edit-btn');
    if (btn) {
        const { overlay, popup } = getPopupElements();
        const type = btn.getAttribute('data-edit');
        currentPopupType = type;
        if (type === 'header') {
            avatarPreviewDataUrlBeforeEdit = avatarPreviewDataUrl;
            assinaturaPreviewDataUrlBeforeEdit = assinaturaPreviewDataUrl;
        }
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
getPopupElements().closeBtn.onclick = function() {
    closeOverlay();
    if (currentPopupType === 'header') {
        avatarPreviewDataUrl = avatarPreviewDataUrlBeforeEdit;
        assinaturaPreviewDataUrl = assinaturaPreviewDataUrlBeforeEdit;
        // Limpa o arquivo selecionado ao fechar/cancelar
        const avatarInput = document.getElementById('avatarInput');
        if (avatarInput) avatarInput._selectedFile = null;
        const assinaturaInput = document.getElementById('assinaturaInput');
        if (assinaturaInput) assinaturaInput._selectedFile = null;
    }
};
getPopupElements().overlay.onclick = function(e) {
    if (e.target === getPopupElements().overlay) {
        closeOverlay();
        if (currentPopupType === 'header') {
            avatarPreviewDataUrl = avatarPreviewDataUrlBeforeEdit;
            assinaturaPreviewDataUrl = assinaturaPreviewDataUrlBeforeEdit;
            // Limpa o arquivo selecionado ao fechar/cancelar
            const avatarInput = document.getElementById('avatarInput');
            if (avatarInput) avatarInput._selectedFile = null;
            const assinaturaInput = document.getElementById('assinaturaInput');
            if (assinaturaInput) assinaturaInput._selectedFile = null;
        }
    }
};

// Salvar alterações do popup apenas nas variáveis locais
document.getElementById('editForm').onsubmit = async function (e) {
    e.preventDefault();

    const popupTitle = document.getElementById('editPopupTitle').textContent;

    // Limpa mensagens de erro antigas
    ['editEmailError', 'editTelefoneError', 'editLinkedinError', 'editSiteError'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '';
    });

    if (popupTitle.includes('Sobre')) {
        descricao = document.getElementById('editSobre')?.value.trim() || '';
    } else {
        // Validação dos campos
        let hasError = false;
        const emailVal = document.getElementById('editEmail')?.value.trim() || '';
        const telefoneVal = document.getElementById('editTelefone')?.value.trim() || '';
        const linkedinVal = document.getElementById('editLinkedin')?.value.trim() || '';
        const siteVal = document.getElementById('editSite')?.value.trim() || '';

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const telRegex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
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
            el.textContent = msg || '';
        }

        if (emailVal && !emailRegex.test(emailVal)) {
            setError('editEmailError', 'E-mail inválido.');
            hasError = true;
        }
        if (telefoneVal && !telRegex.test(telefoneVal.replace(/\s/g, ''))) {
            setError('editTelefoneError', 'Telefone inválido.');
            hasError = true;
        }
        if (linkedinVal && linkedinVal !== "#" && !urlRegex.test(linkedinVal)) {
            setError('editLinkedinError', 'LinkedIn URL inválido.');
            hasError = true;
        }
        if (siteVal && siteVal !== "#" && !urlRegex.test(siteVal)) {
            setError('editSiteError', 'Site URL inválido.');
            hasError = true;
        }
        if (hasError) return false;

        // Salva normalmente se não houver erro
        const avatarPreview = document.getElementById('avatarPreview');
        if (avatarPreview) {
            avatarPreviewDataUrl = avatarPreview.src;
        }
        const assinaturaPreview = document.getElementById('assinaturaPreview');
        if (assinaturaPreview) {
            assinaturaPreviewDataUrl = assinaturaPreview.src;
        }
        nomeFantasia = document.getElementById('editNome')?.value || '';
        areaatuacao = document.getElementById('editCargo')?.value || '';
        emailContato = emailVal;
        telefoneContato = telefoneVal;
        linkedin = formatarUrl(linkedinVal);
        site = formatarUrl(siteVal);
    }

    renderEmpresaProfile();
    closeOverlay();
};

// Ao clicar em "Aplicar Alterações", envia para o backend
document.getElementById('btnAplicarAlteracoes').onclick = async function () {
    // Se houver um novo arquivo selecionado, faça o upload agora
    if (document.getElementById('avatarInput')?._selectedFile) {
        const file = document.getElementById('avatarInput')._selectedFile;
        const formData = new FormData();
        formData.append('file', file);
        if (avatar) {
            formData.append('oldFile', avatar);
        }
        const resp = await fetch('/api/files/upload', {
            method: 'POST',
            body: formData
        });
        if (resp.ok) {
            avatar = await resp.text(); // Atualiza o avatar com a URL real
            avatarPreviewDataUrl = '';
        } else {
            alert('Erro ao enviar imagem');
            return;
        }
    }

    // Se houver um novo arquivo de assinatura selecionado, faça o upload agora
    if (document.getElementById('assinaturaInput')?._selectedFile) {
        const file = document.getElementById('assinaturaInput')._selectedFile;
        const formData = new FormData();
        formData.append('file', file);
        if (assinaturaPath) {
            formData.append('oldFile', assinaturaPath);
        }
        const resp = await fetch('/empresa/upload-assinatura', {
            method: 'POST',
            body: formData
        });
        if (resp.ok) {
            assinaturaPath = await resp.text(); // Atualiza o path da assinatura
            assinaturaPreviewDataUrl = '';
        } else {
            alert('Erro ao enviar assinatura');
            return;
        }
    }

    const dto = {
       nomeFantasia,
        areaAtuacao: areaatuacao,
        avatar,
        emailContato,
        telefoneContato,
        linkedin,
        site,
        bio: descricao,
        assinaturaPath
    };
    const resp = await fetch('/empresa/perfil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
    });
    if (resp.ok) {
        alert('Perfil atualizado com sucesso!');
        carregarPerfilEmpresa();
        window.location.href = '/pagina-profile-empresa';
    } else {
        alert('Erro ao atualizar perfil');
    }
};

function calcularProgressoEmpresa() {
    // Campos obrigatórios para o perfil estar completo, incluindo assinatura
    const campos = [
        { nome: 'Nome da Empresa', valor: nomeFantasia },
        { nome: 'Atuação', valor: areaatuacao },
        { nome: 'Avatar', valor: avatar },
        { nome: 'E-mail de contato', valor: emailContato },
        { nome: 'Telefone de contato', valor: telefoneContato },
        { nome: 'LinkedIn', valor: linkedin },
        { nome: 'Site', valor: site },
        { nome: 'Sobre', valor: descricao },
        { nome: 'Assinatura', valor: assinaturaPath }
    ];
    const preenchidos = campos.filter(c => c.valor && c.valor.trim() !== '');
    const percent = Math.round((preenchidos.length / campos.length) * 100);
    const faltando = campos.filter(c => !c.valor || c.valor.trim() === '').map(c => c.nome);
    return { percent, faltando };
}

function atualizarBarraProgressoEmpresa() {
    const { percent, faltando } = calcularProgressoEmpresa();
    const bar = document.getElementById('empresaProfileProgressBar');
    const percentSpan = document.getElementById('empresaProfileProgressPercent');
    const missingList = document.getElementById('empresaProfileMissingFields');
    if (bar) {
        bar.style.width = percent + '%';
        bar.textContent = percent + '%';
    }
    if (percentSpan) percentSpan.textContent = percent + '%';
    if (missingList) {
        missingList.innerHTML = '';
        faltando.forEach(f => {
            const li = document.createElement('li');
            li.textContent = f;
            missingList.appendChild(li);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    carregarPerfilEmpresa();
    atualizarBarraProgressoEmpresa();
});

// Função para garantir que o link tenha http:// ou https://
function formatarUrl(url) {
    if (!url) return '';
    if (!/^https?:\/\//i.test(url)) {
        return 'http://' + url;
    }
    return url;
}