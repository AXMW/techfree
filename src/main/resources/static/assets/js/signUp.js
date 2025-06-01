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
});
document.getElementById('iconEmpresa').addEventListener('click', function () {
    formPessoa.style.display = 'none';
    formEmpresa.style.display = '';
    fadeInputs(formEmpresa);
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

document.getElementById('formPessoa').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Pegue os valores dos campos
    const nome = this.name.value;
    const cpf = this.cpf.value;
    const email = this.email.value;
    const senha = this.password.value;
    const senhaConfirm = this.passwordConfirm.value;

    if (!senha || !senhaConfirm) {
        alert('As senhas não podem ser vazias.');
        return;
    }

    if (senha !== senhaConfirm) {
        alert('As senhas não coincidem.');
        return;
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
                // Salve o token ou dados do usuário
                if (data.token) {
                    localStorage.setItem('token', data.token);
                }
                // Redirecione para a dashboard ou página inicial
                window.location.href = 'Dashboard.html';
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

document.getElementById('formEmpresa').addEventListener('submit', async function (e) {
    e.preventDefault();
    // Pegue os valores dos campos
    const razaoSocial = this.razaoSocial.value;
    const nomeFantasia = this.name.value;
    const cnpj = this.cnpj.value;
    const email = this.email.value;
    const senha = this.elements.passwordEmpresa.value;
    const senhaConfirm = this.elements.passwordEmpresaConfirm.value;
    if (!senha || !senhaConfirm) {
        alert('As senhas não podem ser vazias.');
        return;
    }

    if (senha !== senhaConfirm) {
        alert('As senhas não coincidem.');
        return;
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
                // Salve o token ou dados do usuário
                if (data.token) {
                    localStorage.setItem('token', data.token);
                }
                // Redirecione para a dashboard ou página inicial
                window.location.href = 'Dashboard.html';
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