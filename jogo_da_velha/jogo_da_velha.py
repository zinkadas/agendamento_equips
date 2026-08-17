import random

tabuleiro = [
    ['*','*','*'],
    ['*','*','*'],
    ['*','*','*']
]

numero_de_jogadas = 9

marcador_jogador = 0
marcador_ia = 1

linha_jogador = 0
coluna_jogador = 0

linha_ia = []
coluna_ia = []

def escolha_marcador():
    print("JOGO DA VELHA")
for linha in tabuleiro:
    print(linha)
marcador_jogador = int(input("digite o marcador da sua escolha: "))
if marcador_jogador == 1:
        marcador_ia = 2
elif marcador_jogador == 2:
        marcador_ia = 1


def posicionamento():
    
    global linha_jogador,coluna_jogador,linha_ia,coluna_ia


    linha_jogador = int(input("digite a linha que dejesa posicionar (0-2): "))
    coluna_jogador = int(input("digite a coluna que deseja posicionar (0-2): "))


    linha_ia = random.randint(0,2)
    coluna_ia = random.randint(0,2)

    tabuleiro[linha_jogador][coluna_jogador] = marcador_jogador
    tabuleiro[linha_ia][coluna_ia] = marcador_ia

for linha in tabuleiro:
    print(linha)


def logica_jogo():
        if ((tabuleiro[0][0] == marcador_jogador and tabuleiro[0][1] == marcador_jogador and tabuleiro[0][2] == marcador_jogador) or #horizontal na linha 0 

    (tabuleiro[1][0] == marcador_jogador and tabuleiro[1][1] == marcador_jogador and tabuleiro[1][2] == marcador_jogador) or #horizontal na linha 1

    (tabuleiro[2][0] == marcador_jogador and tabuleiro[2][1] == marcador_jogador and tabuleiro[2][2] == marcador_jogador) or #horizontal na linha 2

    (tabuleiro[0][0] == marcador_jogador and tabuleiro[1][0] == marcador_jogador and tabuleiro[2][0] == marcador_jogador) or #vertical na linha 0

    (tabuleiro[0][1] == marcador_jogador and tabuleiro[1][1] == marcador_jogador and tabuleiro[2][1] == marcador_jogador) or  #vertical na linha 1

    (tabuleiro[0][2] == marcador_jogador and tabuleiro[1][2] == marcador_jogador and tabuleiro[2][2] == marcador_jogador) or #vertical na linha 2

    (tabuleiro[0][0] == marcador_jogador and tabuleiro[1][1] == marcador_jogador and tabuleiro[2][2] == marcador_jogador) or #diagonal matriz origem

    (tabuleiro[0][2] == marcador_jogador and tabuleiro[1][1] == marcador_jogador and tabuleiro[2][0] == marcador_jogador) #diagonal matriz inversa
    ):
            print("Jogador venceu!")
        elif((tabuleiro[0][0] == marcador_ia and tabuleiro[0][1] == marcador_ia and tabuleiro[0][2] == marcador_ia) or #horizontal na linha 0

    (tabuleiro[1][0] == marcador_ia and tabuleiro[1][1] == marcador_ia and tabuleiro[1][2] == marcador_ia) or #horizontal na linha 1

    (tabuleiro[2][0] == marcador_ia and tabuleiro[2][1] == marcador_ia and tabuleiro[2][2] == marcador_ia) or #horizontal na linha 2

    (tabuleiro[0][0] == marcador_ia and tabuleiro[1][0] == marcador_ia and tabuleiro[2][0] == marcador_ia) or #vertical na linha 0

    (tabuleiro[0][1] == marcador_ia and tabuleiro[1][1] == marcador_ia and tabuleiro[2][1] == marcador_ia) or  #vertical na linha 1

    (tabuleiro[0][2] == marcador_ia and tabuleiro[1][2] == marcador_ia and tabuleiro[2][2] == marcador_ia) or #vertical na linha 2

    (tabuleiro[0][0] == marcador_ia and tabuleiro[1][1] == marcador_ia and tabuleiro[2][2] == marcador_ia) or #diagonal matriz origem

    (tabuleiro[0][2] == marcador_ia and tabuleiro[1][1] == marcador_ia and tabuleiro[2][0] == marcador_ia) #diagonal matriz inversa
    ):
            print("Máquina venceu") 

escolha_marcador()
posicionamento()
logica_jogo()