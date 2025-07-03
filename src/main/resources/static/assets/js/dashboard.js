// Identificação do tipoUsuario igual ao gerenciarprojeto.js
document.addEventListener('DOMContentLoaded', async function() {
  // Função utilitária para gerar relatório em PDF (usando jsPDF)
  async function gerarRelatorioDashboard() {
    const tipoUsuario = (localStorage.getItem('tipoUsuario') || '').toLowerCase();
    const token = localStorage.getItem('token');
    // Carregar jsPDF dinamicamente se não estiver presente
    if (typeof window.jspdf === 'undefined' && typeof window.jsPDF === 'undefined') {
      await new Promise(resolve => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script.onload = resolve;
        document.body.appendChild(script);
      });
    }
    const jsPDF = window.jspdf ? window.jspdf.jsPDF : window.jsPDF;
    const doc = new jsPDF();
    let y = 20;
    let algumGrafico = false;

    // Função para adicionar gráfico ao PDF, cada gráfico em uma página
    async function addChartToPDF(canvas, titulo) {
      if (algumGrafico) {
        doc.addPage();
        y = 20;
      }
      const imgData = canvas.toDataURL('image/png', 1.0);
      doc.setFontSize(16);
      doc.text(titulo, 10, y);
      y += 5;
      doc.addImage(imgData, 'PNG', 10, y, 180, 60);
      y += 65;
      algumGrafico = true;
    }

    // Gráfico 1: Projetos por mês/ano
    if (tipoUsuario === 'empresa') {
      // Gráfico 1: Projetos por mês
      try {
        const resp = await fetch('/dashboard/empresa/colunas', {
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
          }
        });
        if (resp.ok) {
          const canvas = document.getElementById('graficoProjetosAno');
          if (canvas && canvas.chartInstance && canvas.chartInstance.data && canvas.chartInstance.data.datasets[0].data.some(v => v > 0)) {
            await addChartToPDF(canvas, 'Quantidade de Projetos por Mês');
          }
        }
      } catch {}
    } else if (tipoUsuario === 'freelancer') {
      // Gráfico 1: Projetos concluídos por ano
      try {
        const resp = await fetch('/dashboard/freelancer/colunas', {
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
          }
        });
        if (resp.ok) {
          const canvas = document.getElementById('graficoProjetosAno');
          if (canvas && canvas.chartInstance && canvas.chartInstance.data && canvas.chartInstance.data.datasets[0].data.some(v => v > 0)) {
            await addChartToPDF(canvas, 'Projetos Concluídos por Ano');
          }
        }
      } catch {}
    }

    // Gráfico 2: Avaliações dos freelancers / Área de atuação das empresas contratantes
    if (tipoUsuario === 'empresa') {
      try {
        const resp = await fetch('/dashboard/empresa/pizza', {
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
          }
        });
        if (resp.ok) {
          const grafico2 = document.getElementById('tituloGrafico2')?.parentElement.querySelector('canvas');
          if (grafico2 && grafico2.chartInstance && grafico2.chartInstance.data && grafico2.chartInstance.data.datasets[0].data.some(v => v > 0)) {
            await addChartToPDF(grafico2, 'Avaliações dos Freelancers');
          }
        }
      } catch {}
    } else if (tipoUsuario === 'freelancer') {
      try {
        const resp = await fetch('/dashboard/freelancer/pizza', {
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
          }
        });
        if (resp.ok) {
          const grafico2 = document.getElementById('tituloGrafico2')?.parentElement.querySelector('canvas');
          if (grafico2 && grafico2.chartInstance && grafico2.chartInstance.data && grafico2.chartInstance.data.datasets[0].data.some(v => v > 0)) {
            await addChartToPDF(grafico2, 'Área de Atuação das Empresas Contratantes');
          }
        }
      } catch {}
    }

    // Gráfico 3: Investimento/Receita Mensal
    if (tipoUsuario === 'empresa') {
      try {
        const resp = await fetch('/dashboard/empresa/linhas', {
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
          }
        });
        if (resp.ok) {
          const grafico3 = document.querySelector('#tituloGrafico3 ~ .mb-3 canvas');
          if (grafico3 && grafico3.chartInstance && grafico3.chartInstance.data && grafico3.chartInstance.data.datasets[0].data.some(v => v > 0)) {
            await addChartToPDF(grafico3, 'Investimento Mensal');
          }
        }
      } catch {}
    } else if (tipoUsuario === 'freelancer') {
      try {
        const resp = await fetch('/dashboard/freelancer/linhas', {
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
          }
        });
        if (resp.ok) {
          const grafico3 = document.querySelector('#tituloGrafico3 ~ .mb-3 canvas');
          if (grafico3 && grafico3.chartInstance && grafico3.chartInstance.data && grafico3.chartInstance.data.datasets[0].data.some(v => v > 0)) {
            await addChartToPDF(grafico3, 'Receita Mensal');
          }
        }
      } catch {}
    }

    if (!algumGrafico) {
      alert('Nenhum gráfico disponível para gerar relatório.');
      return;
    }
    doc.save('relatorio-dashboard.pdf');
  }

  // Adiciona evento ao botão de gerar relatório
  const btnRelatorio = document.querySelector('a.btn.btn-primary.btn-sm.mt-3, button.btn.btn-primary.btn-sm.mt-3');
  if (btnRelatorio) {
    btnRelatorio.addEventListener('click', function(e) {
      e.preventDefault();
      gerarRelatorioDashboard();
    });
  }
  const tipoUsuario = (localStorage.getItem('tipoUsuario') || '').toLowerCase();
  var titulo = document.getElementById('tituloProjetosAno');
  var grafico = document.getElementById('graficoProjetosAno');
  // Adiciona referência à descrição do gráfico 1
  var descricaoGrafico1 = document.getElementById('descricaoGrafico1');
  // Gráfico 2: título dinâmico
  var tituloGrafico2 = document.getElementById('tituloGrafico2');
  var grafico2 = tituloGrafico2 ? tituloGrafico2.parentElement.querySelector('canvas') : null;
  // Adiciona referência à descrição do gráfico 2
  var descricaoGrafico2 = document.getElementById('descricaoGrafico2');
  if (tituloGrafico2) {
    if (tipoUsuario === 'empresa') {
      tituloGrafico2.textContent = 'AVALIAÇÕES DOS FREELANCERS';
      if (descricaoGrafico2) {
        descricaoGrafico2.textContent = 'Este gráfico reúne as notas atribuídas pela empresa aos freelancers contratados, após a conclusão dos projetos. Ele oferece uma visão clara da percepção de qualidade, pontualidade e profissionalismo dos profissionais envolvidos, sendo uma métrica valiosa para mapear parcerias bem-sucedidas e orientar futuras contratações.';
        descricaoGrafico2.style.display = 'block';
        descricaoGrafico2.style.marginTop = '0.5rem';
        descricaoGrafico2.style.marginBottom = '1rem';
      }
      // ...existing code for empresa (gráfico de avaliações dos freelancers)...
      if (grafico2) {
        try {
          const token = localStorage.getItem('token');
          const resp = await fetch('/dashboard/empresa/pizza', {
            headers: {
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + token
            }
          });
          let data = [];
          let notasFiltradas = [];
          let valoresFiltrados = [];
          // Montar array de notas de 0 a 5, de 0.5 em 0.5
          const notas = [];
          for (let n = 0; n <= 10; n++) {
            notas.push((n * 0.5).toFixed(1).replace('.0',''));
          }
          if (resp.status === 404) {
            // Gráfico com valor 0 e item 0
            notasFiltradas = ['0'];
            valoresFiltrados = [0];
          } else if (!resp.ok) {
            throw new Error('Erro ao buscar dados do gráfico de avaliações');
          } else {
            data = await resp.json();
            // Contar quantidade de avaliações por nota
            const contagem = {};
            notas.forEach(nota => contagem[nota] = 0);
            data.forEach(item => {
              if (item.nota != null) {
                let notaStr = Number(item.nota).toFixed(1).replace('.0','');
                if (contagem.hasOwnProperty(notaStr)) {
                  contagem[notaStr]++;
                }
              }
            });
            // Filtra apenas notas com pelo menos 1 ocorrência
            notasFiltradas = notas.filter(nota => contagem[nota] > 0);
            valoresFiltrados = notasFiltradas.map(nota => contagem[nota]);
            // Se não houver dados, mostra gráfico com valor 0 e item 0
            if (notasFiltradas.length === 0) {
              notasFiltradas = ['0'];
              valoresFiltrados = [0];
            }
          }
          // Cores para cada nota (mantém ordem original)
          const cores = [
            '#1cc88a', // 0
            '#422a2a', // 0.5
            '#36b9cc', // 1
            '#e74a3b', // 1.5
            '#858796', // 2
            '#4e73df', // 2.5
            '#ff5fd7', // 3
            '#ae57ff', // 3.5
            '#675fff', // 4
            '#f6c23e', // 4.5
            '#ff6961'  // 5
          ];
          const coresFiltradas = notasFiltradas.map(nota => cores[notas.indexOf(nota)] || '#1cc88a');
          // Remove o atributo data-bss-chart para evitar conflito
          if (grafico2.hasAttribute('data-bss-chart')) {
            grafico2.removeAttribute('data-bss-chart');
          }
          // Atualiza o gráfico (Chart.js)
          if (grafico2 && window.Chart) {
            if (grafico2.chartInstance) {
              grafico2.chartInstance.destroy();
            }
            grafico2.chartInstance = new Chart(grafico2.getContext('2d'), {
              type: 'doughnut',
              data: {
                labels: notasFiltradas,
                datasets: [{
                  label: 'Avaliações',
                  backgroundColor: coresFiltradas,
                  borderColor: '#fff',
                  data: valoresFiltrados
                }]
              },
              options: {
                maintainAspectRatio: false,
                legend: { display: true, position: 'bottom', labels: { fontStyle: 'normal' } },
                title: { display: false },
                tooltips: { enabled: true }
              }
            });
          }
        } catch (e) {
          if (grafico2) {
            grafico2.parentElement.innerHTML = '<div class="text-danger">Erro ao carregar gráfico de avaliações dos freelancers.</div>';
          }
        }
      }
    } else {
      tituloGrafico2.textContent = 'ÁREA DE ATUAÇÃO DAS EMPRESAS CONTRATANTES';
      if (descricaoGrafico2) {
        descricaoGrafico2.textContent = 'Este gráfico mostra a distribuição dos setores de atuação das empresas que contrataram seus serviços na plataforma. A análise dessas áreas ajuda a entender o perfil dos contratantes, identificar nichos de mercado mais ativos e orientar estratégias de posicionamento e especialização.';
        descricaoGrafico2.style.display = 'block';
        descricaoGrafico2.style.marginTop = '0.5rem';
        descricaoGrafico2.style.marginBottom = '1rem';
      }
      // Gráfico de área de atuação das empresas contratantes para freelancer
      if (grafico2) {
        try {
          const token = localStorage.getItem('token');
          const resp = await fetch('/dashboard/freelancer/pizza', {
            headers: {
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + token
            }
          });
          let labels = [];
          let valores = [];
          if (resp.status === 404) {
            // Gráfico com valor 0 e item 0
            labels = ['0'];
            valores = [0];
          } else if (!resp.ok) {
            throw new Error('Erro ao buscar dados do gráfico de áreas de atuação');
          } else {
            let data = await resp.json();
            // Contar quantidade de cada área de atuação
            const contagem = {};
            data.forEach(item => {
              if (item.areaAtuacao) {
                contagem[item.areaAtuacao] = (contagem[item.areaAtuacao] || 0) + 1;
              }
            });
            // Ordenar áreas por quantidade (decrescente) e pegar as 5 mais frequentes
            const topAreas = Object.entries(contagem)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5);
            labels = topAreas.map(([area]) => area);
            valores = topAreas.map(([_, qtd]) => qtd);
            // Se não houver dados, mostra gráfico com valor 0 e item 0
            if (labels.length === 0) {
              labels = ['0'];
              valores = [0];
            }
          }
          // Cores para as áreas (padrão, pode customizar)
          const cores = [
            '#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b'
          ];
          // Remove o atributo data-bss-chart para evitar conflito
          if (grafico2.hasAttribute('data-bss-chart')) {
            grafico2.removeAttribute('data-bss-chart');
          }
          // Atualiza o gráfico (Chart.js)
          if (grafico2 && window.Chart) {
            if (grafico2.chartInstance) {
              grafico2.chartInstance.destroy();
            }
            grafico2.chartInstance = new Chart(grafico2.getContext('2d'), {
              type: 'doughnut',
              data: {
                labels: labels,
                datasets: [{
                  label: 'Áreas de Atuação',
                  backgroundColor: cores,
                  borderColor: '#fff',
                  data: valores
                }]
              },
              options: {
                maintainAspectRatio: false,
                legend: { display: true, position: 'bottom', labels: { fontStyle: 'normal' } },
                title: { display: false },
                tooltips: { enabled: true }
              }
            });
          }
        } catch (e) {
          if (grafico2) {
            grafico2.parentElement.innerHTML = '<div class="text-danger">Erro ao carregar gráfico de áreas de atuação das empresas contratantes.</div>';
          }
        }
      }
    }
  }
  // Gráfico 3: título dinâmico
  var tituloGrafico3 = document.getElementById('tituloGrafico3');
  // Adiciona referência à descrição do gráfico 3
  var descricaoGrafico3 = document.getElementById('descricaoGrafico3');
  if (tituloGrafico3) {
    if (tipoUsuario === 'empresa') {
      tituloGrafico3.textContent = 'INVESTIMENTO MENSAL';
      if (descricaoGrafico3) {
        descricaoGrafico3.textContent = 'Este gráfico exibe o valor total investido mensalmente em contratações de freelancers através da plataforma. Ele permite à empresa acompanhar os custos operacionais com mão de obra externa, comparar o investimento ao longo dos meses e auxiliar no planejamento orçamentário e estratégico.';
        descricaoGrafico3.style.display = 'block';
        descricaoGrafico3.style.marginTop = '0.5rem';
        descricaoGrafico3.style.marginBottom = '1rem';
      }
      // Montar gráfico de investimento mensal para empresa
      var grafico3 = document.querySelector('#tituloGrafico3 ~ .mb-3 canvas');
      if (grafico3) {
        try {
          const token = localStorage.getItem('token');
          const resp = await fetch('/dashboard/empresa/linhas', {
            headers: {
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + token
            }
          });
          let data = [];
          if (resp.status === 404) {
            // Endpoint não existe ou não há dados, gráfico vazio
            data = [];
          } else if (!resp.ok) {
            throw new Error('Erro ao buscar dados do gráfico de investimento');
          } else {
            data = await resp.json();
          }
          // Encontrar o mês mais recente nos dados
          let maxData = null;
          data.forEach(item => {
            if (item.prazoEntrega) {
              const dt = new Date(item.prazoEntrega);
              if (!maxData || dt > maxData) {
                maxData = dt;
              }
            }
          });
          // Se não houver dados, usa o mês atual
          if (!maxData) maxData = new Date();
          // Monta os últimos 12 meses a partir do mês mais recente dos dados
          const mesesLabels = [];
          const mesesChave = [];
          const mesesAbrev = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
          for (let i = 11; i >= 0; i--) {
            const d = new Date(maxData.getFullYear(), maxData.getMonth() - i, 1);
            const chave = d.getFullYear() + '-' + (d.getMonth() + 1).toString().padStart(2, '0');
            mesesChave.push(chave);
            mesesLabels.push(mesesAbrev[d.getMonth()] + '/' + d.getFullYear().toString().slice(-2));
          }
          // Soma orçamento por mês
          const somaPorMes = {};
          data.forEach(item => {
            if (item.prazoEntrega && item.orcamento != null && !isNaN(Number(item.orcamento))) {
              const dt = new Date(item.prazoEntrega);
              const chave = dt.getFullYear() + '-' + (dt.getMonth() + 1).toString().padStart(2, '0');
              if (mesesChave.includes(chave)) {
                somaPorMes[chave] = (somaPorMes[chave] || 0) + Number(item.orcamento);
              }
            }
          });
          const valores = mesesChave.map(chave => somaPorMes[chave] || 0);
          // Eixo Y: de 0 até o próximo múltiplo de 1000 acima do maior valor, step 1000
          let maxY = Math.max(...valores);
          let stepY = 1000;
          if (maxY > 1000000000) {
            stepY = 1000000000;
          } else if (maxY > 1000000) {
            stepY = 1000000;
          } else if (maxY > 100000) {
            stepY = 100000;
          } else if (maxY > 10000) {
            stepY = 10000;
          } else if (maxY > 1000) {
            stepY = 1000;
          } else if (maxY > 100) {
            stepY = 100;
          } else if (maxY > 10) {
            stepY = 10;
          } else {
            stepY = 5;
          }
          let yMax = stepY;
          if (maxY > 0) {
            yMax = Math.ceil(maxY / stepY) * stepY;
          }
          // Remove o atributo data-bss-chart para evitar conflito
          if (grafico3.hasAttribute('data-bss-chart')) {
            grafico3.removeAttribute('data-bss-chart');
          }
          // Atualiza o gráfico (Chart.js)
          if (grafico3 && window.Chart) {
            if (grafico3.chartInstance) {
              grafico3.chartInstance.destroy();
            }
            grafico3.chartInstance = new Chart(grafico3.getContext('2d'), {
              type: 'line',
              data: {
                labels: mesesLabels,
                datasets: [{
                  label: 'Earnings',
                  fill: true,
                  data: valores,
                  backgroundColor: 'rgba(255, 95, 215, 0.05)',
                  borderColor: '#ff5fd7',
                  pointBackgroundColor: '#ff5fd7',
                  pointBorderColor: '#fff',
                  pointHoverBackgroundColor: '#fff',
                  pointHoverBorderColor: '#ff5fd7'
                }]
              },
              options: {
                maintainAspectRatio: false,
                legend: { display: false, labels: { fontStyle: 'normal' } },
                title: { fontStyle: 'normal', display: false, position: 'top' },
                tooltips: { enabled: true },
                hover: { mode: 'index', intersect: false },
                scales: {
                  xAxes: [{
                    gridLines: {
                      color: 'rgb(234, 236, 244)',
                      zeroLineColor: 'rgb(234, 236, 244)',
                      drawBorder: false,
                      drawTicks: false,
                      borderDash: [2],
                      zeroLineBorderDash: [2],
                      drawOnChartArea: false
                    },
                    ticks: {
                      fontColor: '#858796',
                      fontStyle: 'normal',
                      padding: 20
                    }
                  }],
                  yAxes: [{
                    gridLines: {
                      color: 'rgb(234, 236, 244)',
                      zeroLineColor: 'rgb(234, 236, 244)',
                      drawBorder: false,
                      drawTicks: false,
                      borderDash: [2],
                      zeroLineBorderDash: [2],
                      drawOnChartArea: true
                    },
                    ticks: {
                      fontColor: '#858796',
                      fontStyle: 'normal',
                      padding: 20,
                      beginAtZero: true,
                      min: 0,
                      max: yMax,
                      stepSize: stepY
                    }
                  }]
                }
              }
            });
          }
        } catch (e) {
          if (grafico3) {
            grafico3.parentElement.innerHTML = '<div class="text-danger">Erro ao carregar gráfico de investimento mensal.</div>';
          }
        }
      }
    } else {
      tituloGrafico3.textContent = 'RECEITA MENSAL';
      if (descricaoGrafico3) {
        descricaoGrafico3.textContent = 'Este gráfico exibe os valores recebidos mês a mês ao longo de um período determinado. Ele auxilia no acompanhamento do fluxo de receita, sazonalidade de faturamento e na projeção de metas financeiras, úteis para freelancers que desejam fazer acompanhamentos precisos dentro da plataforma.';
        descricaoGrafico3.style.display = 'block';
        descricaoGrafico3.style.marginTop = '0.5rem';
        descricaoGrafico3.style.marginBottom = '1rem';
      }
      // Montar gráfico de receita mensal para freelancer (mesma lógica do de investimento mensal)
      var grafico3 = document.querySelector('#tituloGrafico3 ~ .mb-3 canvas');
      if (grafico3) {
        try {
          const token = localStorage.getItem('token');
          const resp = await fetch('/dashboard/freelancer/linhas', {
            headers: {
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + token
            }
          });
          let data = [];
          if (resp.status === 404) {
            // Endpoint não existe ou não há dados, gráfico vazio
            data = [];
          } else if (!resp.ok) {
            throw new Error('Erro ao buscar dados do gráfico de receita');
          } else {
            data = await resp.json();
          }
          // Encontrar o mês mais recente nos dados
          let maxData = null;
          data.forEach(item => {
            if (item.prazoEntrega) {
              const dt = new Date(item.prazoEntrega);
              if (!maxData || dt > maxData) {
                maxData = dt;
              }
            }
          });
          // Se não houver dados, usa o mês atual
          if (!maxData) maxData = new Date();
          // Monta os últimos 12 meses a partir do mês mais recente dos dados
          const mesesLabels = [];
          const mesesChave = [];
          const mesesAbrev = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
          // Gera os últimos 12 meses a partir do mês mais recente, respeitando transição de ano
          let ano = maxData.getFullYear();
          let mes = maxData.getMonth(); // 0-11
          // Monta os meses do mais antigo (esquerda) para o mais recente (direita)
          for (let i = 0; i < 12; i++) {
            let d = new Date(ano, mes - 11 + i, 1);
            let chave = d.getFullYear() + '-' + (d.getMonth() + 1).toString().padStart(2, '0');
            mesesChave.push(chave);
            mesesLabels.push(mesesAbrev[d.getMonth()] + '/' + d.getFullYear().toString().slice(-2));
          }
          // Soma orçamento por mês
          const somaPorMes = {};
          data.forEach(item => {
            if (item.prazoEntrega && item.orcamento != null && !isNaN(Number(item.orcamento))) {
              const dt = new Date(item.prazoEntrega);
              const chave = dt.getFullYear() + '-' + (dt.getMonth() + 1).toString().padStart(2, '0');
              if (mesesChave.includes(chave)) {
                somaPorMes[chave] = (somaPorMes[chave] || 0) + Number(item.orcamento);
              }
            }
          });
          const valores = mesesChave.map(chave => somaPorMes[chave] || 0);
          // Eixo Y: de 0 até o próximo múltiplo de 1000 acima do maior valor, step 1000
          let maxY = Math.max(...valores);
          let stepY = 1000;
          if (maxY > 1000000000) {
            stepY = 1000000000;
          } else if (maxY > 1000000) {
            stepY = 1000000;
          } else if (maxY > 100000) {
            stepY = 100000;
          } else if (maxY > 10000) {
            stepY = 10000;
          } else if (maxY > 1000) {
            stepY = 1000;
          } else if (maxY > 100) {
            stepY = 100;
          } else if (maxY > 10) {
            stepY = 10;
          } else {
            stepY = 5;
          }
          let yMax = stepY;
          if (maxY > 0) {
            yMax = Math.ceil(maxY / stepY) * stepY;
          }
          // Remove o atributo data-bss-chart para evitar conflito
          if (grafico3.hasAttribute('data-bss-chart')) {
            grafico3.removeAttribute('data-bss-chart');
          }
          // Atualiza o gráfico (Chart.js)
          if (grafico3 && window.Chart) {
            if (grafico3.chartInstance) {
              grafico3.chartInstance.destroy();
            }
            grafico3.chartInstance = new Chart(grafico3.getContext('2d'), {
              type: 'line',
              data: {
                labels: mesesLabels,
                datasets: [{
                  label: 'Earnings',
                  fill: true,
                  data: valores,
                  backgroundColor: 'rgba(255, 95, 215, 0.05)',
                  borderColor: '#ff5fd7',
                  pointBackgroundColor: '#ff5fd7',
                  pointBorderColor: '#fff',
                  pointHoverBackgroundColor: '#fff',
                  pointHoverBorderColor: '#ff5fd7'
                }]
              },
              options: {
                maintainAspectRatio: false,
                legend: { display: false, labels: { fontStyle: 'normal' } },
                title: { fontStyle: 'normal', display: false, position: 'top' },
                tooltips: { enabled: true },
                hover: { mode: 'index', intersect: false },
                scales: {
                  xAxes: [{
                    gridLines: {
                      color: 'rgb(234, 236, 244)',
                      zeroLineColor: 'rgb(234, 236, 244)',
                      drawBorder: false,
                      drawTicks: false,
                      borderDash: [2],
                      zeroLineBorderDash: [2],
                      drawOnChartArea: false
                    },
                    ticks: {
                      fontColor: '#858796',
                      fontStyle: 'normal',
                      padding: 20
                    }
                  }],
                  yAxes: [{
                    gridLines: {
                      color: 'rgb(234, 236, 244)',
                      zeroLineColor: 'rgb(234, 236, 244)',
                      drawBorder: false,
                      drawTicks: false,
                      borderDash: [2],
                      zeroLineBorderDash: [2],
                      drawOnChartArea: true
                    },
                    ticks: {
                      fontColor: '#858796',
                      fontStyle: 'normal',
                      padding: 20,
                      beginAtZero: true,
                      min: 0,
                      max: yMax,
                      stepSize: stepY
                    }
                  }]
                }
              }
            });
          }
        } catch (e) {
          if (grafico3) {
            grafico3.parentElement.innerHTML = '<div class="text-danger">Erro ao carregar gráfico de receita mensal.</div>';
          }
        }
      }
    }
  }
  // Gráfico 2: título dinâmico
  var tituloGrafico2 = document.getElementById('tituloGrafico2');
  if (tituloGrafico2) {
    if (tipoUsuario === 'empresa') {
      tituloGrafico2.textContent = 'AVALIAÇÕES DOS FREELANCERS';
    } else {
      tituloGrafico2.textContent = 'ÁREA DE ATUAÇÃO DAS EMPRESAS CONTRATANTES';
    }
  }
  if (titulo) {
    if (tipoUsuario === 'empresa') {
      titulo.textContent = 'QUANTIDADE DE PROJETOS POR MÊS';
      if (descricaoGrafico1) {
        descricaoGrafico1.textContent = 'Este gráfico apresenta o número de projetos finalizados a cada mês pela empresa. A visualização permite acompanhar o ritmo de contratações e entregas ao longo do tempo, identificar padrões de sazonalidade na demanda e avaliar o volume de trabalho efetivamente encerrado em cada período.';
        descricaoGrafico1.style.display = 'block';
        descricaoGrafico1.style.marginTop = '0.5rem';
        descricaoGrafico1.style.marginBottom = '1rem';
      }
      // Buscar dados do endpoint e montar gráfico
      try {
        const token = localStorage.getItem('token');
        const resp = await fetch('/dashboard/empresa/colunas', {
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
          }
        });
        let data = [];
        if (resp.status === 404) {
          data = [];
        } else if (!resp.ok) {
          throw new Error('Erro ao buscar dados do gráfico');
        } else {
          data = await resp.json();
        }
        // Processar datas para contar por mês
        const meses = [];
        const mesesAbrev = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const counts = [];
        const now = new Date();
        const anoAtual = now.getFullYear();
        // Gera array dos meses do ano atual (ex: ["Jan", ..., "Dez"])
        const mesesChave = [];
        for (let i = 0; i < 12; i++) {
          const chave = (i + 1).toString().padStart(2, '0') + '/' + anoAtual;
          mesesChave.push(chave);
          meses.push(mesesAbrev[i]);
        }
        // Conta quantas datas em cada mês
        const contagem = {};
        data.forEach(item => {
          if (item.dataInicio) {
            const dt = new Date(item.dataInicio);
            if (dt.getFullYear() === anoAtual) {
              const chave = (dt.getMonth() + 1).toString().padStart(2, '0') + '/' + dt.getFullYear();
              contagem[chave] = (contagem[chave] || 0) + 1;
            }
          }
        });
        // Se o endpoint retornou 404, mostra gráfico vazio
        if (resp.status === 404) {
          mesesChave.forEach(chave => counts.push(0));
        } else {
          mesesChave.forEach(chave => counts.push(contagem[chave] || 0));
        }
        mesesChave.forEach(chave => counts.push(contagem[chave] || 0));
        // Calcula o valor máximo do eixo Y arredondado para cima de 5 em 5
        const maxY = Math.max(...counts);
        // Regra dinâmica para stepY igual receita/investimento mensal
        let stepY = 5;
        if (maxY > 1000000000) {
          stepY = 1000000000;
        } else if (maxY > 1000000) {
          stepY = 1000000;
        } else if (maxY > 100000) {
          stepY = 100000;
        } else if (maxY > 10000) {
          stepY = 10000;
        } else if (maxY > 1000) {
          stepY = 1000;
        } else if (maxY > 100) {
          stepY = 100;
        } else if (maxY > 10) {
          stepY = 10;
        }
        let yMax = stepY;
        if (maxY > 0) {
          yMax = Math.ceil(maxY / stepY) * stepY;
        }
        // Remove o atributo data-bss-chart para evitar conflito com scripts de template
        if (grafico.hasAttribute('data-bss-chart')) {
          grafico.removeAttribute('data-bss-chart');
        }
        // Atualiza o gráfico
        if (grafico && window.Chart) {
          // Remove gráfico anterior se existir
          if (grafico.chartInstance) {
            grafico.chartInstance.destroy();
          }
          grafico.chartInstance = new Chart(grafico.getContext('2d'), {
            type: 'bar',
            data: {
              labels: meses,
              datasets: [{
                label: 'Projetos',
                backgroundColor: '#4e73df',
                borderColor: '#4e73df',
                data: counts
              }]
            },
            options: {
              maintainAspectRatio: true,
              legend: { display: true, labels: { fontStyle: 'normal', fontColor: '#fff' } },
              title: { fontStyle: 'bold', fontColor: '#fff' },
              tooltips: { enabled: true },
              hover: { mode: 'index', intersect: false },
              scales: {
                xAxes: [{ ticks: { fontStyle: 'normal', fontColor: '#fff' } }],
                yAxes: [{ ticks: { fontStyle: 'normal', fontColor: '#fff', stepSize: stepY, min: 0, max: yMax } }]
              }
            }
          });
        }
      } catch (e) {
        if (grafico) {
          grafico.parentElement.innerHTML = '<div class="text-danger">Erro ao carregar gráfico de projetos por mês.</div>';
        }
      }
    } else {
      titulo.textContent = 'PROJETOS CONCLUÍDOS POR ANO';
      if (descricaoGrafico1) {
        descricaoGrafico1.textContent = 'Este gráfico apresenta a quantidade total de projetos finalizados a cada ano. Ele permite visualizar a evolução da atuação ao longo do tempo, identificar tendências de crescimento ou queda na demanda, e avaliar o desempenho geral do freelancer ou da empresa em períodos distintos.';
        descricaoGrafico1.style.display = 'block';
        descricaoGrafico1.style.marginTop = '0.5rem';
        descricaoGrafico1.style.marginBottom = '1rem';
      }
      // Buscar dados do endpoint e montar gráfico para freelancer
      try {
        const token = localStorage.getItem('token');
        const resp = await fetch('/dashboard/freelancer/colunas', {
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
          }
        });
        let data = [];
        if (resp.status === 404) {
          data = [];
        } else if (!resp.ok) {
          throw new Error('Erro ao buscar dados do gráfico');
        } else {
          data = await resp.json();
        }
        // Processar datas para contar por mês do ano atual
        const mesesAbrev = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const now = new Date();
        const anoAtual = now.getFullYear();
        const mesesChave = [];
        for (let i = 0; i < 12; i++) {
          mesesChave.push((i + 1).toString().padStart(2, '0'));
        }
        // Conta quantas datas em cada mês do ANO ATUAL
        const contagem = {};
        data.forEach(item => {
          if (item.prazoEntrega) {
            // Formato esperado: YYYY-MM-DD
            const partes = item.prazoEntrega.split('-');
            if (partes.length === 3) {
              const ano = parseInt(partes[0], 10);
              const mes = parseInt(partes[1], 10) - 1; // 0-11
              if (ano === anoAtual && mes >= 0 && mes < 12) {
                contagem[mes] = (contagem[mes] || 0) + 1;
              }
            }
          }
        });
        // Monta array de contagem por mês (jan=0, ..., dez=11)
        let counts = [];
        if (resp.status === 404) {
          for (let i = 0; i < 12; i++) {
            counts.push(0);
          }
        } else {
          for (let i = 0; i < 12; i++) {
            counts.push(contagem[i] || 0);
          }
        }
        // Calcula o valor máximo do eixo Y: maior valor real, mas o eixo vai até o próximo múltiplo de 5 acima do maior valor
        const maxY = Math.max(...counts);
        // Regra dinâmica para stepY igual receita/investimento mensal
        let stepY = 5;
        if (maxY > 1000000000) {
          stepY = 1000000000;
        } else if (maxY > 1000000) {
          stepY = 1000000;
        } else if (maxY > 100000) {
          stepY = 100000;
        } else if (maxY > 10000) {
          stepY = 10000;
        } else if (maxY > 1000) {
          stepY = 1000;
        } else if (maxY > 100) {
          stepY = 100;
        } else if (maxY > 10) {
          stepY = 10;
        }
        let yMax = stepY;
        if (maxY > 0) {
          yMax = Math.ceil(maxY / stepY) * stepY;
        }
        // Remove o atributo data-bss-chart para evitar conflito com scripts de template
        if (grafico.hasAttribute('data-bss-chart')) {
          grafico.removeAttribute('data-bss-chart');
        }
        // Atualiza o gráfico
        if (grafico && window.Chart) {
          // Remove gráfico anterior se existir
          if (grafico.chartInstance) {
            grafico.chartInstance.destroy();
          }
          grafico.chartInstance = new Chart(grafico.getContext('2d'), {
            type: 'bar',
            data: {
              labels: mesesAbrev,
              datasets: [{
                label: 'Projetos',
                backgroundColor: '#4e73df',
                borderColor: '#4e73df',
                data: counts
              }]
            },
            options: {
              maintainAspectRatio: true,
              legend: { display: true, labels: { fontStyle: 'normal', fontColor: '#fff' } },
              title: { fontStyle: 'bold', fontColor: '#fff' },
              tooltips: { enabled: true },
              hover: { mode: 'index', intersect: false },
              scales: {
                xAxes: [{ ticks: { fontStyle: 'normal', fontColor: '#fff' } }],
                yAxes: [{
                  ticks: {
                    fontStyle: 'normal',
                    fontColor: '#fff',
                    stepSize: stepY,
                    min: 0,
                    max: yMax,
                    callback: function(value) { return value; }
                  }
                }]
              }
            }
          });
        }
      } catch (e) {
        if (grafico) {
          grafico.parentElement.innerHTML = '<div class="text-danger">Erro ao carregar gráfico de projetos concluídos por ano.</div>';
        }
      }
    }
  }
  // Remove bloco duplicado de atualização da descrição do gráfico 1
});
