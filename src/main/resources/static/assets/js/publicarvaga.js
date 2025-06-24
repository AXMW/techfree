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


document.getElementById('vagaForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    // Pegue os valores dos campos
    const titulo = this.elements.titulo.value;
    const subtitulo = this.elements.subtitulo.value;
    const grauexperiencia = this.elements.grauexperiencia.value;
    const requisitos = tags.join(',');
    const pagamento = this.elements.pagamento.value;
    const pagamentoFinal = pagamento.replace(/\./g, '').replace(',', '.').replace(/[^\d.]/g, '');
    const email = this.elements.contato.value;
    const telefoneContato = this.elements.telefone.value;
    const duracao = this.elements.duracao.value;
    const descricao = quill.root.innerHTML; // Aqui vem o HTML formatado

    // Monte o objeto conforme seu DTO de registro
    const vaga = {
        titulo: titulo,
        subtitulo: subtitulo,
        grauexperience: grauexperiencia,
        requisitos: requisitos,
        orcamento: pagamentoFinal,
        emailPraContato: email,
        telefonePraContato: telefoneContato,
        duracao: duracao,
        descricao: descricao
        // Adicione outros campos se necessário
    };

    console.log(vaga);

    try {
        const response = await fetch('/projetos', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': 'Bearer ' + token 
            },
            body: JSON.stringify(vaga)
        });

        if (response.ok) {
            const data = await response.json();
            const IdProjeto = data.id; // Supondo que a resposta contenha o ID do projeto criado
            const response2 = await fetch('/projetos/' + IdProjeto, {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token 
                }
            });

            response2.ok ? window.location.href = '/detalhes-projeto/' +
            IdProjeto : alert('Erro ao redirecionar para os detalhes do projeto.');
            
        } else {
            const data = await response.json();
            alert(data.message || 'Erro ao publicar vaga. Verifique os dados e tente novamente.');
        }
    } catch (err) {
        alert('Erro ao conectar ao servidor.');
        console.log(err);
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

document.addEventListener('DOMContentLoaded', function () {
    window.quill = new Quill('#descricaoEditor', {
        theme: 'snow',
        modules: {
            toolbar: [
                [{ 'font': [] }, { 'size': [] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'script': 'sub'}, { 'script': 'super' }],
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'align': [] }],
                ['link'],
                ['clean']
            ]
        }
    });

    // Sempre que o conteúdo mudar, ajusta os links
    quill.on('text-change', function() {
        const links = document.querySelectorAll('#descricaoEditor .ql-editor a');
        links.forEach(link => {
            // Se não começa com http:// ou https://, adiciona https://
            if (!/^https?:\/\//i.test(link.getAttribute('href'))) {
                link.setAttribute('href', 'https://' + link.getAttribute('href'));
            }
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        });
    });
});


