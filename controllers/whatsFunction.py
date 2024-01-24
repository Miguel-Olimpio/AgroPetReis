import sys
import webbrowser
from time import sleep
import pyautogui
import os

def openWhatsapp(link):
    try:   
        webbrowser.open(link)
    except Exception as e:
        print(f"Erro ao enviar a mensagem: {e}")

try:
# Se o diretório atual é onde está o script Python
    diretorio_atual = os.path.dirname(os.path.abspath(__file__))
    # Caminho relativo para a imagem
    caminho_relativo = '../public/img/seta.png'
    # Obtém o caminho absoluto
    caminho_absoluto = os.path.abspath(os.path.join(diretorio_atual, caminho_relativo))
    linkConfirmationWhats = sys.argv[1]
    # linkConfirmationWhats = 'https://web.whatsapp.com/send?phone=5532984769673&text=Ola%20Miguel%20Olimpio%20podemos%20confirmar%20a%20consulta%20do%20seu%20pet%20Apolo%2C%20agendada%20para%20hoje%20as%2010%3A00%20%3F%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20caso%20a%20resposta%20seja%20afirmativa%2C%20n%C3%A3o%20%C3%A9%20necess%C3%A1rio%20resposta%2C%20caso%20seja%20negativa%2Cfavor%20entrar%20no%20link%20e%20desmarcar%20sua%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20consulta%2C%20caso%20n%C3%A3o%20seja%20possivel%20favor%20responder%20e%20justificar%20o%20motivo%20aqui%20no%20whatsApp%2C%20AgroPet%20Reis%20agradece'
    openWhatsapp(linkConfirmationWhats)
    sleep(20) 
    seta = pyautogui.locateCenterOnScreen(caminho_absoluto)
    sleep(10)
    pyautogui.click(seta[0],seta[1])
    sleep(10)
    pyautogui.hotkey('ctrl','w')
    sleep(5)
    print(f'-------------------------- Enviado com sucesso porra -------------------------')

except IndexError:
    print("Erro: O link não foi fornecido como argumento.")

