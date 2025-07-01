// Novo modelo JSON sem statusProcesso
const projetoId = document.body.getAttribute('data-projeto-id');
console.log('projetoId:', projetoId);

let projeto = {};

async function carregarDetalhesDoProjeto() {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('/projetos/' + projetoId, {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
        if (!response.ok) throw new Error('Erro ao buscar projeto');
        const data = await response.json();
        console.log('Dados do projeto:', data);

        // Verifica o status do projeto
        if ((data.status || '').toUpperCase() !== 'ABERTO') {
            document.body.innerHTML = `
                <div class="d-flex flex-column justify-content-center align-items-center vh-100 bg-dark text-white">
                    <h2>Esta vaga não está mais disponível.</h2>
                </div>
            `;
            return;
        }

        // Adapte conforme o formato retornado pela API
        projeto = {
            titulo: data.titulo,
            empresa: data.empresa,
            status: data.status, // ajuste conforme o campo correto
            requisitos: data.requisitos ? data.requisitos.split(',') : [],
            duracao: data.duracao + ' meses',
            descricao: data.descricao,
            grau: data.grauexperience,
            pagamento: data.orcamento,
            anexo: data.anexoAuxiliar
                ? {
                    // Pega o que vem depois do primeiro "_"
                    nome: (() => {
                        const nomeArquivo = data.anexoAuxiliar.split('/').pop();
                        const idx = nomeArquivo.indexOf('_');
                        return idx !== -1 ? nomeArquivo.substring(idx + 1) : nomeArquivo;
                    })(),
                    url: '/uploads/' + data.anexoAuxiliar.split('/').pop() // ajuste conforme sua rota real
                }
                : null,
            emailPraContato: data.emailPraContato,
            site: data.site,
            publicada: convertDate(data.dataCriacao) 
        };
    } catch (e) {
        console.error(e);
    }
}

console.log('projeto:', projeto);

function convertDate(dateString) {
    return dateString.substring(8, 10) + "/" + dateString.substring(5, 7) + "/" + dateString.substring(0, 4);
}


// Preenche o header principal do projeto
function preencherProjeto(projeto) {
    document.getElementById('projectHeader').innerHTML = `
        <div class="d-flex align-items-center mb-3">
            <img src="/assets/img/Captura_de_tela_2025-05-16_211248-removebg-preview.png" class="company-logo me-3" alt="Logo da Empresa">
            <div>
                <h1 class="fw-bold mb-1">${projeto.titulo}</h1>
                <span class="fs-5 fw-semibold">${projeto.empresa}</span>
                <div class="project-meta mt-1"><i class="bi bi-clock"></i> Publicado em ${projeto.publicada}</div>
            </div>
        </div>
        <div class="project-extra-info row">
            <div class="col-md-4">
                <div class="info-label"><i class="bi bi-person-badge"></i> Grau</div>
                <div class="info-value">${projeto.grau}</div>
            </div>
            <div class="col-md-4">
                <div class="info-label"><i class="bi bi-cash-coin"></i> Pagamento</div>
                <div class="info-value">${projeto.pagamento}</div>
            </div>
            <div class="col-md-4">
                <div class="info-label"><i class="bi bi-hourglass-split"></i> Duração</div>
                <div class="info-value">${projeto.duracao}</div>
            </div>
        </div>
        <div class="section-title mt-4"><i class="bi bi-code-slash"></i> Requisitos</div>
        <div class="mb-3">
            ${projeto.requisitos.map(tec => `<span class="badge badge-tech">${tec}</span>`).join('')}
        </div>
        <div class="section-title">Descrição do Projeto</div>
        <p class="fs-5 text-muted" id="descricaoProjeto"></p>
        <div class="project-anexo">
            <i class="bi bi-paperclip"></i>
            <strong>Anexo:</strong>
            ${
                projeto.anexo && projeto.anexo.nome
                    ? `<a href="${projeto.anexo.url}" class="link-light text-decoration-underline" target="_blank">${projeto.anexo.nome}</a>`
                    : '<span class="text-muted">Nenhum anexo</span>'
            }
        </div>
    `;

    const descricaoFormatada = projeto.descricao
        ? projeto.descricao.replace(/\n/g, '<br>')
        : '';

    document.getElementById('descricaoProjeto').innerHTML = descricaoFormatada;

    // ...após carregar os dados do projeto...
    document.getElementById('contatoEmail').innerHTML = `<i class="bi bi-envelope"></i> ${projeto.emailPraContato || 'Não informado'}`;
    document.getElementById('contatoSite').innerHTML = `<i class="bi bi-globe"></i> ${projeto.site || 'Não informado'}`;
}

// Preenche o resumo lateral
function preencherSidebar(projeto) {
    // Verifica o tipo de usuário no localStorage
    const tipoUsuario = localStorage.getItem('tipoUsuario');
    let candidaturaBtn = '';
    if (tipoUsuario === 'FREELANCER') {
        candidaturaBtn = `<a href="#" class="btn btn-info w-100 apply-btn shadow mt-4">Candidatar-se</a>`;
    }

    document.getElementById('sidebarResumo').innerHTML = `
        <h5 class="fw-bold mb-3">Resumo do Projeto</h5>
        <ul class="list-unstyled mb-3">
            <li><strong>Status:</strong> <span class="project-status">${projeto.status}</span></li>
            <li><strong>Empresa:</strong> ${projeto.empresa}</li>
            <li><strong>Duração:</strong> ${projeto.duracao}</li>
            <li><strong>Pagamento:</strong> ${projeto.pagamento}</li>
            <li><strong>Grau:</strong> ${projeto.grau}</li>
        </ul>
        <div class="mb-3">
            ${projeto.requisitos.slice(0, 3).map(tec => `<span class="badge badge-tech">${tec}</span>`).join('')}
        </div>
        ${candidaturaBtn}
    `;
}

document.addEventListener('click', async function (e) {
    // Verifica se clicou no botão "Candidatar-se"
    if (e.target.classList.contains('apply-btn')) {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            alert('Você precisa estar logado para se candidatar.');
            return;
        }

        const projetoId = document.body.getAttribute('data-projeto-id');
        const body = {
            projetoId: Number(projetoId),
            mensagem: "Tenho interesse nesta oportunidade!"
        };

        try {
            const response = await fetch('http://localhost:8080/candidaturas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                alert('Candidatura enviada com sucesso!');
            } else {
                const data = await response.json();
                alert(data.message || 'Erro ao enviar candidatura.');
            }
        } catch (err) {
            alert('Erro ao conectar ao servidor.');
            console.error(err);
        }
    }
});

