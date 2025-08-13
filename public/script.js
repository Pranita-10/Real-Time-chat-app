document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    const form = document.getElementById('form');
    const input = document.getElementById('input');
    const messages = document.getElementById('messages');
    const userCountDisplay = document.getElementById('user-count');
    const welcomeMessage = document.getElementById('welcome-message');
    const clearChatBtn = document.getElementById('clear-chat-btn'); // NEW: Get the clear button


    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // Handle form submission (sending messages)
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (input.value) {
            socket.emit('chat message', input.value);
            input.value = '';

            if (welcomeMessage) {
                welcomeMessage.style.display = 'none';
            }
        }
    });

    // Listen for 'chat message' events from the server
    socket.on('chat message', (msg) => {
        const item = document.createElement('li');
        const messageText = document.createElement('span');
        messageText.classList.add('message-text');
        messageText.textContent = msg;

        const timestamp = document.createElement('span');
        timestamp.classList.add('timestamp');
        timestamp.textContent = getCurrentTime();

        item.appendChild(messageText);
        item.appendChild(timestamp);
        messages.appendChild(item);

        messages.scrollTop = messages.scrollHeight;

        if (welcomeMessage) {
            welcomeMessage.style.display = 'none';
        }
    });

    // Listen for 'user count' events from the server
    socket.on('user count', (count) => {
        if (userCountDisplay) {
            userCountDisplay.textContent = `Users online: ${count}`;
        }
    });

    // NEW: Add event listener for the Clear Chat button
    clearChatBtn.addEventListener('click', () => {
        // Remove all child elements from the messages list
        messages.innerHTML = '';
        // Show the welcome message again after clearing the chat
        if (welcomeMessage) {
            welcomeMessage.style.display = 'block'; // Or 'flex', 'grid' depending on its original display
        }
    });


    socket.on('connect', () => {
        console.log('Connected to server!');
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from server!');
    });

    socket.on('connect_error', (error) => {
        console.error('Connection Error:', error);
    });
});