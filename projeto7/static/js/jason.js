    // Mobile menu toggle
    document.getElementById('mobile-menu-button').addEventListener('click', function() {
        const menu = document.getElementById('mobile-menu');
        menu.classList.toggle('hidden');
    });
    
    // Back to top button
    const backToTopButton = document.getElementById('back-to-top');
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.remove('opacity-0', 'invisible');
            backToTopButton.classList.add('opacity-100', 'visible');
        } else {
            backToTopButton.classList.remove('opacity-100', 'visible');
            backToTopButton.classList.add('opacity-0', 'invisible');
        }
    });
    
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Create blood drips effect
    function createBloodDrips() {
        const container = document.getElementById('blood-drips');
        const dripCount = 15;
        
        for (let i = 0; i < dripCount; i++) {
            const drip = document.createElement('div');
            drip.classList.add('blood-drip');
            
            // Random position
            const left = Math.random() * 100;
            const delay = Math.random() * 15;
            const duration = 3 + Math.random() * 7;
            
            drip.style.left = `${left}%`;
            drip.style.animationDelay = `${delay}s`;
            drip.style.animationDuration = `${duration}s`;
            
            container.appendChild(drip);
        }
    }
    
    // Initialize blood drips
    createBloodDrips();
    
    // --- Chat Logic ---
    document.addEventListener('DOMContentLoaded', () => {
        const chatMessages = document.getElementById('chat-messages');
        const userInput = document.getElementById('user-input');
        const sendButton = document.getElementById('send-button');
        const loadingIndicator = document.getElementById('loading-indicator');

        function addMessage(sender, message) {
            const messageElement = document.createElement('div');
            messageElement.classList.add('flex', 'mb-4', 'items-start'); // Adicionado 'items-start' para alinhamento superior

            const iconDiv = document.createElement('div');
            iconDiv.classList.add('w-10', 'h-10', 'bg-gray-700', 'rounded-full', 'flex', 'items-center', 'justify-center');
            
            const messageBubble = document.createElement('div');
            messageBubble.classList.add('p-3', 'rounded-lg', 'max-w-xs', 'md:max-w-md'); // Usando classes do site de apresentação

            if (sender === 'user') {
                messageElement.classList.add('justify-end');
                iconDiv.classList.add('ml-3');
                messageBubble.classList.add('bg-red-600', 'text-white');
                iconDiv.innerHTML = `<i class="fas fa-user text-gray-400"></i>`;
                messageElement.appendChild(messageBubble);
                messageElement.appendChild(iconDiv);
            } else { // NeuroAI/JasonAI
                iconDiv.classList.add('mr-3');
                messageBubble.classList.add('bg-gray-700', 'text-white');
                iconDiv.innerHTML = `<i class="fas fa-mask text-red-500"></i>`;
                messageElement.appendChild(iconDiv);
                messageElement.appendChild(messageBubble);
            }
            
            messageBubble.innerHTML = `<p>${message}</p>`; // Conteúdo da mensagem

            chatMessages.appendChild(messageElement);
            chatMessages.scrollTop = chatMessages.scrollHeight; // Rolar para a última mensagem
        }

        // Adiciona a mensagem inicial do JasonAI
        addMessage('JasonAI', "E aí. Sou o JasonIa. O que cê quer saber de filme de terror ou comédia? Desembucha logo.");


        sendButton.addEventListener('click', sendMessage);
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        async function sendMessage() {
            const message = userInput.value.trim();
            if (message === '') return;

            addMessage('user', message);
            userInput.value = ''; // Limpa o input
            loadingIndicator.classList.remove('hidden'); // Mostra indicador de carregamento
            sendButton.disabled = true; // Desabilita o botão
            userInput.disabled = true; // Desabilita o input

            try {
                const response = await fetch('/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message: message }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `Erro de rede: ${response.status}`);
                }

                const data = await response.json();
                addMessage('JasonAI', data.reply);
            } catch (error) {
                console.error("Erro ao enviar mensagem:", error);
                addMessage('JasonAI', "Desculpe, houve um erro ao processar sua solicitação.");
            } finally {
                loadingIndicator.classList.add('hidden'); // Esconde indicador de carregamento
                sendButton.disabled = false; // Habilita o botão
                userInput.disabled = false; // Habilita o input
                userInput.focus(); // Foca no input novamente
            }
        }
    });
    