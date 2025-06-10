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
                // Só mostra "Enviar para revisão" se NÃO estiver em revisão
                if (statusUpper !== 'REVISAO') {
                    botoesHtml = `
                        <button class="btn btn-primary me-2" id="btnEnviarRevisao">Enviar para revisão</button>
                        <button class="btn btn-danger" id="btnFecharProjeto">Desistir</button>
                    `;
                } else {
                    botoesHtml = `
                        <button class="btn btn-danger" id="btnFecharProjeto">Desistir</button>
                    `;
                }
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
                btnEnviarRevisao.addEventListener('click', function () {
                    let modalConfirm = document.getElementById('modalConfirmarRevisao');
                    if (!modalConfirm) {
                        modalConfirm = document.createElement('div');
                        modalConfirm.className = 'modal fade';
                        modalConfirm.id = 'modalConfirmarRevisao';
                        modalConfirm.tabIndex = -1;
                        modalConfirm.innerHTML = `
                            <div class="modal-dialog modal-dialog-centered">
                              <div class="modal-content">
                                <div class="modal-header">
                                  <h5 class="modal-title">Confirmar envio para revisão</h5>
                                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                                </div>
                                <div class="modal-body">
                                  <p>Tem certeza que deseja <strong>enviar este projeto para revisão</strong>?</p>
                                </div>
                                <div class="modal-footer d-flex justify-content-center gap-2">
                                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                  <button type="button" class="btn btn-secondary" id="confirmarEnviarRevisao">Confirmar</button>
                                </div>
                              </div>
                            </div>
                        `;
                        document.body.appendChild(modalConfirm);
                    }
                    const modal = new bootstrap.Modal(modalConfirm);
                    modal.show();

                    const btnConfirmarAcao = document.getElementById('confirmarEnviarRevisao');
                    btnConfirmarAcao.replaceWith(btnConfirmarAcao.cloneNode(true));
                    const btnConfirmarAcaoNovo = document.getElementById('confirmarEnviarRevisao');
                    btnConfirmarAcaoNovo.addEventListener('click', async function () {
                        try {
                            const token = localStorage.getItem('token');
                            const resp = await fetch(`/projetos/${projetoId}/status/revisao`, {
                                method: 'PUT',
                                headers: {
                                    'Authorization': 'Bearer ' + token
                                }
                            });
                            if (!resp.ok) throw new Error('Erro ao enviar para revisão');
                            modal.hide();
                            location.reload();
                        } catch (e) {
                            alert('Erro ao enviar para revisão.');
                        }
                    });
                });
            }

            // Botão "Devolver" (EMPRESA)
            let quillDevolucao;

            const btnDevolverProjeto = div.querySelector('#btnDevolverProjeto');
            if (btnDevolverProjeto) {
                btnDevolverProjeto.addEventListener('click', function () {
                    const modal = new bootstrap.Modal(document.getElementById('modalDevolucao'));

                    // Inicializa o Quill apenas uma vez
                    if (!quillDevolucao) {
                        quillDevolucao = new Quill('#mensagemDevolucaoEditor', {
                            theme: 'snow',
                            modules: {
                                toolbar: [
                                    [{ 'font': [] }, { 'size': [] }],
                                    ['bold', 'italic', 'underline', 'strike'],
                                    [{ 'color': [] }, { 'background': [] }],
                                    [{ 'header': [1, 2, 3, false] }],
                                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                    [{ 'align': [] }],
                                    ['link'],
                                    ['clean']
                                ]
                            }
                        });
                    } else {
                        quillDevolucao.setText('');
                    }

                    modal.show();

                    // Confirma devolução
                    const btnConfirmar = document.getElementById('confirmarDevolucao');
                    btnConfirmar.replaceWith(btnConfirmar.cloneNode(true));
                    const btnConfirmarNovo = document.getElementById('confirmarDevolucao');
                    btnConfirmarNovo.addEventListener('click', async function () {
                        const mensagem = quillDevolucao.root.innerHTML.trim();
                        // Remove tags vazias e verifica se há conteúdo real
                        if (!mensagem || mensagem === '<p><br></p>') {
                            alert('Por favor, escreva o motivo da devolução.');
                            return;
                        }
                        try {
                            const token = localStorage.getItem('token');
                            const respStatus = await fetch(`/projetos/${projetoId}/status/em-andamento`, {
                                method: 'PUT',
                                headers: {
                                    'Authorization': 'Bearer ' + token
                                }
                            });
                            if (!respStatus.ok) throw new Error('Erro ao devolver projeto');

                            const agora = new Date();
                            const dataHora = agora.toLocaleString('pt-BR');
                            const descricaoAnterior = data.descricao || '';
                            const novaDescricao =
                                `<h4>Atualização - ${dataHora}</h4>` +
                                `<div style="font-size:1.15rem;">${mensagem}</div>` +
                                `<br><hr style="margin: 32px 0; border-top: 3px solid #ccc;"><br>` +
                                descricaoAnterior;

                            const respDescricao = await fetch(`/projetos/${projetoId}`, {
                                method: 'PUT',
                                headers: {
                                    'Authorization': 'Bearer ' + token,
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ descricao: novaDescricao })
                            });
                            if (!respDescricao.ok) throw new Error('Erro ao atualizar descrição');

                            modal.hide();
                            location.reload();
                        } catch (e) {
                            alert('Erro ao devolver projeto ou atualizar descrição.');
                        }
                    });
                });
            }

            // Botão "Fechar" ou "Cancelar" (EMPRESA) ou "Desistir" (FREELANCER)
            const btnFecharProjeto = div.querySelector('#btnFecharProjeto');
            if (btnFecharProjeto) {
                btnFecharProjeto.addEventListener('click', function () {
                    let modalConfirm = document.getElementById('modalConfirmarAcao');
                    if (!modalConfirm) {
                        modalConfirm = document.createElement('div');
                        modalConfirm.className = 'modal fade';
                        modalConfirm.id = 'modalConfirmarAcao';
                        modalConfirm.tabIndex = -1;

                        // Personaliza mensagem conforme ação
                        const texto = btnFecharProjeto.textContent.trim();
                        let acao = '';
                        if (texto === 'Fechar') acao = 'fechar o projeto';
                        else if (texto === 'Cancelar') acao = 'cancelar o projeto';
                        else if (texto === 'Desistir') acao = 'desistir deste projeto';
                        else acao = 'confirmar esta ação';

                        modalConfirm.innerHTML = `
                            <div class="modal-dialog modal-dialog-centered">
                              <div class="modal-content">
                                <div class="modal-header">
                                  <h5 class="modal-title">Confirmar ${texto.toLowerCase()}</h5>
                                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                                </div>
                                <div class="modal-body">
                                  <p>Tem certeza que deseja <strong>${acao}</strong>?</p>
                                </div>
                                <div class="modal-footer d-flex justify-content-center gap-2">
                                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                  <button type="button" class="btn btn-secondary" id="confirmarAcaoStatus">Confirmar</button>
                                </div>
                              </div>
                            </div>
                        `;
                        document.body.appendChild(modalConfirm);
                    } else {
                        // Atualiza mensagem se modal já existe
                        const texto = btnFecharProjeto.textContent.trim();
                        let acao = '';
                        if (texto === 'Fechar') acao = 'fechar o projeto';
                        else if (texto === 'Cancelar') acao = 'cancelar o projeto';
                        else if (texto === 'Desistir') acao = 'desistir deste projeto';
                        else acao = 'confirmar esta ação';
                        modalConfirm.querySelector('.modal-title').textContent = `Confirmar ${texto.toLowerCase()}`;
                        modalConfirm.querySelector('.modal-body p').innerHTML = `Tem certeza que deseja <strong>${acao}</strong>?`;
                    }
                    const modal = new bootstrap.Modal(modalConfirm);
                    modal.show();

                    const btnConfirmarAcao = document.getElementById('confirmarAcaoStatus');
                    btnConfirmarAcao.replaceWith(btnConfirmarAcao.cloneNode(true));
                    const btnConfirmarAcaoNovo = document.getElementById('confirmarAcaoStatus');
                    btnConfirmarAcaoNovo.addEventListener('click', async function () {
                        try {
                            const token = localStorage.getItem('token');
                            const texto = btnFecharProjeto.textContent.trim();
                            let endpoint = '';
                            if (tipoUsuario === 'FREELANCER' && texto === 'Desistir') {
                                endpoint = `/projetos/${projetoId}/status/cancelar`;
                            } else if (tipoUsuario === 'EMPRESA') {
                                if (texto === 'Cancelar') {
                                    endpoint = `/projetos/${projetoId}/status/cancelar`;
                                } else if (texto === 'Fechar') {
                                    endpoint = `/projetos/${projetoId}/status/concluir`;
                                }
                            }
                            if (!endpoint) return;
                            const resp = await fetch(endpoint, {
                                method: 'PUT',
                                headers: {
                                    'Authorization': 'Bearer ' + token
                                }
                            });
                            if (!resp.ok) throw new Error('Erro ao atualizar status');
                            modal.hide();
                            location.reload();
                        } catch (e) {
                            alert('Erro ao atualizar status do projeto.');
                        }
                    });
                });
            }
        }

        // ...após atualizarStepper(data.status);

        const cardsInstrucoes = document.querySelectorAll('.col-lg-8 .info-card');
        const cardInstrucoes = cardsInstrucoes[cardsInstrucoes.length - 1];
        if (cardInstrucoes) {
            // Remove o h5/h6 de título, se existir
            const h5 = cardInstrucoes.querySelector('h5, h6');
            if (h5) h5.remove();
            // Remove a ul, se existir
            const ul = cardInstrucoes.querySelector('ul');
            if (ul) ul.remove();

            const conteudoDiv = cardInstrucoes.querySelector('.descricao-instrucoes') || document.createElement('div');
            conteudoDiv.className = 'descricao-instrucoes';

            if ((data.status || '').toUpperCase() === 'CANCELADO') {
                cardInstrucoes.classList.add('cancelado');
                conteudoDiv.innerHTML = 'Este projeto foi cancelado e não está mais disponível para ações.';
            } else {
                cardInstrucoes.classList.remove('cancelado');
                // Mostra a descrição bruta, trocando \n por <br>
                if (data.descricao) {
                    conteudoDiv.innerHTML = data.descricao.replace(/\n/g, '<br>');
                } else {
                    conteudoDiv.innerHTML = 'Consulte a descrição do projeto para mais detalhes.';
                }
            }
            // Adiciona ou atualiza o conteúdo no card
            if (!cardInstrucoes.querySelector('.descricao-instrucoes')) {
                cardInstrucoes.appendChild(conteudoDiv);
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