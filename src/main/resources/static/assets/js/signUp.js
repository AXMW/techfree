// Torna os ícones clicáveis e alterna a seleção
document.querySelectorAll('.icon-selector').forEach(function (icon) {
    icon.addEventListener('click', function () {
        document.querySelectorAll('.icon-selector').forEach(function (i) {
            i.classList.remove('bs-icon-selected');
        });
        this.classList.add('bs-icon-selected');
    });
});

// Função para fade nos inputs
function fadeInputs(form) {
    const inputs = form.querySelectorAll('.fade-input');
    inputs.forEach((el, idx) => {
        el.style.animation = 'none';
        void el.offsetWidth;
        el.style.animation = `fadeInInput 0.5s forwards`;
        el.style.animationDelay = (0.06 * idx) + 's';
    });
}

// Alterna os formulários e aplica fade nos inputs
const formPessoa = document.getElementById('formPessoa');
const formEmpresa = document.getElementById('formEmpresa');
document.getElementById('iconPessoa').addEventListener('click', function () {
    formPessoa.style.display = '';
    formEmpresa.style.display = 'none';
    fadeInputs(formPessoa);
    // Esconde requisitos da senha ao trocar para pessoa
    const reqPessoa = document.getElementById('requisitosSenhaPessoa');
    if (reqPessoa) reqPessoa.classList.add('d-none');
    const reqEmpresa = document.getElementById('requisitosSenhaEmpresa');
    if (reqEmpresa) reqEmpresa.classList.add('d-none');
    // Limpa mensagens de erro
    document.getElementById('senhaErrorPessoa').textContent = '';
    document.getElementById('senhaErrorPessoa').classList.add('d-none');
    document.getElementById('confirmaSenhaErrorPessoa').textContent = '';
    document.getElementById('confirmaSenhaErrorPessoa').classList.add('d-none');
    document.getElementById('senhaErrorEmpresa').textContent = '';
    document.getElementById('senhaErrorEmpresa').classList.add('d-none');
    document.getElementById('confirmaSenhaErrorEmpresa').textContent = '';
    document.getElementById('confirmaSenhaErrorEmpresa').classList.add('d-none');
});
document.getElementById('iconEmpresa').addEventListener('click', function () {
    formPessoa.style.display = 'none';
    formEmpresa.style.display = '';
    fadeInputs(formEmpresa);
    // Esconde requisitos da senha ao trocar para empresa
    const reqPessoa = document.getElementById('requisitosSenhaPessoa');
    if (reqPessoa) reqPessoa.classList.add('d-none');
    const reqEmpresa = document.getElementById('requisitosSenhaEmpresa');
    if (reqEmpresa) reqEmpresa.classList.add('d-none');
    // Limpa mensagens de erro
    document.getElementById('senhaErrorPessoa').textContent = '';
    document.getElementById('senhaErrorPessoa').classList.add('d-none');
    document.getElementById('confirmaSenhaErrorPessoa').textContent = '';
    document.getElementById('confirmaSenhaErrorPessoa').classList.add('d-none');
    document.getElementById('senhaErrorEmpresa').textContent = '';
    document.getElementById('senhaErrorEmpresa').classList.add('d-none');
    document.getElementById('confirmaSenhaErrorEmpresa').textContent = '';
    document.getElementById('confirmaSenhaErrorEmpresa').classList.add('d-none');
});
// Inicialização: só o de pessoa ativo e fade nos inputs
formPessoa.style.display = '';
formEmpresa.style.display = 'none';
fadeInputs(formPessoa);

// Lógica para mostrar/ocultar campos de instituição
const isInstituicao = document.getElementById('isInstituicao');
const instituicaoCampos = document.getElementById('instituicaoCampos');
const tipoVinculo = document.getElementById('tipoVinculo');
const campoOutroVinculo = document.getElementById('campoOutroVinculo');
const nomeInstituicaoSelect = document.getElementById('nomeInstituicaoSelect');
const campoOutraInstituicao = document.getElementById('campoOutraInstituicao');
const cursoArea = document.getElementById('cursoArea');
const campoOutroCurso = document.getElementById('campoOutroCurso');

