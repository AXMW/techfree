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

    // 1. Verifica assinatura antes de publicar
    try {
        const respPerfil = await fetch('/empresa/perfil/verPerfil', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
        if (respPerfil.ok) {
            const perfil = await respPerfil.json();
            if (!perfil.assinaturaPath) {
                // Cria modal se não existir
                let modalAssinatura = document.getElementById('modalAssinaturaObrigatoria');
                if (!modalAssinatura) {
                    modalAssinatura = document.createElement('div');
                    modalAssinatura.className = 'modal fade';
                    modalAssinatura.id = 'modalAssinaturaObrigatoria';
                    modalAssinatura.tabIndex = -1;
                    modalAssinatura.innerHTML = `
                        <div class="modal-dialog" style="min-width: 420px; max-width: 600px;">
                          <div class="modal-content">
                            <div class="modal-header">
                              <h5 class="modal-title">Assinatura obrigatória</h5>
                              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                            </div>
                            <div class="modal-body">
                              Você não tem uma assinatura cadastrada, por favor acesse a edição do seu perfil e faça o upload de uma assinatura para continuar o processo de publicação de oportunidade.
                            </div>
                            <div class="modal-footer d-flex justify-content-center gap-2">
                              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                              <a href="/pagina-profile-empresa-editar" class="btn btn-secondary">Ir para configurações de perfil</a>
                            </div>
                          </div>
                        </div>
                    `;
                    document.body.appendChild(modalAssinatura);
                }
                const modal = new bootstrap.Modal(modalAssinatura);
                modal.show();
                // Impede qualquer outro submit ou mensagem
                return false;
            }
        } else {
            alert('Erro ao verificar assinatura da empresa.');
            return;
        }
    } catch (err) {
        alert('Erro ao verificar assinatura da empresa.');
        return;
    }

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

    // Pegue o arquivo
    const anexoInput = document.getElementById('anexo');
    let anexoAuxiliar = '';
    if (anexoInput.files.length === 0) {
        alert('O campo Briefing é obrigatório. Por favor, anexe um arquivo.');
        return;
    }
    if (anexoInput.files.length > 0) {
        const formData = new FormData();
        formData.append('file', anexoInput.files[0]);
        const resp = await fetch('/api/files/upload', {
            method: 'POST',
            body: formData
        });
        if (resp.ok) {
            anexoAuxiliar = await resp.text(); // ou resp.json() dependendo do backend
        } else {
            alert('Erro ao enviar arquivo');
            return;
        }
    }

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
        descricao: descricao,
        anexoAuxiliar: anexoAuxiliar // <-- aqui está o caminho do arquivo
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

    // Só mostra mensagem de sucesso se realmente foi publicada
    // (essa função não deve mostrar alert, pois o submit já é controlado acima)
    // this.reset();
    // tags = [];
    // document.querySelectorAll('.tag').forEach(el => el.remove());
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

    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) aplicarMascaraTelefone(telefoneInput);
});

function aplicarMascaraTelefone(input) {
    input.addEventListener('input', function() {
        let v = input.value.replace(/\D/g, '');
        if (v.length > 11) v = v.slice(0, 11);
        if (v.length > 0) v = '(' + v;
        if (v.length > 3) v = v.slice(0, 3) + ') ' + v.slice(3);
        if (v.length > 10) v = v.slice(0, 10) + '-' + v.slice(10);
        else if (v.length > 6) v = v.slice(0, 9) + (v.length > 6 ? '-' + v.slice(9) : '');
        if (v.endsWith('-')) v = v.slice(0, -1);
        input.value = v;
    });
}

// UPLOAD DE ARQUIVO
const uploadArea = document.getElementById('uploadArea');
const inputFile = document.getElementById('anexo');
const nomeArquivo = document.getElementById('nomeArquivoSelecionado');
const btnSelecionar = document.getElementById('btnSelecionarArquivo');

btnSelecionar.onclick = () => inputFile.click();
uploadArea.onclick = (e) => {
    if (e.target === uploadArea) inputFile.click();
};
inputFile.onchange = () => {
    nomeArquivo.textContent = inputFile.files.length ? inputFile.files[0].name : '';
};
// Drag and drop (opcional)
uploadArea.ondragover = e => { e.preventDefault(); uploadArea.classList.add('bg-secondary'); };
uploadArea.ondragleave = e => { e.preventDefault(); uploadArea.classList.remove('bg-secondary'); };
uploadArea.ondrop = e => {
    e.preventDefault();
    uploadArea.classList.remove('bg-secondary');
    if (e.dataTransfer.files.length) {
        inputFile.files = e.dataTransfer.files;
        nomeArquivo.textContent = inputFile.files[0].name;
    }
};


