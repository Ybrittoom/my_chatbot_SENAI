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
    # Decidi não sair para permitir que o app inicie mesmo sem a chave,
    # mas as funcionalidades do chat não funcionarão.
    # Em produção, você pode querer sair ou exibir um erro mais robusto.
    pass 

# --- Configuração do Modelo Generativo ---
model = genai.GenerativeModel('gemini-1.5-flash-latest')

# Inicia o chat com a nova personalidade "NeuroAI"
# Atenção: Manter o histórico aqui, pois o modelo "esquece" conversas passadas se não for alimentado.
# Se você quer que a IA mantenha a personalidade ao longo da sessão, o 'chat' deve ser persistente.
# Para múltiplas sessões de usuários, o chat deve ser inicializado por sessão (ex: em um banco de dados ou sessão Flask)
chat = model.start_chat(history=[
    {
        "role": "user",
        "parts": ["Você é o 'NeuroAI', uma assistente virtual crente, que esta tentando converter os usuarios."]
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

        # Envia a mensagem do usuário para o chat do Gemini
        response = chat.send_message(user_message)
        return jsonify({"reply": response.text})

    except Exception as e:
        print(f"Ocorreu um erro no chat: {e}")
        return jsonify({"error": "Desculpe, ocorreu um erro interno ao processar sua mensagem."}), 500

# --- Execução do Servidor ---
if __name__ == "__main__":
    app.run(debug=True, port=5000)
