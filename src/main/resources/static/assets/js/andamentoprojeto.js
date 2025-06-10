document.addEventListener('DOMContentLoaded', async function () {
    const projetoId = document.body.getAttribute('data-projeto-id');
    if (!projetoId) return;

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/projetos/${projetoId}`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
        if (!response.ok) throw new Error('Erro ao buscar projeto');
        const data = await response.json();

        // Se o status for ABERTO, mostra mensagem e não carrega o restante da tela
        if ((data.status || '').toUpperCase() === 'ABERTO') {
            document.body.innerHTML = `
                <div class="d-flex flex-column justify-content-center align-items-center vh-100 bg-dark text-white">
                    <h2>O projeto não está disponível</h2>
                </div>
            `;
            return;
        }

        // Preenche o header do projeto
        document.querySelector('.project-header .display-6').textContent = data.titulo || '';
        document.querySelector('.project-header .fs-5').textContent = data.subtitulo || '';
        document.querySelector('.project-header .fw-semibold').textContent = data.empresa || '';

        // Preenche detalhes do projeto na sidebar
        const sidebarCards = document.querySelectorAll('.col-lg-4 .info-card');
        if (sidebarCards.length > 0) {
            const detalhesUl = sidebarCards[0].querySelector('ul');
            if (detalhesUl) {
                detalhesUl.innerHTML = `
                    <li><strong>Status:</strong> <span class="badge ${getStatusBadgeClass(data.status)}">${formatarStatus(data.status)}</span></li>
                    <li><strong>Prazo:</strong> ${data.prazoEntrega ? formatarData(data.prazoEntrega) : 'A definir'}</li>
                    <li><strong>Tipo:</strong> Projeto Integrador</li>
                    <li><strong>Ferramentas:</strong> ${data.requisitos ? data.requisitos.split(',').join(', ') : ''}</li>
                `;
            }
        }

        // Preenche contato do orientador (exemplo: usando emailPraContato)
        if (sidebarCards.length > 1) {
            const orientadorCard = sidebarCards[1];
            const emailP = orientadorCard.querySelector('.bi-envelope').parentElement;
            const whatsappP = orientadorCard.querySelector('.bi-whatsapp').parentElement;
            if (emailP) {
                emailP.innerHTML = `<i class="bi bi-envelope"></i> ${data.emailPraContato || 'Não informado'}`;
            }
            if (whatsappP) {
                // Usa o telefoneEmpresa do endpoint
                whatsappP.innerHTML = `<i class="bi bi-whatsapp"></i> ${data.telefoneEmpresa || 'Não informado'}`;
            }
        }

        // Preenche instruções (opcional: pode customizar conforme status)
        atualizarStepper(data.status);

        // Adiciona botões conforme tipoUsuario
        const tipoUsuario = localStorage.getItem('tipoUsuario');
        let botoesHtml = '';
        const statusUpper = (data.status || '').toUpperCase();

        // Só mostra botões se NÃO estiver concluído ou cancelado
        if (statusUpper !== 'CONCLUIDO' && statusUpper !== 'CANCELADO') {
            const fecharTexto = statusUpper === 'REVISAO' ? 'Fechar' : 'Cancelar';
            if (tipoUsuario === 'EMPRESA') {
                if (statusUpper === 'REVISAO') {
                    botoesHtml = `
                        <button class="btn btn-danger me-2" id="btnFecharProjeto">${fecharTexto}</button>
                        <button class="btn btn-warning" id="btnDevolverProjeto">Devolver</button>
                    `;
                } else {
                    botoesHtml = `
                        <button class="btn btn-danger" id="btnFecharProjeto">${fecharTexto}</button>
                    `;
                }
            } else if (tipoUsuario === 'FREELANCER') {
                botoesHtml = `
                    <button class="btn btn-primary" id="btnEnviarRevisao">Enviar para revisão</button>
                `;
            }
        } else if (tipoUsuario === 'FREELANCER' && statusUpper !== 'CONCLUIDO' && statusUpper !== 'CANCELADO') {
            // Garantia extra para freelancer, mas já está coberto acima
            botoesHtml = `
                <button class="btn btn-primary" id="btnEnviarRevisao">Enviar para revisão</button>
            `;
        }

        // Seleciona o bloco de contato do orientador (segundo .info-card na sidebar)
        const infoCards = document.querySelectorAll('.col-lg-4 .info-card');
        const orientadorCard = infoCards[1]; // segundo .info-card
        if (orientadorCard && botoesHtml) {
            const div = document.createElement('div');
            div.className = 'mt-3 mb-3 text-center';
            div.innerHTML = botoesHtml;
            orientadorCard.parentNode.insertBefore(div, orientadorCard.nextSibling);

            // Adiciona eventos aos botões
            // Botão "Enviar para revisão" (FREELANCER)
            const btnEnviarRevisao = div.querySelector('#btnEnviarRevisao');
            if (btnEnviarRevisao) {
                btnEnviarRevisao.addEventListener('click', async function () {
                    try {
                        const token = localStorage.getItem('token');
                        const resp = await fetch(`/projetos/${projetoId}/status/revisao`, {
                            method: 'PUT',
                            headers: {
                                'Authorization': 'Bearer ' + token
                            }
                        });
                        if (!resp.ok) throw new Error('Erro ao enviar para revisão');
                        location.reload();
                    } catch (e) {
                        alert('Erro ao enviar para revisão.');
                    }
                });
            }

            // Botão "Devolver" (EMPRESA)
            const btnDevolverProjeto = div.querySelector('#btnDevolverProjeto');
            if (btnDevolverProjeto) {
                btnDevolverProjeto.addEventListener('click', async function () {
                    try {
                        const token = localStorage.getItem('token');
                        const resp = await fetch(`/projetos/${projetoId}/status/em-andamento`, {
                            method: 'PUT',
                            headers: {
                                'Authorization': 'Bearer ' + token
                            }
                        });
                        if (!resp.ok) throw new Error('Erro ao devolver projeto');
                        location.reload();
                    } catch (e) {
                        alert('Erro ao devolver projeto.');
                    }
                });
            }

            // Botão "Fechar" ou "Cancelar" (EMPRESA)
            const btnFecharProjeto = div.querySelector('#btnFecharProjeto');
            if (btnFecharProjeto) {
                btnFecharProjeto.addEventListener('click', async function () {
                    try {
                        const token = localStorage.getItem('token');
                        const texto = btnFecharProjeto.textContent.trim();
                        let endpoint = '';
                        if (texto === 'Cancelar') {
                            endpoint = `/projetos/${projetoId}/status/cancelar`;
                        } else if (texto === 'Fechar') {
                            endpoint = `/projetos/${projetoId}/status/concluir`;
                        }
                        if (!endpoint) return;
                        const resp = await fetch(endpoint, {
                            method: 'PUT',
                            headers: {
                                'Authorization': 'Bearer ' + token
                            }
                        });
                        if (!resp.ok) throw new Error('Erro ao atualizar status');
                        location.reload();
                    } catch (e) {
                        alert('Erro ao atualizar status do projeto.');
                    }
                });
            }
        }

        // ...após atualizarStepper(data.status);

        if ((data.status || '').toUpperCase() === 'CANCELADO') {
            // Seleciona o ÚLTIMO .info-card dentro de .col-lg-8 (card de instruções)
            const cardsInstrucoes = document.querySelectorAll('.col-lg-8 .info-card');
            const cardInstrucoes = cardsInstrucoes[cardsInstrucoes.length - 1];
            if (cardInstrucoes) {
                cardInstrucoes.classList.add('cancelado');
                // Opcional: mudar o texto do título e da lista
                const h5 = cardInstrucoes.querySelector('h5, h6');
                if (h5) h5.textContent = 'Projeto Cancelado';
                const ul = cardInstrucoes.querySelector('ul');
                if (ul) ul.innerHTML = '<li>Este projeto foi cancelado e não está mais disponível para ações.</li>';
            }
        }

    } catch (e) {
        console.error(e);
        document.querySelector('.container').innerHTML = `
            <div class="alert alert-danger mt-5 text-center">Erro ao carregar dados do projeto.</div>
        `;
    }
});

function formatarStatus(status) {
    switch ((status || '').toUpperCase()) {
        case 'ABERTO': return 'Oportunidade';
        case 'EM_ANDAMENTO': return 'Em andamento';
        case 'REVISAO': return 'Revisão';
        case 'CONCLUIDO': return 'Concluído';
        case 'CANCELADO': return 'Cancelado';
        default: return status || '';
    }
}

function formatarData(dataStr) {
    // Aceita "2025-06-09" ou "2025-06-06T21:33:30.72728"
    if (!dataStr) return '';
    const d = dataStr.length > 10 ? dataStr.substring(0, 10) : dataStr;
    const [ano, mes, dia] = d.split('-');
    return `${dia}/${mes}/${ano}`;
}

function atualizarStepper(status) {
    // Remove classes de todas as etapas
    const steps = document.querySelectorAll('.stepper .step');
    steps.forEach(step => {
        step.classList.remove('completed', 'active', 'canceled');
        // Remove texto customizado do último step, se houver
        const label = step.querySelector('.step-label');
        if (label && label.dataset.originalLabel) {
            label.textContent = label.dataset.originalLabel;
        }
    });

    switch ((status || '').toUpperCase()) {
        case 'ABERTO':
            steps[0].classList.add('active');
            break;
        case 'EM_ANDAMENTO':
            steps[0].classList.add('completed');
            steps[1].classList.add('active');
            break;
        case 'REVISAO':
            steps[0].classList.add('completed');
            steps[1].classList.add('completed');
            steps[2].classList.add('active');
            break;
        case 'CONCLUIDO':
            steps[0].classList.add('completed');
            steps[1].classList.add('completed');
            steps[2].classList.add('completed');
            steps[3].classList.add('completed');
            break;
        case 'CANCELADO':
            // Apenas o último step fica vermelho e com o texto "CANCELADO"
            const lastStep = steps[steps.length - 1];
            lastStep.classList.add('active', 'canceled');
            const label = lastStep.querySelector('.step-label');
            if (label) {
                if (!label.dataset.originalLabel) {
                    label.dataset.originalLabel = label.textContent;
                }
                label.textContent = 'CANCELADO';
            }
            break;
    }
}

function getStatusBadgeClass(status) {
    switch ((status || '').toUpperCase()) {
        case 'ABERTO': return 'bg-primary';
        case 'EM_ANDAMENTO': return 'bg-info';
        case 'REVISAO': return 'bg-warning text-dark';
        case 'CONCLUIDO': return 'bg-success';
        case 'CANCELADO': return 'bg-danger';
        default: return 'bg-secondary';
    }
}