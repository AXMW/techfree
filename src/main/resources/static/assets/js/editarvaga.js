// Dados simulados iniciais
const vaga = {
    titulo: "Desenvolvedor Front-end",
    grau: "Pleno",
    modalidade: "Remoto",
    local: "São Paulo, SP",
    carga: "20h/semana",
    faixa: "R$ 2.000 - R$ 3.000",
    prazo: "3 meses",
    linguagens: ["React", "Node.js"],
    descricao: "Descreva o projeto, desafios e responsabilidades...",
    requisitos: "React, Node.js, experiência com APIs...",
    diferenciais: "Experiência com Figma, inglês avançado...",
    beneficios: "Horário flexível, bônus por entrega...",
    contato: "empresa@email.com"
};

let editingField = null;
let linguagensTemp = [...vaga.linguagens];

// Função para renderizar os campos
function renderFields() {
    for (const key in vaga) {
        if (key === "linguagens") {
            const linguagensSpan = document.getElementById("display-linguagens");
            linguagensSpan.innerHTML = vaga.linguagens.map(l => `<span class="tag">${l}</span>`).join('');
        } else {
            const el = document.getElementById("display-" + key);
            if (el) el.textContent = vaga[key];
        }
    }
    // Mostra todos os campos no modo visualização
    document.querySelectorAll(".edit-field-value").forEach(el => el.classList.remove("editing"));
    document.getElementById("btnSalvar").style.display = "none";
    document.getElementById("btnCancelar").style.display = "none";
    editingField = null;
}

renderFields();

// Função para abrir modo de edição
function openEdit(field) {
    if (editingField) return;
    editingField = field;
    document.getElementById("btnSalvar").style.display = "inline-block";
    document.getElementById("btnCancelar").style.display = "inline-block";
    // Troca o campo para input
    const value = vaga[field];
    const fieldDiv = document.querySelector(`.edit-field-value[data-field='${field}']`);
    fieldDiv.classList.add("editing");
    let inputHtml = "";
    if (field === "grau") {
        inputHtml = `<select class="edit-select" id="input-${field}">
            <option>Júnior</option>
            <option>Pleno</option>
            <option>Sênior</option>
            <option>Todos os níveis</option>
        </select>`;
    } else if (field === "modalidade") {
        inputHtml = `<select class="edit-select" id="input-${field}">
            <option>Remoto</option>
            <option>Presencial</option>
            <option>Híbrido</option>
        </select>`;
    } else if (field === "descricao" || field === "requisitos" || field === "diferenciais" || field === "beneficios") {
        inputHtml = `<textarea class="edit-textarea" id="input-${field}" rows="2">${value}</textarea>`;
    } else if (field === "linguagens") {
        inputHtml = `<div id="linguagens-edit-tags"></div>
            <input class="edit-input mt-2" id="input-linguagens" type="text" placeholder="Adicionar tecnologia e Enter">`;
    } else {
        inputHtml = `<input class="edit-input" id="input-${field}" type="text" value="${value}">`;
    }
    fieldDiv.innerHTML = `<span style="width:100%">${inputHtml}</span>`;
    // Preenche selects
    if (field === "grau" || field === "modalidade") {
        document.getElementById("input-" + field).value = value;
    }
    // Tags para linguagens
    if (field === "linguagens") {
        renderTagsEdit();
        document.getElementById("input-linguagens").addEventListener("keydown", function(e) {
            if (e.key === "Enter") {
                e.preventDefault();
                let val = this.value.trim();
                if (val && !linguagensTemp.includes(val)) {
                    linguagensTemp.push(val);
                    renderTagsEdit();
                }
                this.value = "";
            }
        });
    }
}

// Renderiza tags no modo edição
function renderTagsEdit() {
    const container = document.getElementById("linguagens-edit-tags");
    container.innerHTML = "";
    linguagensTemp.forEach(tag => {
        const span = document.createElement("span");
        span.className = "tag";
        span.textContent = tag;
        const remove = document.createElement("span");
        remove.className = "remove-tag";
        remove.innerHTML = "&times;";
        remove.onclick = function() {
            linguagensTemp = linguagensTemp.filter(t => t !== tag);
            renderTagsEdit();
        };
        span.appendChild(remove);
        container.appendChild(span);
    });
}

// Clique no ícone de editar
document.querySelectorAll(".edit-field-value .edit-icon").forEach(icon => {
    icon.addEventListener("click", function(e) {
        e.stopPropagation();
        const field = this.parentElement.getAttribute("data-field");
        // Se já estiver editando outro campo, fecha o anterior SEM salvar
        if (editingField && editingField !== field) {
            // Apenas volta ao modo visualização, sem salvar alterações pendentes
            renderFields();
            setTimeout(() => openEdit(field), 10);
        } else if (!editingField) {
            openEdit(field);
        }
    });
});

// Impede abrir edição ao clicar no campo, só permite pelo ícone
document.querySelectorAll(".edit-field-value").forEach(el => {
    el.addEventListener("click", function(e) {
        // Não faz nada se clicar fora do ícone
    });
});

// Cancelar edição
document.getElementById("btnCancelar").onclick = function() {
    linguagensTemp = [...vaga.linguagens];
    renderFields();
};

// Salvar edição
document.getElementById("btnSalvar").onclick = function() {
    if (!editingField) return;
    let val;
    if (editingField === "linguagens") {
        vaga.linguagens = [...linguagensTemp];
    } else {
        const input = document.getElementById("input-" + editingField);
        if (input) val = input.value;
        vaga[editingField] = val;
    }
    renderFields();
};