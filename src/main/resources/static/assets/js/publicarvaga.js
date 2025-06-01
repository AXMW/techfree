// TAGS INPUT PARA REQUISITOS
const tagsInputWrapper = document.getElementById('tagsInputWrapper');
const techSearch = document.getElementById('techSearch');
const techDropdown = document.getElementById('techDropdown');
let tags = [];

// Sugestões básicas (pode expandir)
const sugestoes = [
    "JavaScript", "Python", "Java", "C#", "PHP", "SQL", "React", "Node.js", "TypeScript", "Vue.js", "Angular", "Ruby", "C++", "Flutter", "Dart"
];

// Renderiza opções filtradas (sem checkbox)
function renderDropdown(filter = "") {
    techDropdown.innerHTML = "";
    let filtered = sugestoes.filter(s => s.toLowerCase().includes(filter.toLowerCase()) && !tags.includes(s));
    if (filter && !sugestoes.map(s=>s.toLowerCase()).includes(filter.toLowerCase()) && !tags.includes(filter)) {
        filtered.unshift(filter);
    }
    if (filtered.length === 0) {
        techDropdown.style.display = "none";
        return;
    }
    filtered.forEach(opt => {
        const div = document.createElement('div');
        div.className = "px-3 py-2";
        div.style.cursor = "pointer";
        div.textContent = opt;
        div.onclick = function() {
            addTag(opt);
            techDropdown.style.display = "none";
            techSearch.value = "";
            techSearch.focus();
        };
        techDropdown.appendChild(div);
    });
    techDropdown.style.display = "block";
}

// Adiciona tag visual e lógica
function addTag(tag) {
    if (tags.includes(tag)) return;
    tags.push(tag);
    const tagEl = document.createElement('span');
    tagEl.className = 'tag';
    tagEl.textContent = tag;
    const removeBtn = document.createElement('span');
    removeBtn.className = 'remove-tag';
    removeBtn.innerHTML = '&times;';
    removeBtn.onclick = function () {
        tags = tags.filter(t => t !== tag);
        tagEl.remove();
    };
    tagEl.appendChild(removeBtn);
    tagsInputWrapper.insertBefore(tagEl, techSearch);
}

// Pesquisa dinâmica e seleção por Enter
techSearch.addEventListener('input', function () {
    renderDropdown(this.value.trim());
});
techSearch.addEventListener('focus', function () {
    renderDropdown(this.value.trim());
});
techSearch.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        let val = this.value.trim();
        if (val && !tags.includes(val)) {
            addTag(val);
        }
        this.value = "";
        techDropdown.style.display = "none";
    }
});
document.addEventListener('click', function(e) {
    if (!techSearch.contains(e.target) && !techDropdown.contains(e.target)) {
        techDropdown.style.display = "none";
    }
});

// Ao enviar o form, adiciona as tags como campos ocultos
document.getElementById('vagaForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // Remove campos ocultos antigos
    document.querySelectorAll('.hidden-tag').forEach(el => el.remove());
    tags.forEach(tag => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'requisitos[]';
        input.value = tag;
        input.className = 'hidden-tag';
        this.appendChild(input);
    });

    // Exemplo de envio: alert e reset
    alert('Vaga publicada com sucesso!');
    this.reset();
    // Limpa tags
    tags = [];
    document.querySelectorAll('.tag').forEach(el => el.remove());
});

// DURAÇÃO DO PROJETO: define data limite automaticamente
const duracaoSelect = document.getElementById('duracao');
const dataInicioInput = document.getElementById('dataInicio');
const dataLimiteInput = document.getElementById('dataLimite');

function calcularDataLimite() {
    const meses = parseInt(duracaoSelect.value, 10);
    const dataInicio = dataInicioInput.value;
    if (!meses || !dataInicio) {
        dataLimiteInput.value = '';
        document.getElementById('limite').classList.add('invisible');
        return;
    }
    const data = new Date(dataInicio);
    data.setMonth(data.getMonth() + meses);
    // Ajusta para o último dia do mês se necessário
    if (data.getDate() !== new Date(data.getFullYear(), data.getMonth(), 0).getDate()) {
        data.setDate(data.getDate() - 1);
    }
    dataLimiteInput.value = data.toISOString().split('T')[0];
    document.getElementById('limite').classList.remove('invisible');
}

duracaoSelect.addEventListener('change', calcularDataLimite);
dataInicioInput.addEventListener('change', calcularDataLimite);

// FORMATAÇÃO DO CAMPO DE PAGAMENTO
const pagamentoInput = document.getElementById('pagamento');

pagamentoInput.addEventListener('input', function () {
    // Remove tudo que não for número
    let valor = this.value.replace(/\D/g, '');
    if (valor.length === 0) {
        this.value = '';
        return;
    }
    // Formata para moeda brasileira
    valor = (parseInt(valor, 10) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    this.value = valor;
});