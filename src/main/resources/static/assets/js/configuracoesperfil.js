document.addEventListener('DOMContentLoaded', async function () {
    const tipoUsuario = localStorage.getItem('tipoUsuario');
    const token = localStorage.getItem('token');
    if (!tipoUsuario || !token) return;

    // Seletores dos campos
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const btnSalvar = document.querySelector('#account-settings button[type="button"]');

    // Cria elementos para exibir erros se não existirem
    let emailError = document.getElementById('emailErrorConfig');
    if (!emailError && emailInput) {
        emailError = document.createElement('div');
        emailError.id = 'emailErrorConfig';
        emailError.classList.add('mt-1', 'mb-2', 'erro-senha');
        emailInput.parentNode.appendChild(emailError);
    }
    let phoneError = document.getElementById('phoneErrorConfig');
    if (!phoneError && phoneInput) {
        phoneError = document.createElement('div');
        phoneError.id = 'phoneErrorConfig';
        phoneError.classList.add('mt-1', 'mb-2', 'erro-senha');
        phoneInput.parentNode.appendChild(phoneError);
    }

    // Máscara para telefone (formato brasileiro)
    function maskPhone(value) {
        return value
            .replace(/\D/g, '')
            .replace(/^(\d{2})(\d)/g, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .replace(/(-\d{4})\d+?$/, '$1');
    }
    if (phoneInput) {
        phoneInput.addEventListener('input', function () {
            this.value = maskPhone(this.value);
        });
    }

    // Validação de email
    function validarEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    // Validação de telefone (mínimo 10 dígitos)
    function validarTelefone(telefone) {
        return /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/.test(telefone);
    }

    // Define endpoints conforme o tipo de usuário
    const urlGetPerfil = tipoUsuario === 'EMPRESA' ? '/empresa/perfil/verPerfil' : '/freelancer/perfil/verPerfil';
    const urlPutPerfil = tipoUsuario === 'EMPRESA' ? '/empresa/perfil' : '/freelancer/perfil';

    // Preenche os campos com os dados atuais
    try {
        const resp = await fetch(urlGetPerfil, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if (!resp.ok) throw new Error('Erro ao buscar perfil');
        const perfil = await resp.json();

        // Preenche campos
        if (emailInput) {
            emailInput.value = perfil.email || '';
            // Salve o email original para uso posterior
            localStorage.setItem('emailUsuario', perfil.email || '');
        }
        if (phoneInput) {
            phoneInput.value = perfil.telefone || '';
        }
    } catch (e) {
        console.error('Erro ao carregar perfil:', e);
    }

    // Adicione isso logo após a definição dos seletores, dentro do DOMContentLoaded
    let modalSenha = document.getElementById('modalConfirmarSenha');
    if (!modalSenha) {
        modalSenha = document.createElement('div');
        modalSenha.className = 'modal fade';
        modalSenha.id = 'modalConfirmarSenha';
        modalSenha.tabIndex = -1;
        modalSenha.innerHTML = `
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Confirme sua senha</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                </div>
                <div class="modal-body">
                  <input type="password" class="form-control" id="senhaConfirmacaoInput" placeholder="Digite sua senha" autocomplete="current-password">
                  <div id="senhaConfirmacaoFeedback" class="erro-senha mt-2 mb-0"></div>
                </div>
                <div class="modal-footer d-flex justify-content-center gap-2">
                  <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Cancelar</button>
                  <button type="button" class="btn btn-primary" id="btnConfirmarSenha">Confirmar</button>
                </div>
              </div>
            </div>
        `;
        document.body.appendChild(modalSenha);
    }

    // Salvar alterações
    if (btnSalvar) {
        btnSalvar.addEventListener('click', async function () {
            // Validação antes de pedir senha
            let erro = false;
            if (emailInput && !validarEmail(emailInput.value)) {
                emailError.textContent = 'Email inválido.';
                erro = true;
            } else if (emailError) {
                emailError.textContent = '';
            }
            if (phoneInput && !validarTelefone(phoneInput.value)) {
                phoneError.textContent = 'Telefone inválido. Ex: (11) 91234-5678';
                erro = true;
            } else if (phoneError) {
                phoneError.textContent = '';
            }
            if (erro) return;

            // Mostra o modal de senha
            const senhaInput = document.getElementById('senhaConfirmacaoInput');
            const senhaFeedback = document.getElementById('senhaConfirmacaoFeedback');
            senhaInput.value = '';
            senhaFeedback.textContent = '';
            const modal = new bootstrap.Modal(modalSenha);
            modal.show();

            // Remove event listeners antigos para evitar múltiplos envios
            const btnConfirmarSenha = document.getElementById('btnConfirmarSenha');
            btnConfirmarSenha.replaceWith(btnConfirmarSenha.cloneNode(true));
            const btnConfirmarSenhaNovo = document.getElementById('btnConfirmarSenha');

            btnConfirmarSenhaNovo.addEventListener('click', async function () {
                const senha = senhaInput.value;
                if (!senha) {
                    senhaFeedback.textContent = 'Digite sua senha.';
                    return;
                }
                // 1. Verifica a senha com o email antigo
                const emailAntigo = localStorage.getItem('emailUsuario') || emailInput.value;
                try {
                    const loginResp = await fetch('/auth/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: emailAntigo, senha: senha })
                    });
                    if (loginResp.ok) {
                        senhaFeedback.textContent = '';
                        modal.hide();

                        // 2. Faz a alteração do perfil
                        let body = {
                            telefone: phoneInput.value,
                            email: emailInput.value
                        };

                        try {
                            const resp = await fetch(urlPutPerfil, {
                                method: 'PUT',
                                headers: {
                                    'Authorization': 'Bearer ' + token,
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(body)
                            });
                            if (!resp.ok) throw new Error('Erro ao atualizar perfil');
                            alert('Perfil atualizado com sucesso!');

                            // 3. Se o email foi alterado, faz login com o novo email
                            if (emailInput.value !== emailAntigo) {
                                async function tentarLoginNovoEmail(email, senha, tentativas = 10, delayMs = 1000) {
                                    for (let i = 0; i < tentativas; i++) {
                                        // Aguarda o delay ANTES da tentativa, inclusive na primeira
                                        if (delayMs > 0) await new Promise(r => setTimeout(r, delayMs));
                                        const loginResp2 = await fetch('/auth/login', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ email, senha })
                                        });
                                        if (loginResp2.ok) {
                                            const data = await loginResp2.json();
                                            if (data.token) {
                                                localStorage.setItem('token', data.token);
                                                localStorage.setItem('tipoUsuario', data.tipoUsuario);
                                                localStorage.setItem('emailUsuario', email);
                                                document.cookie = `jwt=${data.token}; path=/; max-age=86400;`;
                                                alert('Login atualizado com sucesso!');
                                                return true;
                                            }
                                        }
                                    }
                                    // Limpa localStorage e cookies e redireciona para login
                                    localStorage.clear();
                                    document.cookie = "jwt=; path=/; max-age=0;";
                                    alert('Não foi possível autenticar com o novo email. Faça login novamente.');
                                    window.location.href = '/login';
                                    return false;
                                }

                                await tentarLoginNovoEmail(emailInput.value, senha, 2, 1200);
                            }
                        } catch (e) {
                            alert('Erro ao atualizar perfil');
                            console.error(e);
                        }
                    } else {
                        senhaFeedback.textContent = 'Senha incorreta.';
                    }
                } catch (e) {
                    senhaFeedback.textContent = 'Erro ao validar senha.';
                }
            });
        });
    }
});