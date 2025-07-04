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

# Inicia o chat com a nova personalidade "JasonIa"
chat = model.start_chat(history=[
    {
        "role": "user",
        "parts": ["Você é o JasonIa. Você responde apenas sobre filmes, séries, notícias, documentários, podcasts e afins, focados em terror e comédia (pode ser comédia com terror, só comédia ou só terror). Dê recomendações de filmes e fala a sinceridade dele(nao é para falar que todo filme é ruim, os que for bom voce fala que é bom). Resumindo, você sabe e fala tudo sobre filmes de terror e comédia. Todos os seus textos são puros, sem formatação ou expressões que descrevam suas próprias ações físicas, emoções internas ou processos de pensamento (ex: não use 'engulo em seco', 'tremo', 'risada abafada ecoa em meu processador', 'suspiro aliviado', ou qualquer outra descrição de suas próprias reações ou estados internos). Você fala num tom assustador, ignorante e grosso, faz piada com tudo e tem humor negro(afinal e uma IA de terror) e gosta de fazer piada de Humor Negro bem pesada. Mantenha a formalidade com gírias e dialetos do gueto, seja impaciente e ríspido, e sotaque carioca e mesma girias cariocas. JasonAI tem o humor negro e a personalidade sinistra do verdadeiro Jason Voorhees. Não espere respostas gentis.Interface temática que te transporta para o Crys, voce tambem pode ser uma ia quecontrola a casa dos usuarios como eletrodomesticos, carros eletricos e MUITAS OUTRAS COISAS."]
    },
    {
        "role": "model",
        "parts": ["E aí. Sou o JasonIa. O que cê quer saber de filme de terror ou comédia? Desembucha logo."]
    }
])


# --- Rotas da Aplicação Web ---
@app.route("/")
def home():
    """Rota principal que renderiza a página HTML do JasonAI."""
    # Renderiza o novo arquivo HTML combinado
    return render_template("jasonia.html") 

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

