// Filtro de busca dinâmica nas perguntas
document.getElementById('faqSearch').addEventListener('input', function () {
    const search = this.value.toLowerCase();
    document.querySelectorAll('.accordion-item').forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(search) ? '' : 'none';
    });
});