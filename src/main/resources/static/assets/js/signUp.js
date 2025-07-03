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
        // Sempre aplica a máscara, mesmo se o campo estiver vazio
        let val = this.value.replace(/\D/g, '');
        if (val.length > 14) val = val.slice(0, 14); // Limita a 14 dígitos
        this.value = maskCNPJ(val);
    });
}

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

function mostrarErroCampo(idDiv, msg) {
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
    const nome = this.name.value.trim();
    const cpf = this.cpf.value.trim();
    const dataNascimento = this.dataNascimento.value;
    const email = this.email.value.trim();
    const senha = this.password.value;
    const senhaConfirm = this.passwordConfirm.value;

    let erro = false;

    // Validação de campos obrigatórios
    if (!nome) {
        mostrarErroCampo('nomeErrorPessoa', 'Nome obrigatório.');
        erro = true;
    } else {
        mostrarErroCampo('nomeErrorPessoa', '');
    }

    if (!cpf) {
        mostrarErroCampo('cpfErrorPessoa', 'CPF obrigatório.');
        erro = true;
    } else if (!validarCPFCompleto(cpf)) {
        mostrarErroCampo('cpfErrorPessoa', 'CPF incompleto.');
        erro = true;
    } else {
        mostrarErroCampo('cpfErrorPessoa', '');
    }

    if (!dataNascimento) {
        mostrarErroCampo('dataNascimentoErrorPessoa', 'Data de nascimento obrigatória.');
        erro = true;
    } else if (!validarMaiorDeIdade(dataNascimento)) {
        mostrarErroCampo('dataNascimentoErrorPessoa', 'Você deve ter pelo menos 18 anos.');
        erro = true;
    } else {
        mostrarErroCampo('dataNascimentoErrorPessoa', '');
    }

    if (!email) {
        mostrarErroCampo('emailErrorPessoa', 'Email obrigatório.');
        erro = true;
    } else if (!validarEmail(email)) {
        mostrarErroCampo('emailErrorPessoa', 'Email inválido.');
        erro = true;
    } else {
        mostrarErroCampo('emailErrorPessoa', '');
    }

    // Validação senha forte
    const faltando = validarSenhaForte(senha);
    mostrarErrosSenha('senhaErrorPessoa', faltando);

    // Validação confirmação
    if (senha !== senhaConfirm) {
        mostrarErroConfirmacao('confirmaSenhaErrorPessoa', 'As senhas não coincidem.');
        erro = true;
    } else {
        mostrarErroConfirmacao('confirmaSenhaErrorPessoa', '');
    }

    if (faltando.length > 0 || erro) {
        return; // Não envia o formulário
    }

    // Monte o objeto conforme seu DTO de registro
    const payload = {
        nome: nome,
        email: email,
        senha: senha,
        telefone: '',
        cpf: cpf,
        areaEspecialidade: ''
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
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('tipoUsuario', data.tipoUsuario);
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

    const razaoSocial = this.razaoSocial.value.trim();
    const nomeFantasia = this.name.value.trim();
    const cnpj = this.cnpj.value.trim();
    const email = this.email.value.trim();
    const senha = this.elements.passwordEmpresa.value;
    const senhaConfirm = this.elements.passwordEmpresaConfirm.value;

    let erro = false;

    if (!razaoSocial) {
        mostrarErroCampo('razaoSocialErrorEmpresa', 'Razão social obrigatória.');
        erro = true;
    } else {
        mostrarErroCampo('razaoSocialErrorEmpresa', '');
    }

    if (!nomeFantasia) {
        mostrarErroCampo('nomeFantasiaErrorEmpresa', 'Nome fantasia obrigatório.');
        erro = true;
    } else {
        mostrarErroCampo('nomeFantasiaErrorEmpresa', '');
    }

    if (!cnpj) {
        mostrarErroCampo('cnpjErrorEmpresa', 'CNPJ obrigatório.');
        erro = true;
    } else if (!validarCNPJCompleto(cnpj)) {
        mostrarErroCampo('cnpjErrorEmpresa', 'CNPJ incompleto.');
        erro = true;
    } else {
        mostrarErroCampo('cnpjErrorEmpresa', '');
    }

    if (!email) {
        mostrarErroCampo('emailErrorEmpresa', 'Email obrigatório.');
        erro = true;
    } else if (!validarEmail(email)) {
        mostrarErroCampo('emailErrorEmpresa', 'Email inválido.');
        erro = true;
    } else {
        mostrarErroCampo('emailErrorEmpresa', '');
    }

    // Validação senha forte
    const faltando = validarSenhaForte(senha);
    mostrarErrosSenha('senhaErrorEmpresa', faltando);

    // Validação confirmação
    if (senha !== senhaConfirm) {
        mostrarErroConfirmacao('confirmaSenhaErrorEmpresa', 'As senhas não coincidem.');
        erro = true;
    } else {
        mostrarErroConfirmacao('confirmaSenhaErrorEmpresa', '');
    }

    if (faltando.length > 0 || erro) {
        return; // Não envia o formulário
    }

    // Monte o objeto conforme seu DTO de registro
    const payload = {
        nomeFantasia: nomeFantasia,
        razaoSocial: razaoSocial,
        email: email,
        senha: senha,
        cnpj: cnpj,
        telefone: ''
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
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('tipoUsuario', data.tipoUsuario);
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

// Validação ao digitar senha e confirmação (feedback instantâneo)
document.querySelector('input[name="password"]').addEventListener('input', function() {
    mostrarErrosSenha('senhaErrorPessoa', validarSenhaForte(this.value));
    // Valida confirmação ao digitar a senha também
    const senhaConfirm = document.querySelector('input[name="passwordConfirm"]').value;
    mostrarErroConfirmacao('confirmaSenhaErrorPessoa', senhaConfirm !== this.value ? 'As senhas não coincidem.' : '');
});
document.querySelector('input[name="passwordEmpresa"]').addEventListener('input', function() {
    mostrarErrosSenha('senhaErrorEmpresa', validarSenhaForte(this.value));
    // Valida confirmação ao digitar a senha também
    const senhaConfirm = document.querySelector('input[name="passwordEmpresaConfirm"]').value;
    mostrarErroConfirmacao('confirmaSenhaErrorEmpresa', senhaConfirm !== this.value ? 'As senhas não coincidem.' : '');
});
document.querySelector('input[name="passwordConfirm"]').addEventListener('input', function() {
    const senha = document.querySelector('input[name="password"]').value;
    mostrarErroConfirmacao('confirmaSenhaErrorPessoa', this.value !== senha ? 'As senhas não coincidem.' : '');
});
document.querySelector('input[name="passwordEmpresaConfirm"]').addEventListener('input', function() {
    const senha = document.querySelector('input[name="passwordEmpresa"]').value;
    mostrarErroConfirmacao('confirmaSenhaErrorEmpresa', this.value !== senha ? 'As senhas não coincidem.' : '');
});

function validarCPFCompleto(cpf) {
    // Remove máscara
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11) return false;
    let soma = 0, resto;
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    return true;
}

function validarCNPJCompleto(cnpj) {
    // Remove máscara
    cnpj = cnpj.replace(/[^\d]+/g, '');
    if (cnpj.length !== 14) return false;
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
        if (pos < 2) pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado !== parseInt(digitos.charAt(0))) return false;
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
        if (pos < 2) pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado !== parseInt(digitos.charAt(1))) return false;
    return true;
}

function validarEmail(email) {
    // Regex simples para email válido
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validarMaiorDeIdade(dataNascimento) {
    if (!dataNascimento) return false;
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() <= nascimento.getDate())) {
        idade--;
    }
    return idade >= 18;
}