if (isInstituicao && instituicaoCampos) {
    isInstituicao.addEventListener('change', function () {
        if (this.checked) {
            instituicaoCampos.style.display = '';
            fadeInputs(instituicaoCampos);
        } else {
            instituicaoCampos.style.display = 'none';
        }
    });
}

if (tipoVinculo && campoOutroVinculo) {
    tipoVinculo.addEventListener('change', function () {
        if (this.value === 'outro') {
            campoOutroVinculo.style.display = '';
        } else {
            campoOutroVinculo.style.display = 'none';
        }
    });
}

// Nome da instituição: mostra campo de texto se "Outro"
if (nomeInstituicaoSelect && campoOutraInstituicao) {
    nomeInstituicaoSelect.addEventListener('change', function () {
        if (this.value === 'outro') {
            campoOutraInstituicao.style.display = '';
        } else {
            campoOutraInstituicao.style.display = 'none';
        }
    });
}

if (cursoArea && campoOutroCurso) {
    cursoArea.addEventListener('change', function () {
        if (this.value === 'Outro') {
            campoOutroCurso.style.display = '';
        } else {
            campoOutroCurso.style.display = 'none';
        }
    });
}

// Máscara para CPF
function maskCPF(value) {
    return value
        .replace(/\D/g, '') // Remove tudo que não é dígito
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

// Máscara para CNPJ
function maskCNPJ(value) {
    return value
        .replace(/\D/g, '')
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
}

// Aplica máscara ao CPF
const cpfInput = document.getElementById('cpf');
if (cpfInput) {
    cpfInput.addEventListener('input', function () {
        this.value = maskCPF(this.value);
    });
}

// Aplica máscara ao CNPJ
const cnpjInput = document.getElementById('cnpj');
if (cnpjInput) {
    cnpjInput.addEventListener('input', function () {
        this.value = maskCNPJ(this.value);
    });
}

function validarSenhaForte(senha) {
    const requisitos = [
        { regex: /.{8,}/, texto: "Mínimo 8 caracteres" },
        { regex: /[A-Z]/, texto: "1 letra maiúscula" },
        { regex: /[a-z]/, texto: "1 letra minúscula" },
        { regex: /[0-9]/, texto: "1 número" },
        { regex: /[^A-Za-z0-9]/, texto: "1 caractere especial" }
    ];
    const faltando = requisitos.filter(r => !r.regex.test(senha)).map(r => r.texto);
    return faltando;
}

function mostrarErrosSenha(idDiv, faltando) {
    const div = document.getElementById(idDiv);
    if (faltando.length === 0) {
        div.textContent = "";
        div.classList.add('d-none');
    } else {
        div.innerHTML = "<p style='margin-left: 10px; margin-bottom: 0'>A senha deve conter:</p><ul style='margin-bottom: 0'>" +
            faltando.map(f => `<li>${f}</li>`).join('') + "</ul>";
        div.classList.remove('d-none');
    }
}

function mostrarErroConfirmacao(idDiv, msg) {
    const div = document.getElementById(idDiv);
    if (!msg) {
        div.textContent = "";
        div.classList.add('d-none');
    } else {
        div.textContent = msg;
        div.classList.remove('d-none');
    }
}

// --- FREELANCER ---
document.getElementById('formPessoa').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Pegue os valores dos campos
    const nome = this.name.value;
    const cpf = this.cpf.value;
    const email = this.email.value;
    const senha = this.password.value;
    const senhaConfirm = this.passwordConfirm.value;

    // Validação senha forte
    const faltando = validarSenhaForte(senha);
    mostrarErrosSenha('senhaErrorPessoa', faltando);

    // Validação confirmação
    if (senha !== senhaConfirm) {
        mostrarErroConfirmacao('confirmaSenhaErrorPessoa', 'As senhas não coincidem.');
    } else {
        mostrarErroConfirmacao('confirmaSenhaErrorPessoa', '');
    }

    if (faltando.length > 0 || senha !== senhaConfirm) {
        return; // Não envia o formulário
    }


    // Monte o objeto conforme seu DTO de registro
    const payload = {
        nome: nome,
        email: email,
        senha: senha,
        telefone: '123456789',
        cpf: cpf,
        areaEspecialidade: 'Teste'
        // Adicione outros campos se necessário
    };

    try {
        const response = await fetch('/auth/register/freelancer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const response2 = await fetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ "email": email, "senha": senha })
            });

            if (response2.ok) {
                const data = await response2.json();
                // Salve o token e tipoUsuario igual ao login
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('tipoUsuario', data.tipoUsuario); // Adicione esta linha
                    document.cookie = `jwt=${data.token}; path=/; max-age=86400;`;
                }
                window.location.href = '/dashboard';
            } else {
                alert('E-mail ou senha inválidos.');
            }
        } else {
            const data = await response.json();
            alert(data.message || 'Erro ao cadastrar. Verifique os dados e tente novamente.');
        }
    } catch (err) {
        alert('Erro ao conectar ao servidor.');
        console.log(err);
    }
});

