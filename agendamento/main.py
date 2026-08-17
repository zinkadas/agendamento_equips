from datetime import date, time
import json
import os
from typing import Optional

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI()

# Configuração de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ARQUIVO_BANCO = "dados.json"


# --- FUNÇÕES AUXILIARES DO BANCO JSON ---
def carregar_dados() -> dict:
  """Lê o arquivo dados.json e devolve o dicionário completo."""
  if not os.path.exists(ARQUIVO_BANCO):
    return {"agendamentos": [], "professores": [], "tablets": []}
  try:
    with open(ARQUIVO_BANCO, "r", encoding="utf-8") as f:
      return json.load(f)
  except (json.JSONDecodeError, Exception):
    return {"agendamentos": [], "professores": [], "tablets": []}


def salvar_dados(dados: dict):
  """Grava o dicionário atualizado dentro do arquivo dados.json."""
  with open(ARQUIVO_BANCO, "w", encoding="utf-8") as f:
    json.dump(dados, f, ensure_ascii=False, indent=4)


# --- MODELOS PYDANTIC ---
class Criar_usuario(BaseModel):
  nome_completo: str
  usuario: str = Field(..., min_length=3)
  senha: str = Field(..., min_length=6)


class LoginUsuario(BaseModel):
  usuario: str
  senha: str


class LoginAdm(BaseModel):
  usuario: str
  senha: str


class Agendamento(BaseModel):
  calendario: Optional[date] = None
  checkin: Optional[time] = None
  checkout: Optional[time] = None
  tablets_selecionados: list[int] = []
  qntd_tablets: int = 0
  nome: Optional[str] = None


# --- ROTAS DA APLICAÇÃO ---


# 1. Login de Administrador
@app.post("/login_adm")
def verificacao(dados_login: LoginAdm):
  dados = carregar_dados()

  for adm in dados.get("administradores", []):
    if (adm.get("usuario") == dados_login.usuario
        and adm.get("senha") == dados_login.senha
    ):
      return {
          "status": "sucesso",
          "mensagem": "Login de administrador realizado com sucesso!",
      }

  raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="Usuário ou senha de administrador incorretos.",
  )


# 2. Criar novo usuário (Professor)
@app.post("/criar_usuario")
def criacao(criacao_usuario: Criar_usuario):
  dados = carregar_dados()

  # Verifica se o usuário já existe
  for prof in dados.get("professores", []):
    if prof.get("usuario") == criacao_usuario.usuario:
      raise HTTPException(
          status_code=status.HTTP_400_BAD_REQUEST,
          detail=f"O usuário '{criacao_usuario.usuario}' já está cadastrado.",
      )

  novo_prof = criacao_usuario.model_dump()
  dados["professores"].append(novo_prof)
  salvar_dados(dados)

  return {"status": "sucesso", "mensagem": "Usuário criado com sucesso!"}


# 3. Login de usuário comum (Professor)
@app.post("/login_usuario")
def certificacao(entrada: LoginUsuario):
  dados = carregar_dados()

  for prof in dados.get("professores", []):
    if (
        prof.get("usuario") == entrada.usuario
        and prof.get("senha") == entrada.senha
    ):
      return {
          "status": "sucesso",
          "mensagem": "Login realizado com sucesso!",
          "usuario": prof,
      }

  raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="Usuário ou senha incorretos.",
  )


# 4. Criar Agendamento
@app.post("/agendamento")
def agendador(informacoes: Agendamento):
  dados = carregar_dados()

  # model_dump(mode='json') converte datas e horários em texto compatível com JSON
  novo_agendamento = informacoes.model_dump(mode="json")

  dados["agendamentos"].append(novo_agendamento)
  salvar_dados(dados)

  return {
      "status": "sucesso",
      "mensagem": "Agendamento realizado com sucesso!",
      "dados": novo_agendamento,
  }


# 5. Listar Agendamentos
@app.get("/lista_agendamentos")
def painel_controle():
  dados = carregar_dados()
  return dados.get("agendamentos", [])


# 6. Listar Professores/Gerenciamento
@app.get("/lista_gerenciamento")
def painel_gerenciamento():
  dados = carregar_dados()
  return dados.get("professores", [])


# 7. Listar Tablets
@app.get("/lista_tablets")
def painel_tablets():
  dados = carregar_dados()
  return dados.get("tablets", [])


# 8. Excluir Usuário
@app.delete("/excluir_usuario/{deletar_usuario}")
def excluir_usuario(deletar_usuario: str):
  dados = carregar_dados()
  professores = dados.get("professores", [])

  usuario_encontrado = None
  for prof in professores:
    if prof.get("usuario") == deletar_usuario:
      usuario_encontrado = prof
      break

  if usuario_encontrado is None:
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=(
            f"O usuário '{deletar_usuario}' não foi encontrado na lista de"
            " gerenciamento."
        ),
    )

  professores.remove(usuario_encontrado)
  dados["professores"] = professores
  salvar_dados(dados)

  return {"mensagem": f"Usuário '{deletar_usuario}' foi excluído com sucesso!"}