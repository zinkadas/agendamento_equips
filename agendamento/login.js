  const interface_login_adm = document.querySelector('#login_adm')
  const interface_login_usuario = document.querySelector('#login_usuario')
  const interface_criar_usuario = document.querySelector('#tela_criacao')

  const botao_adm = document.querySelector('#admin')
  const botao_user = document.querySelector('#user')

  const usuario = document.querySelector('#username_user')
  const senha = document.querySelector('#password_user')
  const voltar_user = document.querySelector('#voltar_user')
  const botao_submit_user = document.querySelector('#enviar_dados_user')  
  const criacao_acesso = document.querySelector('#criacao')

  const nome_completo = document.querySelector('#nome_completo')
  const criacao_usuario = document.querySelector('#user_criacao')
  const criacao_senha = document.querySelector('#senha_criacao') 
  const submit_usuario_criacao = document.querySelector('#criar_usuario')

  const adm_usuario = document.querySelector('#username')
  const adm_senha = document.querySelector('#password')
  const voltar = document.querySelector('#voltar')
  const botao_submit = document.querySelector("#enviar_dados")

  if (botao_user && interface_login_usuario) {
      botao_user.addEventListener("click", () => {
          interface_login_usuario.classList.add('selecionado')
      });
  }


  if(voltar_user && interface_login_usuario){
    voltar_user.addEventListener('click', () => {
        interface_login_usuario.classList.remove('selecionado');
    });
  }
      
if (criacao_acesso && interface_criar_usuario && interface_login_usuario) {
  criacao_acesso.addEventListener('click', () => {
      interface_login_usuario.classList.remove('selecionado');
      interface_criar_usuario.classList.add('clicado');
  });
}

  if (voltar_criacao && interface_criar_usuario && interface_login_usuario) {
    voltar_criacao.addEventListener('click', () => {
        interface_criar_usuario.classList.remove('clicado');
        interface_login_usuario.classList.add('selecionado');
    });
}

  if (botao_adm && interface_login_adm) {
      botao_adm.addEventListener('click', () => {
          interface_login_adm.classList.add('pressionado'); 
      });
  }

  if(voltar && interface_login_adm){
    voltar.addEventListener('click', () => {
        interface_login_adm.classList.remove('pressionado');
    });
  }

  if (botao_submit && interface_login_adm) { 
    botao_submit.addEventListener('click', async (e) => {
      e.preventDefault(); 

      if (adm_usuario.value === '' || adm_senha.value === '') {
        alert("digite o usuário ou a senha");
        return; 
      }
      else {
        try {

  const resposta = await fetch('http://localhost:8000/login_adm', {

              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ 
                usuario: adm_usuario.value.trim(), 
                senha: adm_senha.value.trim()
              })
          });

          const dados = await resposta.json();
          
          if (resposta.ok){
            window.location.href = "admin.html"; 
          }
          else {
            alert("usuário ou senha incorretos");
          }
        } catch (erro) {
          console.error("Erro na conexão:", erro);
          alert("Não foi possível conectar ao servidor FastAPI. Verifique se ele está ligado.");
        }
      }
    });
  }

  if (submit_usuario_criacao && interface_criar_usuario) {
    submit_usuario_criacao.addEventListener('click', async (e)=> {
       e.preventDefault();
       if (nome_completo.value.trim() === '' || criacao_usuario.value.trim() === '' || criacao_senha.value.trim() === ''){
      alert('Preencha todos os campos para realizar o cadastro.');
    }
      else {
        try {

  const resposta = await fetch('http://localhost:8000/criar_usuario', {

              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ 
                nome_completo: nome_completo.value.trim(),
                usuario: criacao_usuario.value.trim(),
                senha: criacao_senha.value.trim()
              })
          });

          const dados = await resposta.json();
          
          if (resposta.ok){
            alert('Usuário criado com sucesso!') 
            nome_completo.value = '';
            criacao_usuario.value = '';
            criacao_senha.value = '';
            interface_criar_usuario.classList.remove('clicado');
            interface_login_usuario.classList.add('selecionado');
          }
         else {
         alert(dados.detail || 'Erro ao criar usuário.'); 
          }
        } catch (erro) {
          console.error("Erro na conexão:", erro);
          alert("Não foi possível conectar ao servidor FastAPI. Verifique se ele está ligado.");
        }
      }
    });
  }

  if(botao_submit_user && interface_login_usuario){
  botao_submit_user.addEventListener('click', async(e) =>{
    e.preventDefault();
    if(usuario.value === "" || senha.value ===""){
      alert("preencha os campos corretamente")
    }
    else{
      try {

  const resposta = await fetch('http://localhost:8000/login_usuario', {

              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ 
                usuario: usuario.value.trim(),
                senha: senha.value.trim()
              })
          });

          const dados = await resposta.json();
          
          if (resposta.ok){
            window.location.href = 'agendamento.html'
          }
         else {
         alert(dados.detail || 'Erro ao criar usuário.'); 
          }
        } catch (erro) {
          console.error("Erro na conexão:", erro);
          alert("Não foi possível conectar ao servidor FastAPI. Verifique se ele está ligado.");
        }
      }
    });
  }