// --- EMPRESA ---
document.getElementById('formEmpresa').addEventListener('submit', async function (e) {
    e.preventDefault();
    // Pegue os valores dos campos
    const razaoSocial = this.razaoSocial.value;
    const nomeFantasia = this.name.value;
    const cnpj = this.cnpj.value;
    const email = this.email.value;
    const senha = this.elements.passwordEmpresa.value;
    const senhaConfirm = this.elements.passwordEmpresaConfirm.value;

    // Validação senha forte
    const faltando = validarSenhaForte(senha);
    mostrarErrosSenha('senhaErrorEmpresa', faltando);

    // Validação confirmação
    if (senha !== senhaConfirm) {
        mostrarErroConfirmacao('confirmaSenhaErrorEmpresa', 'As senhas não coincidem.');
    } else {
        mostrarErroConfirmacao('confirmaSenhaErrorEmpresa', '');
    }

    if (faltando.length > 0 || senha !== senhaConfirm) {
        return; // Não envia o formulário
    }

    // Monte o objeto conforme seu DTO de registro
    const payload = {
        nomeFantasia: nomeFantasia,
        razaoSocial: razaoSocial,
        email: email,
        senha: senha,
        cnpj: cnpj,
        telefone: '123456789'
        // Adicione outros campos se necessário
    };

    try {
        const response = await fetch('/auth/register/empresa', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const responseEmpresa = await fetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ "email": email, "senha": senha })
            });

            if (responseEmpresa.ok) {
                const data = await responseEmpresa.json();
                // Salve o token e tipoUsuario igual ao login
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('tipoUsuario', data.tipoUsuario); // Adicione esta linha
                    document.cookie = `jwt=${data.token}; path=/; max-age=86400;`;
                }
                window.location.href = '/dashboard';
            } else {
                alert('E-mail ou senha inválidos.');
            }
        } else {
            const data = await response.json();
            alert(data.message || 'Erro ao cadastrar. Verifique os dados e tente novamente.');
        }
    } catch (err) {
        alert('Erro ao conectar ao servidor.');
        console.log(err);
    }
});

// Opcional: validação ao digitar (feedback instantâneo)
document.querySelector('input[name="password"]').addEventListener('input', function() {
    mostrarErrosSenha('senhaErrorPessoa', validarSenhaForte(this.value));
});
document.querySelector('input[name="passwordEmpresa"]').addEventListener('input', function() {
    mostrarErrosSenha('senhaErrorEmpresa', validarSenhaForte(this.value));
});
document.querySelector('input[name="passwordConfirm"]').addEventListener('input', function() {
    const senha = document.querySelector('input[name="password"]').value;
    mostrarErroConfirmacao('confirmaSenhaErrorPessoa', this.value !== senha ? 'As senhas não coincidem.' : '');
});
document.querySelector('input[name="passwordEmpresaConfirm"]').addEventListener('input', function() {
    const senha = document.querySelector('input[name="passwordEmpresa"]').value;
    mostrarErroConfirmacao('confirmaSenhaErrorEmpresa', this.value !== senha ? 'As senhas não coincidem.' : '');
});