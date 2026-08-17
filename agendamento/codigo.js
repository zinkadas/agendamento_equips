//detalhes necessarios para fazer esse sisteminha
//1) uma forma de agendar a sala de informática com antecedencia e tambem uma forma de ver em quais horários a sala está ocupada
//2) solicitar e registrar o uso dos tablets e tambem ver quem está com os tablets

//uvicorn agendamento.main:app --reload ss
const hoje = new Date();
const ano = hoje.getFullYear();
const mes = String(hoje.getMonth() + 1).padStart(2, '0');
const dia = String(hoje.getDate()).padStart(2, '0');
const dataFormatada = `${ano}-${mes}-${dia}`

const calendario = document.querySelector('#calendario')
calendario.min = dataFormatada;
const checkin = document.querySelector('#checkin')
const checkout = document.querySelector('#checkout')

const botoes_tablet = document.querySelectorAll('.botoes_tablet')
const botao_salvar = document.querySelector('#salvar')

if (calendario) {
    calendario.min = dataFormatada;
}
let tablets_ocupados = []
let tablets_selecionados = []
let limite_sala = 0
let qntd_tablets = 0



botoes_tablet.forEach((incremento) => {
  incremento.addEventListener("click", () =>{
    if(incremento.disabled) return

    incremento.classList.toggle('selecionado');
    const numeroDoTabletAtual = parseInt(incremento.textContent);
     if (tablets_selecionados.includes(numeroDoTabletAtual)) {
        tablets_selecionados = tablets_selecionados.filter(id => id !== numeroDoTabletAtual);
    } else {
        tablets_selecionados.push(numeroDoTabletAtual);
    }

    qntd_tablets = tablets_selecionados.length;
    
  })
});

botao_salvar.addEventListener('click', async (e) => {
    e.preventDefault();
    
    if (!calendario.value && qntd_tablets === 0) {
        alert('Escolha uma data para a sala ou selecione ao menos um tablet.');
        return;
    }

    if (calendario.value && (!checkin.value || !checkout.value)) {
        alert('Para agendar a sala, você precisa preencher o horário de check-in e check-out.');
        return; 
    }
    if (checkin.value && checkout.value && checkin.value >= checkout.value) {
        alert('O horário de saída deve ser maior que o horário de entrada.');
    return;

    }   
    else {
        try {
            const conexao = await fetch('http://localhost:8000/agendamento', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    calendario: calendario.value || null,               
                    checkin: checkin.value || null,    
                    checkout: checkout.value || null,
                    tablets_selecionados: tablets_selecionados,               
                    qntd_tablets: qntd_tablets         
                })
            });

            const informacoes = await conexao.json();

            if (conexao.ok) {
            checkin.value = ''; 
            checkout.value = '';
            calendario.value = '';
            qntd_tablets = 0; 
            tablets_selecionados = []; 
            document.querySelectorAll('.botoes_tablet').forEach(b => b.classList.remove('selecionado'));
            }
            else{
                 alert(informacoes.detail || "Erro retornado pelo servidor.");
            }
        } catch (erro) {
            console.error("Erro na conexão:", erro);
            alert("Não foi possível conectar ao servidor.");
        }
    }
})

calendario.addEventListener('change', async() => {
    const data_selecionada = calendario.value
    if(!data_selecionada) return
    try{
        const resposta = await fetch(`http://localhost:8000/agendamentos_por_data/${data_selecionada}`,{
            method: 'GET'
        }) 
        const agendamentos_dia = await resposta.json();

        botoes_tablet.forEach(botao => {
            botao.disable = false
            botao.classList.remove('selecionado')
        });
        agendamentos_dia.forEach(reserva => {
            if(reserva.tablets_selecionados){
                tablets_ocupados = tablets_ocupados.concat(reserva.tablets_selecionados)
            }
        })
        botoes_tablet.forEach(botao => {
        const numero_tablet = parseInt(botao.textContent)
            if(tablets_ocupados.includes(numero_tablet)){
                botao.disable = true
            }
        })
    }catch (erro) {
        console.error("Erro ao buscar agendamentos:", erro);
    }
})