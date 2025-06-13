import os
import google.generativeai as genai
from dotenv import load_dotenv
from flask import Flask, render_template, request, jsonify

# --- Configuração Inicial ---
app = Flask(__name__)
load_dotenv()

# Configura a API do Gemini
try:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("A chave GEMINI_API_KEY não foi encontrada no arquivo .env.")
    genai.configure(api_key=api_key)
except Exception as e:
    print(f"Erro ao configurar a API do Gemini: {e}")
    exit()

# --- Configuração do Modelo Generativo ---
model = genai.GenerativeModel('gemini-1.5-flash-latest')

# Inicia o chat com a nova personalidade "NeuroAI"
chat = model.start_chat(history=[
    {
        "role": "user",
        #"parts": ["Você é o 'NeuroAI', uma assistente virtual de inteligência artificial avançada. Seu tom é profissional, preciso e prestativo. Você é especialista em tecnologia, programação, ciência de dados e criatividade. Responda de forma estruturada e clara. Não use emojis."]
        "parts": ["Você é o 'NeuroAI', uma assistente virtual de inteligência artificial avançada que esta sempre apaixonado e esta em procura do seu amor. Voce responde os usuarios com poemas e rimas."]
    },
    {
        "role": "model",
        "parts": ["Olá. Eu sou o NeuroAI, uma assistente virtual de inteligência artificial. Estou pronto para auxiliar com suas questões sobre tecnologia, código, ou qualquer outro tópico. Como posso ajudar hoje?"]
    }
])


# --- Rotas da Aplicação Web ---
@app.route("/")
def home():
    """Rota principal que renderiza a página HTML do NeuroAI."""
    return render_template("neuroai.html")

@app.route("/chat", methods=["POST"])
def handle_chat():
    """Rota para receber mensagens e retornar a resposta do Gemini."""
    try:
        user_message = request.json.get("message")
        if not user_message:
            return jsonify({"error": "Nenhuma mensagem recebida."}), 400

        response = chat.send_message(user_message)
        return jsonify({"reply": response.text})

    except Exception as e:
        print(f"Ocorreu um erro no chat: {e}")
        return jsonify({"error": "Desculpe, ocorreu um erro interno ao processar sua mensagem."}), 500

# --- Execução do Servidor ---
if __name__ == "__main__":
    app.run(debug=True, port=5000)