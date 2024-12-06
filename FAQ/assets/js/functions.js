const toggleButtons = document.querySelectorAll('.toggle-button');
toggleButtons.forEach(button => {
    button.addEventListener('click', () => {
        const answer = button.parentElement.nextElementSibling;
        const isVisible = answer.style.display === 'block';

        answer.style.display = isVisible ? 'none' : 'block';
        button.textContent = isVisible ? '˅' : '˄';
    })
})