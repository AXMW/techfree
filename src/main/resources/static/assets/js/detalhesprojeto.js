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
            anexo: {
                nome: "Briefing_Plataforma.pdf",
                url: "#"
            },
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
            <strong>Anexo:</strong> <a href="${projeto.anexo.url}" class="link-light text-decoration-underline" target="_blank">${projeto.anexo.nome}</a>
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
        <div class="project-anexo">
            <i class="bi bi-paperclip"></i>
            <strong>Anexo:</strong> <a href="${projeto.anexo.url}" target="_blank">${projeto.anexo.nome}</a>
        </div>
        <a href="#" class="btn btn-info w-100 apply-btn shadow mt-4">Candidatar-se</a>
    `;
}

// Inicialização
async function inicializar() {
    await carregarDetalhesDoProjeto();
    preencherProjeto(projeto);
    preencherSidebar(projeto);
}
inicializar();