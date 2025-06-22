document.addEventListener('DOMContentLoaded', function () {
    const tipoUsuario = localStorage.getItem('tipoUsuario');
    const token = localStorage.getItem('token');
    // Seleciona todos os links da seção "Páginas" do footer
    const paginasSection = Array.from(document.querySelectorAll('h3'))
        .find(h3 => h3.textContent.trim() === 'Páginas')
        ?.parentElement;
    if (!paginasSection) return;
    const links = paginasSection.querySelectorAll('a');

    if (!tipoUsuario || !token) {
        // Não logado: todos os links vão para /login
        links.forEach(link => {
            link.setAttribute('href', '/login');
        });
    } else {
        // Logado: só o link "Perfil" é dinâmico
        links.forEach(link => {
            if (link.textContent.trim() === 'Perfil') {
                let urlPerfil = tipoUsuario === 'EMPRESA'
                    ? '/pagina-profile-empresa'
                    : '/pagina-profile';
                link.setAttribute('href', urlPerfil);
            }
            // Os outros links permanecem como estão
        });
    }
});