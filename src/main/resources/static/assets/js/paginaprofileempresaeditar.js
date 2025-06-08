// Variáveis globais para os dados do perfil
let nomeFantasia = '';
let bio = '';
let avatar = '';
let email = '';
let telefone = '';
let linkedin = '';
let site = '';
let descricao = '';

// Variável para armazenar o preview da imagem do avatar
let avatarPreviewDataUrl = '';

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
    bio = data.bio || '';
    avatar = data.avatar || '';
    email = data.email || '';
    telefone = data.telefone || '';
    linkedin = data.linkedin || '';
    site = data.site || '';
    descricao = data.descricao || '';
    renderEmpresaProfile();
}

// Renderiza o perfil na tela usando as variáveis
function renderEmpresaProfile() {
    document.querySelector('.profile-header').innerHTML = `
        <button class="btn btn-edit-icon edit-btn position-absolute top-0 end-0 m-2" data-edit="header" title="Editar"><i class="bi bi-pencil-square"></i></button>
        <img src="${avatarPreviewDataUrl || avatar || 'assets/img/default-avatar.png'}" class="profile-avatar" alt="Logo da Empresa">
        <div class="profile-info">
            <h2>${nomeFantasia}</h2>
            <div class="role mb-1">${bio}</div>
            <div class="profile-contact mt-2">
                <div><i class="bi bi-envelope"></i><span>${email}</span></div>
                <div><i class="bi bi-telephone"></i><span>${telefone}</span></div>
            </div>
            <div class="profile-social mt-3">
                <a href="${linkedin || '#'}" target="_blank"><i class="bi bi-linkedin"></i></a>
                <a href="${site || '#'}" target="_blank"><i class="bi bi-globe"></i></a>
            </div>
        </div>
    `;
    document.getElementById('empresaSobre').innerHTML = descricao;
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
            <img src="${avatarPreviewDataUrl || avatar || 'assets/img/default-avatar.png'}" id="avatarPreview" class="rounded-circle mb-2" style="width:90px;height:90px;object-fit:contain;border:3px solid #FF6F00;background:#fff;">
            <div>
                <label class="form-label d-block">Logo</label>
                <input type="file" class="form-control mb-2" id="avatarInput" accept="image/*">
                <input type="hidden" id="avatarUrlInput" value="${avatar}">
            </div>
        </div>
                <div class="mb-3">
                    <label class="form-label">Nome da Empresa</label>
                    <input type="text" class="form-control" id="editNome" value="${nomeFantasia}">
                </div>
                <div class="mb-3">
                    <label class="form-label">Bio</label>
                    <input type="text" class="form-control" id="editCargo" value="${bio}">
                </div>
                <div class="mb-3">
                    <label class="form-label">E-mail</label>
                    <input type="text" class="form-control" id="editEmail" value="${email}">
                </div>
                <div class="mb-3">
                    <label class="form-label">Telefone</label>
                    <input type="text" class="form-control" id="editTelefone" value="${telefone}">
                </div>
                <div class="mb-3">
                    <label class="form-label">LinkedIn</label>
                    <input type="text" class="form-control" id="editLinkedin" value="${linkedin}">
                </div>
                <div class="mb-3">
                    <label class="form-label">Site</label>
                    <input type="text" class="form-control" id="editSite" value="${site}">
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
                    avatarPreviewDataUrl = ev.target.result; // Armazena o dado da URL para envio posterior
                };
                reader.readAsDataURL(file);
                avatarInput._selectedFile = file; // Guarda o arquivo para upload posterior
            }
        });
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

    // Limpa o preview local ao fechar o popup
    avatarPreviewDataUrl = '';
}
getPopupElements().overlay.onclick = closeOverlay;
getPopupElements().closeBtn.onclick = closeOverlay;

// Salvar alterações do popup apenas nas variáveis locais
document.getElementById('editForm').onsubmit = async function (e) {
    e.preventDefault();

    const popupTitle = document.getElementById('editPopupTitle').textContent;

    if (popupTitle.includes('Sobre')) {
        descricao = document.getElementById('editSobre')?.value || descricao;
    } else {
        // Se um novo arquivo foi selecionado, só salva o preview local
        const avatarInput = document.getElementById('avatarInput');
        if (avatarInput && avatarInput._selectedFile) {
            // Pega o preview local já gerado
            avatarPreviewDataUrl = document.getElementById('avatarPreview').src;
        }
        nomeFantasia = document.getElementById('editNome')?.value || '';
        bio = document.getElementById('editCargo')?.value || '';
        email = document.getElementById('editEmail')?.value || '';
        telefone = document.getElementById('editTelefone')?.value || '';
        linkedin = document.getElementById('editLinkedin')?.value || '';
        site = document.getElementById('editSite')?.value || '';
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
            avatarPreviewDataUrl = ''; // Limpa o preview local
        } else {
            alert('Erro ao enviar imagem');
            return;
        }
    }

    const dto = {
        nomeFantasia,
        bio,
        avatar,
        email,
        telefone,
        linkedin,
        site,
        descricao
    };
    const resp = await fetch('/empresa/perfil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
    });
    if (resp.ok) {
        alert('Perfil atualizado com sucesso!');
        carregarPerfilEmpresa();
    } else {
        alert('Erro ao atualizar perfil');
    }
};

function calcularProgressoEmpresa() {
    // Campos obrigatórios para o perfil estar completo
    const campos = [
        { nome: 'Nome da Empresa', valor: nomeFantasia },
        { nome: 'Bio', valor: bio },
        { nome: 'Avatar', valor: avatar },
        { nome: 'E-mail', valor: email },
        { nome: 'Telefone', valor: telefone },
        { nome: 'LinkedIn', valor: linkedin },
        { nome: 'Site', valor: site },
        { nome: 'Sobre', valor: descricao }
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