function renderEditarVagaBtn(projeto) {
    const tipoUsuario = localStorage.getItem('tipoUsuario');
    const editarVagaDiv = document.getElementById('editarVagaContainer');
    if (editarVagaDiv && projeto.status && projeto.status.toUpperCase() === 'ABERTO') {
        if (tipoUsuario === 'EMPRESA') {
            editarVagaDiv.innerHTML = `
                <button id="btnAbrirModalEditarVaga" class="btn btn-warning w-100 mt-3">
                    <i class="bi bi-pencil-square"></i> Editar Vaga
                </button>
            `;
            document.getElementById('btnAbrirModalEditarVaga').onclick = function() {
                openEditVagaPopup(projeto);
            };
        } else {
            editarVagaDiv.innerHTML = '';
        }
    } else if (editarVagaDiv) {
        editarVagaDiv.innerHTML = '';
    }
}

// Inicialização
async function inicializar() {
    await carregarDetalhesDoProjeto();
    preencherProjeto(projeto);
    preencherSidebar(projeto);
    renderEditarVagaBtn(projeto);
}
inicializar();

document.getElementById('formEditarVaga').onsubmit = async function(e) {
    e.preventDefault();
    const duracao = document.getElementById('editDuracao').value;
    const emailContato = document.getElementById('editEmailContato').value;
    const grau = document.getElementById('editGrau').value;
    const anexoInput = document.getElementById('editAnexo');
    const token = localStorage.getItem('token');

    // Monta objeto para envio
    const body = {
        duracao,
        emailPraContato: emailContato,
        grau,
        anexoAuxiliar: anexoInput.files.length > 0 ? anexoInput.files[0].name : null
    };

    // Se houver arquivo, faz upload separado (seguindo o modelo do profile empresa)
    if (anexoInput.files.length > 0) {
        const formData = new FormData();
        formData.append('file', anexoInput.files[0]);
        // Se já existe anexo anterior, envie o nome dele para o backend apagar
        if (projeto.anexo) {
            // Se projeto.anexo for string (nome/caminho), envie direto
            // Se for objeto, ajuste para projeto.anexo.nome
            formData.append('oldFile', typeof projeto.anexo === 'string' ? projeto.anexo : projeto.anexo.nome);
        }
        const resp = await fetch(`/api/files/upload`, {
            method: 'POST',
            body: formData
        });
        if (resp.ok) {
            body.anexoAuxiliar = await resp.text(); // ou await resp.json() se backend retornar objeto
        } else {
            alert('Erro ao enviar arquivo');
            return;
        }
    } else {
        // Se não anexou novo arquivo, mantenha o atual
        body.anexoAuxiliar = projeto.anexo || null;
    }

    // Envia atualização do projeto
    const resp = await fetch(`/projetos/${projetoId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(body)
    });

    if (resp.ok) {
        // Atualiza campo "Atualizado em"
        const agora = new Date();
        const atualizadoEm = agora.toLocaleString('pt-BR');
        document.getElementById('campoAtualizadoEm').textContent = `Atualizado em: ${atualizadoEm}`;
        alert('Vaga atualizada com sucesso!');
        // Opcional: recarregar detalhes do projeto
        await carregarDetalhesDoProjeto();
        preencherProjeto(projeto);
        preencherSidebar(projeto);
        renderEditarVagaBtn(projeto);
        // Fecha modal
        closeEditVagaPopup();
    } else {
        alert('Erro ao atualizar vaga');
    }
};

function openEditVagaPopup(projeto) {
    // Preenche campos do modal
    document.getElementById('editDuracao').value = parseInt(projeto.duracao) || '';
    document.getElementById('editEmailContato').value = projeto.emailPraContato || '';
    document.getElementById('editGrau').value = projeto.grau || 'Júnior';
    document.getElementById('anexoAtual').innerHTML = projeto.anexo && projeto.anexo.nome
        ? `<span class="text-info">Atual: <a href="${projeto.anexo.url}" target="_blank">${projeto.anexo.nome}</a></span>`
        : '<span class="text-muted">Nenhum anexo</span>';
    document.getElementById('campoAtualizadoEm').textContent = projeto.atualizadoEm
        ? `Atualizado em: ${projeto.atualizadoEm}`
        : '';
    document.getElementById('editAnexo').value = '';

    document.getElementById('editVagaOverlay').style.display = 'flex';
    document.getElementById('editVagaPopup').style.display = 'block';
}

function closeEditVagaPopup() {
    document.getElementById('editVagaOverlay').style.display = 'none';
    document.getElementById('editVagaPopup').style.display = 'none';
}

// Botão de abrir
document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'btnAbrirModalEditarVaga') {
        openEditVagaPopup(projeto);
    }
});

// Certifique-se de que o DOM já carregou
document.addEventListener('DOMContentLoaded', function() {
    // Botão de fechar
    const btnClose = document.getElementById('closeEditVagaPopup');
    if (btnClose) {
        btnClose.onclick = closeEditVagaPopup;
    }

    // Fechar ao clicar fora do modal (no overlay)
    const overlay = document.getElementById('editVagaOverlay');
    if (overlay) {
        overlay.onclick = function(e) {
            // Fecha só se clicar diretamente no overlay, não no conteúdo do modal
            if (e.target === overlay) closeEditVagaPopup();
        };
    }
});