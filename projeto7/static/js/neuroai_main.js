document.addEventListener('DOMContentLoaded', function() {
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatMessagesArea = document.getElementById('chat-messages-area'); // Changed ID here
    const welcomeMessage = document.getElementById('welcome-message');
    const chatContainerMain = document.querySelector('.chat-container-main'); // Get the main chat container

    // Function for quick prompt buttons
    document.querySelectorAll('.quick-prompt').forEach(button => {
        button.addEventListener('click', function() {
            const promptText = this.textContent.match(/"(.*?)"/)[1];
            userInput.value = promptText;
            chatForm.dispatchEvent(new Event('submit', { 'bubbles': true }));
        });
    });
    
    // Event listener for form submission
    chatForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const message = userInput.value.trim();
        
        if (message) {
            // Show the main chat container and hide the welcome message
            if (chatContainerMain.classList.contains('hidden')) {
                chatContainerMain.classList.remove('hidden');
                welcomeMessage.classList.add('hidden');
            }
            
            // Add user message to the display
            addMessage(message, 'user');
            userInput.value = '';
            
            // Add typing indicator
            addTypingIndicator();
            scrollToBottom();
            
            try {
                const response = await fetch('/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: message })
                });

                if (!response.ok) {
                    throw new Error(`Network error: ${response.status}`);
                }

                const data = await response.json();
                removeTypingIndicator(); // Remove typing indicator
                addMessage(data.reply, 'bot'); // Add bot's actual response

            } catch (error) {
                console.error("Error connecting to server:", error);
                removeTypingIndicator();
                addMessage("Desculpe, não consegui me conectar ao servidor. Verifique o console para mais detalhes.", 'bot');
            }
        }
    });
    
    // Function to add message to the chat
    function addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-bubble', 'relative', 'flex', 'w-full', 'message-transition');
        
        // Sanitize content to prevent HTML injection
        const sanitizedContent = content.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        if (sender === 'user') {
            messageDiv.classList.add('user-bubble', 'ml-auto');
            messageDiv.innerHTML = `
                <div class="blob bg-indigo-500 text-white p-4 rounded-2xl max-w-xs" style="border-radius: 20px 20px 5px 20px;">
                    <p>${sanitizedContent}</p>
                    <div class="bubble-tip-right absolute w-4 h-4" style="color: #6366f1;"></div>
                </div>`;
        } else {
            messageDiv.classList.add('mr-auto'); // For bot messages
            messageDiv.innerHTML = `
                <div class="blob bg-gray-100 text-gray-800 p-4 rounded-2xl max-w-xs" style="border-radius: 20px 20px 20px 5px;">
                    <p>${sanitizedContent}</p>
                    <div class="bubble-tip-left absolute w-4 h-4" style="color: #f3f4f6;"></div>
                </div>`;
        }
        chatMessagesArea.appendChild(messageDiv);
        scrollToBottom();
    }
    
    // Function to add typing indicator
    function addTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.classList.add('flex', 'w-full', 'typing-indicator', 'relative'); // Added relative for tip positioning
        typingDiv.innerHTML = `
            <div class="blob bg-gray-100 p-3 rounded-full w-24 flex space-x-1 items-center justify-center">
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s;"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s;"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.3s;"></div>
                <div class="bubble-tip-left absolute w-4 h-4" style="color: #f3f4f6; bottom: -2px; left: 8px;"></div> </div>`;
        chatMessagesArea.appendChild(typingDiv);
    }
    
    // Function to remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // Function to scroll to the bottom of the chat
    function scrollToBottom() {
        chatMessagesArea.scrollTop = chatMessagesArea.scrollHeight;
    }
    
    userInput.focus();
});
