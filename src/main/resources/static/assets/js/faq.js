document.addEventListener('DOMContentLoaded', function () {
    const usuarioLogado = localStorage.getItem('tipoUsuario');
    const navbarLogado = document.getElementById('mainNav');
    const navbarInicio = document.getElementById('navbarNav');

    if (usuarioLogado && navbarLogado) {
        console.log("Usuário logado, exibindo navbar de usuário.");
        navbarLogado.style.display = '';
        if (navbarInicio) navbarInicio.parentNode.removeChild(navbarInicio);
    } else if (navbarInicio) {
        console.log("Usuário não logado, exibindo navbar de início.");
        navbarInicio.style.display = '';
        if (navbarLogado) navbarLogado.parentNode.removeChild(navbarLogado);
    }

    document.getElementById('faqSearch').addEventListener('input', function () {
        const search = this.value.toLowerCase();
        document.querySelectorAll('.accordion-item').forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(search) ? '' : 'none';
        });
    });
});