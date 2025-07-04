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

    // Declare emailOriginal no escopo superior
    let emailOriginal = '';

    // Preenche os campos com os dados atuais
    try {
        const resp = await fetch(urlGetPerfil, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if (!resp.ok) throw new Error('Erro ao buscar perfil');
        const perfil = await resp.json();

        // Salve o email original ao carregar o perfil para evitar PUT desnecessário
        if (emailInput) {
            emailInput.value = perfil.email || '';
            emailOriginal = perfil.email || '';
        }
        if (phoneInput) {
            phoneInput.value = perfil.telefone || '';
        }
    } catch (e) {
        console.error('Erro ao carregar perfil:', e);
    }

    // Salvar alterações (apenas PUT simples)
    if (btnSalvar) {
        btnSalvar.addEventListener('click', async function () {
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

            // Atualiza telefone normalmente (NÃO envia email aqui!)
            let body = {
                telefone: phoneInput.value
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
                alert('Telefone atualizado com sucesso!');
            } catch (e) {
                alert('Erro ao atualizar perfil');
                console.error(e);
                return;
            }

            // Se o email foi alterado, chama o endpoint novo
            const emailAtual = emailInput.value;
            let urlMudarEmail = '';
            if (tipoUsuario === 'EMPRESA') {
                urlMudarEmail = '/empresa/perfil/mudarEmail';
            } else {
                urlMudarEmail = '/freelancer/perfil/mudarEmail';
            }

            // Só chama o endpoint se o email foi alterado
            if (emailAtual !== emailOriginal) {
                try {
                    const respEmail = await fetch(urlMudarEmail, {
                        method: 'PUT',
                        headers: {
                            'Authorization': 'Bearer ' + token,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ novoEmail: emailAtual })
                    });
                    if (!respEmail.ok) throw new Error('Erro ao atualizar email');
                    const data = await respEmail.json();
                    if (data.token) {
                        localStorage.setItem('token', data.token);
                        document.cookie = `jwt=${data.token}; path=/; max-age=86400;`;
                        alert('Email e token atualizados com sucesso!');
                    } else {
                        alert('Email alterado, mas não foi possível atualizar o token.');
                    }
                } catch (e) {
                    alert('Erro ao atualizar email');
                    console.error(e);
                }
            }
        });
    }

    // Segurança: alterar senha
    const btnAlterarSenha = document.querySelector('#security button[type="button"]');
    if (btnAlterarSenha) {
        btnAlterarSenha.addEventListener('click', async function () {
            const senhaAtual = document.getElementById('current-password')?.value;
            const novaSenha = document.getElementById('new-password')?.value;
            const confirmarSenha = document.getElementById('confirm-password')?.value;

            // Validação de senha forte
            const faltando = validarSenhaForte(novaSenha || '');
            mostrarErrosSenhaConfig('senhaErrorConfig', faltando);

            if (!senhaAtual || !novaSenha || !confirmarSenha) {
                alert('Preencha todos os campos de senha.');
                return;
            }
            if (novaSenha !== confirmarSenha) {
                alert('A nova senha e a confirmação não coincidem.');
                return;
            }
            if (faltando.length > 0) {
                alert('A nova senha não atende aos requisitos.');
                return;
            }

            // Define endpoint conforme tipo de usuário
            const urlMudarSenha = tipoUsuario === 'EMPRESA'
                ? '/empresa/perfil/mudarSenha'
                : '/freelancer/perfil/mudarSenha';

            try {
                const resp = await fetch(urlMudarSenha, {
                    method: 'PUT',
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        senhaAtual: senhaAtual,
                        novaSenha: novaSenha
                    })
                });
                if (!resp.ok) throw new Error('Erro ao alterar senha');
                alert('Senha alterada com sucesso!');
                // Limpa os campos
                document.getElementById('current-password').value = '';
                document.getElementById('new-password').value = '';
                document.getElementById('confirm-password').value = '';
            } catch (e) {
                alert('Erro ao alterar senha');
                console.error(e);
            }
        });
    }

    // Função de validação de senha forte (igual ao cadastro)
    function validarSenhaForte(senha) {
        const requisitos = [
            { regex: /.{8,}/, texto: "Mínimo 8 caracteres" },
            { regex: /^.{0,20}$/, texto: "Máximo 20 caracteres" },
            { regex: /[A-Z]/, texto: "1 letra maiúscula" },
            { regex: /[a-z]/, texto: "1 letra minúscula" },
            { regex: /[0-9]/, texto: "1 número" },
            { regex: /[^A-Za-z0-9]/, texto: "1 caractere especial" }
        ];
        return requisitos.filter(r => !r.regex.test(senha)).map(r => r.texto);
    }

    // Exibe erros de senha
    function mostrarErrosSenhaConfig(idDiv, faltando) {
        const div = document.getElementById(idDiv);
        if (!div) return;
        if (faltando.length === 0) {
            div.textContent = "";
            div.classList.add('d-none');
        } else {
            div.innerHTML = "<p style='margin-left: 10px; margin-bottom: 0'>A senha deve conter:</p><ul style='margin-bottom: 0'>" +
                faltando.map(f => `<li>${f}</li>`).join('') + "</ul>";
            div.classList.remove('d-none');
        }
    }

    // Adiciona div de erro de senha se não existir
    let senhaErrorDiv = document.getElementById('senhaErrorConfig');
    if (!senhaErrorDiv) {
        senhaErrorDiv = document.createElement('div');
        senhaErrorDiv.id = 'senhaErrorConfig';
        senhaErrorDiv.classList.add('mt-1', 'mb-2', 'erro-senha', 'd-none');
        const senhaField = document.getElementById('new-password');
        if (senhaField) senhaField.parentNode.appendChild(senhaErrorDiv);
    }

    // Validação ao digitar nova senha
    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');

    if (newPasswordInput && confirmPasswordInput) {
        // Valida confirmação ao digitar a nova senha
        newPasswordInput.addEventListener('input', function () {
            mostrarErrosSenhaConfig('senhaErrorConfig', validarSenhaForte(this.value));
            const senhaConfirm = confirmPasswordInput.value;
            mostrarErroConfirmacaoConfig('confirmaSenhaErrorConfig', senhaConfirm !== this.value ? 'As senhas não coincidem.' : '');
        });

        // Valida confirmação ao digitar o campo de confirmação
        confirmPasswordInput.addEventListener('input', function () {
            const senha = newPasswordInput.value;
            mostrarErroConfirmacaoConfig('confirmaSenhaErrorConfig', this.value !== senha ? 'As senhas não coincidem.' : '');
        });
    }

    // Função para mostrar erro de confirmação de senha
    function mostrarErroConfirmacaoConfig(idDiv, msg) {
        const div = document.getElementById(idDiv);
        if (!div) return;
        if (!msg) {
            div.textContent = "";
            div.classList.add('d-none');
        } else {
            div.textContent = msg;
            div.classList.remove('d-none');
        }
    }

    // Função para carregar configurações de notificações
    function carregarConfigNotificacoes() {
        let urlGet;
        if (tipoUsuario === 'EMPRESA') {
            urlGet = '/empresa/perfil/config-notificacoes';
        } else {
            urlGet = '/freelancer/perfil/config-notificacoes';
        }
        fetch(urlGet, {
            headers: { 'Authorization': 'Bearer ' + token }
        })
            .then(response => {
                if (!response.ok) throw new Error('Erro ao buscar configurações');
                return response.json();
            })
            .then(data => {
                document.getElementById('notif-app').checked = !!data.notificacoesAtivas;
                document.getElementById('notif-email').checked = !!data.notificacoesPorEmailAtivas;
            })
            .catch(() => {
                document.getElementById('notif-app').checked = false;
                document.getElementById('notif-email').checked = false;
            });
    }

    // Chama ao abrir a página
    carregarConfigNotificacoes();

    // Salvar configurações ao clicar no botão
    const btnSalvarPreferencias = document.querySelector('#notification button[type="button"]');
    if (btnSalvarPreferencias) {
        btnSalvarPreferencias.addEventListener('click', function () {
            const notificacoesAtivas = document.getElementById('notif-app').checked;
            const notificacoesPorEmailAtivas = document.getElementById('notif-email').checked;
            let urlPost;
            if (tipoUsuario === 'EMPRESA') {
                urlPost = '/empresa/perfil/config-notificacoes';
            } else {
                urlPost = '/freelancer/perfil/config-notificacoes';
            }
            fetch(urlPost, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    notificacoesAtivas: notificacoesAtivas,
                    notificacoesPorEmailAtivas: notificacoesPorEmailAtivas
                })
            })
            .then(response => {
                if (!response.ok) throw new Error('Erro ao salvar configurações');
                alert('Preferências salvas com sucesso!');
            })
            .catch(() => {
                alert('Erro ao salvar preferências.');
            });
        });
    }
});