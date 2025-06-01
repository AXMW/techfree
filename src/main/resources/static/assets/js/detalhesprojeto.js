// Novo modelo JSON sem statusProcesso
const projeto = {
    titulo: "Plataforma de Gestão de Projetos Integrados",
    empresa: "TechFree",
    status: "Aberto",
    grau: "Pleno",
    pagamento: "R$ 5.000,00",
    dataInicio: "01/06/2025",
    duracao: "3 meses",
    dataLimite: "01/09/2025",
    requisitos: ["React", "Node.js", "Bootstrap 5", "MongoDB", "Git/GitHub", "Figma"],
    descricao: `
        Desenvolva uma plataforma web para conectar empresas, estudantes e instituições de ensino, facilitando a gestão de projetos integrados, acompanhamento de entregas e geração de certificados. O projeto visa criar um ambiente moderno, seguro e intuitivo, promovendo a colaboração e o desenvolvimento de competências práticas.<br><br>
        <strong>Diferenciais:</strong>
        <ul>
            <li>Experiência com TypeScript e testes automatizados;</li>
            <li>Conhecimento em UX/UI e Figma;</li>
            <li>Participação em hackathons ou projetos open source;</li>
        </ul>
        <strong>Benefícios:</strong>
        <ul>
            <li>Certificação válida como estágio;</li>
            <li>Mentoria com profissionais do mercado;</li>
            <li>Possibilidade de contratação ao final do projeto;</li>
            <li>Ambiente inovador e colaborativo;</li>
            <li>Flexibilidade de horários.</li>
        </ul>
        <strong>Informações Adicionais:</strong>
        <ul>
            <li>Empresa com cultura de inovação e diversidade.</li>
            <li>Dress code casual.</li>
            <li>Política de diversidade ativa.</li>
            <li>Plano de carreira acelerado.</li>
        </ul>
    `,
    publicada: "18/05/2025",
    anexo: {
        nome: "Briefing_Plataforma.pdf",
        url: "#"
    },
    publicador: {
        nome: "Marina Souza",
        cargo: "Gestora de Projetos",
        email: "marina@techfree.com"
    }
};

// Preenche o header principal do projeto
function preencherProjeto(projeto) {
    document.getElementById('projectHeader').innerHTML = `
        <div class="d-flex align-items-center mb-3">
            <img src="assets/img/Captura_de_tela_2025-05-16_211248-removebg-preview.png" class="company-logo me-3" alt="Logo da Empresa">
            <div>
                <h1 class="fw-bold mb-1">${projeto.titulo}</h1>
                <span class="fs-5 fw-semibold">${projeto.empresa}</span>
                <span class="project-status ms-2">${projeto.status}</span>
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
                <div class="info-label"><i class="bi bi-calendar-event"></i> Data de Início</div>
                <div class="info-value">${projeto.dataInicio}</div>
            </div>
            <div class="col-md-4">
                <div class="info-label"><i class="bi bi-hourglass-split"></i> Duração</div>
                <div class="info-value">${projeto.duracao}</div>
            </div>
            <div class="col-md-4">
                <div class="info-label"><i class="bi bi-calendar-check"></i> Data Limite</div>
                <div class="info-value">${projeto.dataLimite}</div>
            </div>
        </div>
        <div class="section-title mt-4"><i class="bi bi-code-slash"></i> Requisitos</div>
        <div class="mb-3">
            ${projeto.requisitos.map(tec => `<span class="badge badge-tech">${tec}</span>`).join('')}
        </div>
        <div class="section-title">Descrição do Projeto</div>
        <p class="fs-5 text-muted">${projeto.descricao}</p>
        <div class="project-anexo">
            <i class="bi bi-paperclip"></i>
            <strong>Anexo:</strong> <a href="${projeto.anexo.url}" class="link-light text-decoration-underline" target="_blank">${projeto.anexo.nome}</a>
        </div>
        <div class="project-publisher">
            <i class="bi bi-person-circle"></i>
            Publicado por <strong>${projeto.publicador.nome}</strong> (${projeto.publicador.cargo}) &nbsp; | &nbsp; <i class="bi bi-envelope"></i> ${projeto.publicador.email}
        </div>
    `;
}

// Preenche o resumo lateral
function preencherSidebar(projeto) {
    document.getElementById('sidebarResumo').innerHTML = `
        <h5 class="fw-bold mb-3">Resumo do Projeto</h5>
        <ul class="list-unstyled mb-3">
            <li><strong>Status:</strong> <span class="project-status">${projeto.status}</span></li>
            <li><strong>Empresa:</strong> ${projeto.empresa}</li>
            <li><strong>Data de Início:</strong> ${projeto.dataInicio}</li>
            <li><strong>Duração:</strong> ${projeto.duracao}</li>
            <li><strong>Data Limite:</strong> ${projeto.dataLimite}</li>
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
preencherProjeto(projeto);
preencherSidebar(projeto);