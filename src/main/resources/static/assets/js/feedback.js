document.addEventListener('DOMContentLoaded', function () {
    // Elementos
    const btnFreelancer = document.getElementById('btnFreelancer');
    const btnEmpresa = document.getElementById('btnEmpresa');
    const formFreelancer = document.getElementById('feedbackFreelancerForm');
    const formEmpresa = document.getElementById('feedbackEmpresaForm');
    const closeFreelancer = document.getElementById('closeFreelancerForm');
    const closeEmpresa = document.getElementById('closeEmpresaForm');
    const overlay = document.getElementById('feedbackOverlay');

    // Abrir/fechar overlay e formulários
    function openOverlay(form) {
        overlay.classList.add('active');
        form.classList.add('active');
        form.style.display = 'block';
    }
    function closeOverlay(form) {
        overlay.classList.remove('active');
        form.classList.remove('active');
        setTimeout(() => { form.style.display = 'none'; }, 200);
    }

    btnFreelancer.onclick = function () {
        openOverlay(formFreelancer);
        formEmpresa.classList.remove('active');
        formEmpresa.style.display = 'none';
    };
    btnEmpresa.onclick = function () {
        openOverlay(formEmpresa);
        formFreelancer.classList.remove('active');
        formFreelancer.style.display = 'none';
    };
    closeFreelancer.onclick = function () {
        closeOverlay(formFreelancer);
    };
    closeEmpresa.onclick = function () {
        closeOverlay(formEmpresa);
    };
    overlay.onclick = function () {
        if (formFreelancer.classList.contains('active')) closeOverlay(formFreelancer);
        if (formEmpresa.classList.contains('active')) closeOverlay(formEmpresa);
    };

    // Estrelas de avaliação (Freelancer)
    let notaFreelancer = 0;
    document.querySelectorAll('#starsFreelancer .bi').forEach(star => {
        star.addEventListener('click', function () {
            notaFreelancer = parseInt(this.getAttribute('data-value'));
            document.querySelectorAll('#starsFreelancer .bi').forEach((s, i) => {
                s.classList.toggle('selected', i < notaFreelancer);
            });
        });
    });

    // Estrelas de avaliação (Empresa)
    let notaEmpresa = 0;
    document.querySelectorAll('#starsEmpresa .bi').forEach(star => {
        star.addEventListener('click', function () {
            notaEmpresa = parseInt(this.getAttribute('data-value'));
            document.querySelectorAll('#starsEmpresa .bi').forEach((s, i) => {
                s.classList.toggle('selected', i < notaEmpresa);
            });
        });
    });

    // Submissão dos formulários
    document.getElementById('formFreelancer').addEventListener('submit', function (e) {
        e.preventDefault();
        if (notaFreelancer === 0) {
            alert('Por favor, selecione uma nota.');
            return;
        }
        alert('Feedback para freelancer enviado com sucesso!');
        this.reset();
        notaFreelancer = 0;
        document.querySelectorAll('#starsFreelancer .bi').forEach(s => s.classList.remove('selected'));
        closeOverlay(formFreelancer);
    });
    document.getElementById('formEmpresa').addEventListener('submit', function (e) {
        e.preventDefault();
        if (notaEmpresa === 0) {
            alert('Por favor, selecione uma nota.');
            return;
        }
        alert('Feedback para empresa enviado com sucesso!');
        this.reset();
        notaEmpresa = 0;
        document.querySelectorAll('#starsEmpresa .bi').forEach(s => s.classList.remove('selected'));
        closeOverlay(formEmpresa);
    });
});