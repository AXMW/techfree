function validarSenhaForte(senha) {
    const requisitos = [
        { regex: /.{8,}/, texto: "Mínimo 8 caracteres" },
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

let tentouSubmit = false;

document.getElementById('resetPasswordForm').addEventListener('submit', async function (e) {
    tentouSubmit = true;
    const senha = this.newPassword.value;
    const senhaConfirm = this.password.value;

    const faltando = validarSenhaForte(senha);
    mostrarErrosSenha('senhaErrorReset', faltando);

    if (senha !== senhaConfirm) {
        mostrarErroConfirmacao('confirmaSenhaErrorReset', 'As senhas não coincidem.');
    } else {
        mostrarErroConfirmacao('confirmaSenhaErrorReset', '');
    }

    // Só envia se tudo ok
    if (faltando.length > 0 || senha !== senhaConfirm) {
        e.preventDefault();
        return;
    }

    e.preventDefault();

    // Pega o token da URL (formato /reset-password/{token})
    const pathParts = window.location.pathname.split('/');
    const token = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2];

    if (!token) {
        alert('Link inválido ou expirado.');
        return;
    }

    try {
        const response = await fetch('/auth/resetar-senha', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: token,
                novaSenha: senha
            })
        });

        if (response.ok) {
            alert('Senha redefinida com sucesso! Faça login com sua nova senha.');
            window.location.href = '/login';
        } else {
            const data = await response.json().catch(() => ({}));
            alert(data.message || 'Erro ao redefinir senha. Tente novamente.');
        }
    } catch (err) {
        alert('Erro ao conectar ao servidor.');
    }
});

// Feedback ao digitar, só depois do submit
document.querySelector('input[name="newPassword"]').addEventListener('input', function () {
    if (!tentouSubmit) return;
    if (this.value === '') {
        mostrarErrosSenha('senhaErrorReset', []);
    } else {
        mostrarErrosSenha('senhaErrorReset', validarSenhaForte(this.value));
    }
});
document.querySelector('input[name="password"]').addEventListener('input', function () {
    if (!tentouSubmit) return;
    const senha = document.querySelector('input[name="newPassword"]').value;
    mostrarErroConfirmacao('confirmaSenhaErrorReset', this.value !== senha ? 'As senhas não coincidem.' : '');
});