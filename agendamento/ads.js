
const botao_painel = document.querySelector('#painel_controle_botao');
const botao_gerenciador = document.querySelector('#gerenciador_botao');
const botao_tablets = document.querySelector('#tablets_botao');
const botao_procurar_redefinir = document.querySelector('#procurar_excluir')
const botao_redefinir = document.querySelector('#botao_excluir')

const tela_painel = document.querySelector('#tela_painel');
const tela_gerenciamento = document.querySelector('#tela_gerenciamento');
const tela_tablets = document.querySelector('#tela_tablets')

const tabela_painel = document.querySelector('#dados_reservas')
const tabela_gerenciamento = document.querySelector('#dados_professores')
const tabela_tablets = document.querySelector('#dados_tablets')

if (botao_painel && tela_painel && tela_gerenciamento && tela_tablets) {
    botao_painel.addEventListener('click', () => {
        tela_tablets.style.display = 'none';
        tela_gerenciamento.style.display = 'none';
        tela_painel.style.display = 'block';    
    });
}

if (botao_gerenciador && tela_painel && tela_gerenciamento && tela_tablets) {
    botao_gerenciador.addEventListener('click', () => {
        tela_tablets.style.display = 'none'
        tela_painel.style.display = 'none';         
        tela_gerenciamento.style.display = 'block';
    });
}
if (botao_tablets && tela_painel && tela_gerenciamento && tela_tablets){
    botao_tablets.addEventListener('click', () => {
        tela_tablets.style.display = 'block'
        tela_painel.style.display = 'none'
        tela_gerenciamento.style.display = 'none'
    })
}

window.addEventListener('DOMContentLoaded', async () => {

    if (tabela_painel) {
        try {
            const resposta = await fetch('http://localhost:8000/lista_agendamentos');
            const agendamentos = await resposta.json();

            tabela_painel.innerHTML = "";

            agendamentos.forEach(reserva => {
                const linha = document.createElement('tr');

                linha.innerHTML = `
                    <td>${reserva.nome}</td>
                    <td>${reserva.calendario}</td>
                    <td>${reserva.checkin} </td>
                    <td>${reserva.checkout}</td>
                `;
                tabela_painel.appendChild(linha);
            });

        } catch (erro) {
            console.error("Erro ao carregar os dados simulados:", erro);
            alert("Não foi possível carregar o painel administrativo.");
        }
    }
});

window.addEventListener('DOMContentLoaded', async () => {
    if (tabela_gerenciamento) {
        try {
            const resposta = await fetch('http://localhost:8000/lista_gerenciamento');
            const professores = await resposta.json();

            tabela_gerenciamento.innerHTML = '';

            professores.forEach(professores => {
                const linha = document.createElement('tr');
                linha.innerHTML = `
                    <td>${professores.nome_completo}</td>
                    <td>${professores.usuario}</td>
                    <td>${professores.senha}</td>
                `;
                tabela_gerenciamento.appendChild(linha);
            });
        } catch (erro) {
            console.error("Erro na requisição:", erro);
        }
    }
});

window.addEventListener('DOMContentLoaded', async () => {
    if (tabela_tablets) {
        try {
            const resposta = await fetch('http://localhost:8000/lista_tablets');
            const tablets = await resposta.json();

            tabela_tablets.innerHTML = '';

            tablets.forEach(tablet => {
                const linha = document.createElement('tr');
                linha.innerHTML = `
                    <td >${tablet.usuario}</td>
                    <td >${tablet.tablets_selecionados}</td>
                    <td >${tablet.qntd_tablets}</td>
                `;
                tabela_tablets.appendChild(linha);
            });
            
        } catch (erro) {
            console.error("Erro na requisição:", erro);
        }
    }
});

if (botao_redefinir && botao_procurar_redefinir){
    botao_redefinir.addEventListener('click', async () => {
        const deletar_usuario = botao_procurar_redefinir.value.trim()

        if(deletar_usuario === ''){
             alert("Por favor, digite o nome de usuário que deseja excluir.");
            return;
        }
        const confirmar = confirm(`Tem certeza que deseja excluir permanentemente o usuário "${deletar_usuario}"?`);
        if (!confirmar) {
            return;
        }
        try{
            const resposta = await fetch(`http://localhost:8000/excluir_usuario/${deletar_usuario}`, {
                method: 'DELETE'
            })
            const resultado = await resposta.json()
            if (resposta.ok){
                alert('a exclusão deu certo')
                botao_procurar_redefinir.value = ''
                window.location.reload();
            } else{
                alert(`Erro: ${resultado.detail || "Não foi possível excluir o usuário."}`);
            }
        } catch(erro){
             console.error("Erro na comunicação com o servidor:", erro);
            alert("Erro de rede: O servidor FastAPI está offline ou inacessível.")
        }
    })
}
