
// Espera o DOM carregar
document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const emailInput = form.querySelector('input[name="email"]');
        const email = emailInput.value.trim();
        if (!email) {
            alert('Por favor, preencha o e-mail.');
            return;
        }
        try {
            const response = await fetch('/auth/recuperar-senha', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            if (response.ok) {
                alert('Se o e-mail existir, você receberá as instruções para redefinir sua senha.');
                form.reset();
            } else {
                alert('Erro ao solicitar recuperação de senha.');
            }
        } catch (err) {
            alert('Erro de conexão.');
        }
    });
});
