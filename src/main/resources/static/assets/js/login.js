// Animação fade-in nos campos do login ao abrir a página
document.addEventListener('DOMContentLoaded', function () {
    const inputs = document.querySelectorAll('.fade-input');
    inputs.forEach((el, idx) => {
        el.style.opacity = 0;
        el.style.animation = 'none';
        void el.offsetWidth;
        el.style.animation = `fadeInInput 0.5s forwards`;
        el.style.animationDelay = (0.06 * idx) + 's';
    });
});

document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const email = this.email.value;
    const password = this.senha.value;

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "email": email, "senha": password })
        });

        if (response.ok) {
            const data = await response.json();
            // Salve o token ou dados do usuário
            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('tipoUsuario', data.tipoUsuario);
                document.cookie = `jwt=${data.token}; path=/; max-age=86400;`;
            }
            // Redirecione para a dashboard ou página inicial
            window.location.href = '/dashboard';
        } else {
            alert('E-mail ou senha inválidos.');
        }
    } catch (err) {
        alert('Erro ao conectar ao servidor.');
    }
});