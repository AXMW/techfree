document.addEventListener('DOMContentLoaded', function () {
    const usuarioLogado = localStorage.getItem('tipoUsuario');
    const navbarLogado = document.getElementById('mainNav');
    const navbarInicio = document.getElementById('navbarNav');

    if (usuarioLogado && navbarLogado) {
        navbarLogado.style.display = '';
        if (navbarInicio) navbarInicio.parentNode.removeChild(navbarInicio);
    } else if (navbarInicio) {
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

    // Troca cor do ícone e do texto quando expandido
    document.querySelectorAll('.accordion-button').forEach(btn => {
        btn.addEventListener('click', function () {
            setTimeout(() => {
                document.querySelectorAll('.accordion-button').forEach(b => {
                    const icon = b.querySelector('.faq-icon i');
                    if (icon) {
                        if (b.getAttribute('aria-expanded') === 'true') {
                            icon.style.color = '#22243a';
                            b.style.color = '#rgb(34, 36, 58)';
                        } else {
                            icon.style.color = '';
                            b.style.color = '';
                        }
                    }
                });
            }, 200); // espera animação do Bootstrap
        });
    });
});