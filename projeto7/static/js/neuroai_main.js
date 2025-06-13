document.addEventListener('DOMContentLoaded', function() {
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatContainer = document.getElementById('chat-container');
    const welcomeMessage = document.getElementById('welcome-message');

    // Função para os botões de prompt rápido
    document.querySelectorAll('.quick-prompt').forEach(button => {
        button.addEventListener('click', function() {
            const promptText = this.textContent.match(/"(.*?)"/)[1];
            userInput.value = promptText;
            chatForm.dispatchEvent(new Event('submit', { 'bubbles': true }));
        });
    });
    
    // Evento de envio do formulário
    chatForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const message = userInput.value.trim();
        
        if (message) {
            // Esconde a mensagem de boas-vindas se for a primeira mensagem
            if (chatContainer.classList.contains('hidden')) {
                chatContainer.classList.remove('hidden');
                welcomeMessage.classList.add('hidden');
            }
            
            // Adiciona a mensagem do usuário na tela
            addMessage(message, 'user');
            userInput.value = '';
            
            // Adiciona o indicador de "digitando..."
            addTypingIndicator();
            scrollToBottom();
            
            // ############# LÓGICA MODIFICADA #############
            // Comunica com o backend real em vez de simular uma resposta
            try {
                const response = await fetch('/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: message })
                });

                if (!response.ok) {
                    throw new Error(`Erro de rede: ${response.status}`);
                }

                const data = await response.json();
                removeTypingIndicator(); // Remove o "digitando..."
                addMessage(data.reply, 'bot'); // Adiciona a resposta real do bot

            } catch (error) {
                console.error("Erro ao contatar o servidor:", error);
                removeTypingIndicator();
                addMessage("Desculpe, não consegui me conectar ao servidor. Verifique o console para mais detalhes.", 'bot');
            }
            // ############# FIM DA LÓGICA MODIFICADA #############
        }
    });
    
    // Função para adicionar mensagem ao chat
    function addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message-transition', 'flex', 'w-full');
        
        // Sanitize content to prevent HTML injection
        const sanitizedContent = content.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        if (sender === 'user') {
            messageDiv.innerHTML = `
                <div class="ml-auto max-w-xs md:max-w-md lg:max-w-lg bg-blue-600 text-white px-4 py-3 rounded-lg rounded-tr-none">
                    ${sanitizedContent}
                </div>
                <div class="flex-shrink-0 ml-2 mt-2">
                    <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                        <i class="fas fa-user text-sm"></i>
                    </div>
                </div>`;
        } else {
            messageDiv.innerHTML = `
                <div class="flex-shrink-0 mr-2 mt-2">
                    <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <i class="fas fa-robot text-sm"></i>
                    </div>
                </div>
                <div class="max-w-xs md:max-w-md lg:max-w-lg bg-gray-800 px-4 py-3 rounded-lg rounded-tl-none">
                    ${sanitizedContent}
                </div>`;
        }
        chatContainer.appendChild(messageDiv);
        scrollToBottom();
    }
    
    // Função para adicionar o indicador de "digitando"
    function addTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.classList.add('flex', 'w-full', 'typing-indicator');
        typingDiv.innerHTML = `
            <div class="flex-shrink-0 mr-2 mt-2">
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <i class="fas fa-robot text-sm"></i>
                </div>
            </div>
            <div class="max-w-xs md:max-w-md lg:max-w-lg bg-gray-800 px-4 py-3 rounded-lg rounded-tl-none">
                <div class="typing">Digitando</div>
            </div>`;
        chatContainer.appendChild(typingDiv);
    }
    
    // Função para remover o indicador de "digitando"
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // Função para rolar para o final do chat
    function scrollToBottom() {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    
    userInput.focus();
});