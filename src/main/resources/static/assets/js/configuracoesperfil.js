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
                            'Content-Type': 'text/plain'
                        },
                        body: emailAtual
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
});