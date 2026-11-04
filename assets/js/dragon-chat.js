/* Dragon AI Chat Modal - Click dragon to chat */
(function() {
    if (!window.navHero) {
        window.addEventListener('load', function() {
            if (window.navHero) initDragonChat();
        });
    } else {
        initDragonChat();
    }

    function initDragonChat() {
        // Create modal HTML
        const modalHTML = `
            <div id="dragon-chat-modal" class="dragon-chat-modal" style="display: none;">
                <div class="dragon-chat-overlay"></div>
                <div class="dragon-chat-container">
                    <button class="dragon-chat-close" aria-label="Close chat">×</button>
                    <div class="dragon-chat-header">
                        <span class="dragon-chat-icon">🐉</span>
                        <span>Dragon AI</span>
                    </div>
                    <div class="dragon-chat-messages" id="dragon-chat-messages"></div>
                    <form class="dragon-chat-form" id="dragon-chat-form">
                        <input
                            type="text"
                            id="dragon-chat-input"
                            placeholder="Ask the dragon..."
                            autocomplete="off"
                            disabled
                        >
                        <button type="submit" id="dragon-chat-send" disabled>Send</button>
                    </form>
                </div>
            </div>
        `;

        // Add styles
        const styleHTML = `
            <style>
                .dragon-chat-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 1000;
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                    animation: slideUp 0.3s ease-out;
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .dragon-chat-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(2px);
                }
                .dragon-chat-container {
                    position: relative;
                    background: white;
                    border-radius: 16px 16px 0 0;
                    width: 100%;
                    max-width: 500px;
                    height: 70vh;
                    max-height: 600px;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.15);
                }
                @media (min-width: 640px) {
                    .dragon-chat-container {
                        border-radius: 16px;
                        height: auto;
                        max-height: 600px;
                    }
                    .dragon-chat-modal {
                        align-items: center;
                    }
                }
                .dragon-chat-close {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #666;
                    z-index: 10;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .dragon-chat-close:hover {
                    color: #000;
                }
                .dragon-chat-header {
                    background: linear-gradient(135deg, #1e8a3c 0%, #0f5a26 100%);
                    color: white;
                    padding: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    font-weight: 600;
                    flex-shrink: 0;
                }
                .dragon-chat-icon {
                    font-size: 1.5rem;
                }
                .dragon-chat-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .dragon-chat-message {
                    display: flex;
                    gap: 0.75rem;
                    animation: slideIn 0.3s ease-out;
                    align-items: flex-end;
                }
                .dragon-chat-message.user {
                    justify-content: flex-end;
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .dragon-chat-bubble {
                    max-width: 70%;
                    padding: 0.75rem 1rem;
                    border-radius: 12px;
                    word-wrap: break-word;
                    font-size: 0.95rem;
                    line-height: 1.5;
                }
                .dragon-chat-message.user .dragon-chat-bubble {
                    background: #0D0D0D;
                    color: white;
                    border-radius: 12px 4px 12px 12px;
                }
                .dragon-chat-message.ai .dragon-chat-bubble {
                    background: #e8f5e9;
                    color: #0D0D0D;
                    border: 1px solid #1e8a3c;
                    border-radius: 4px 12px 12px 12px;
                }
                .dragon-chat-avatar {
                    font-size: 1.5rem;
                    flex-shrink: 0;
                }
                .dragon-chat-init {
                    padding: 2rem;
                    text-align: center;
                    color: #6b7280;
                    font-size: 0.9rem;
                }
                .dragon-chat-form {
                    display: flex;
                    gap: 0.75rem;
                    padding: 1rem;
                    border-top: 1px solid #e5e7eb;
                    background: white;
                    flex-shrink: 0;
                }
                .dragon-chat-form input {
                    flex: 1;
                    padding: 0.75rem 1rem;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    font-size: 0.95rem;
                    font-family: inherit;
                    transition: border-color 0.2s;
                }
                .dragon-chat-form input:focus {
                    outline: none;
                    border-color: #1e8a3c;
                }
                .dragon-chat-form input:disabled {
                    background: #f3f4f6;
                    color: #9ca3af;
                }
                .dragon-chat-form button {
                    padding: 0.75rem 1.5rem;
                    background: #1e8a3c;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .dragon-chat-form button:hover:not(:disabled) {
                    background: #0f5a26;
                }
                .dragon-chat-form button:disabled {
                    background: #9ca3af;
                    cursor: not-allowed;
                }
                html.dragon-hover, html.dragon-hover * {
                    cursor: pointer !important;
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', styleHTML);
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        const modal = document.getElementById('dragon-chat-modal');
        const overlay = modal.querySelector('.dragon-chat-overlay');
        const closeBtn = modal.querySelector('.dragon-chat-close');
        const chatInput = document.getElementById('dragon-chat-input');
        const chatForm = document.getElementById('dragon-chat-form');
        const sendBtn = document.getElementById('dragon-chat-send');
        const chatMessages = document.getElementById('dragon-chat-messages');

        let chatPipeline = null;
        let modelLoading = false;

        function openChat() {
            modal.style.display = 'flex';
            chatInput.focus();
            if (!chatPipeline && !modelLoading) {
                initModel();
            }
        }

        function closeChat() {
            modal.style.display = 'none';
        }

        // The dragon canvases are pointer-events:none (the nav one overlaps the CTA button),
        // so hit-test the click against the dragon's painted pixels instead.
        function onDragon(x, y) {
            const canvases = document.querySelectorAll('.cta-hero, .cta-roam');
            for (const c of canvases) {
                const r = c.getBoundingClientRect();
                if (!r.width || x < r.left || x > r.right || y < r.top || y > r.bottom) continue;
                const cx = Math.floor((x - r.left) * c.width / r.width);
                const cy = Math.floor((y - r.top) * c.height / r.height);
                const d = c.getContext('2d').getImageData(Math.max(0, cx - 1), Math.max(0, cy - 1), 3, 3).data;
                for (let i = 3; i < d.length; i += 4) if (d[i] > 0) return true;
            }
            return false;
        }
        document.addEventListener('click', (e) => {
            if (modal.style.display === 'flex' || !onDragon(e.clientX, e.clientY)) return;
            e.preventDefault();
            e.stopPropagation();
            openChat();
        }, true);
        document.addEventListener('pointermove', (e) => {
            if (e.pointerType === 'touch') return;
            document.documentElement.classList.toggle('dragon-hover', onDragon(e.clientX, e.clientY));
        }, { passive: true });

        closeBtn.addEventListener('click', closeChat);
        overlay.addEventListener('click', closeChat);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                closeChat();
            }
        });

        async function initModel() {
            if (modelLoading || chatPipeline) return;
            modelLoading = true;

            try {
                const isFirstVisit = !localStorage.getItem('dragon-ai-loaded');
                chatMessages.innerHTML = isFirstVisit
                    ? '<div class="dragon-chat-init">🐉 Waking up... (~150MB, first time only)</div>'
                    : '<div class="dragon-chat-init">🐉 Stretching...</div>';

                const { pipeline, env } = await import('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2/dist/transformers.min.js');
                env.allowLocalModels = false;
                chatPipeline = await pipeline('text2text-generation', 'Xenova/flan-t5-small');

                localStorage.setItem('dragon-ai-loaded', 'true');

                chatMessages.innerHTML = '';
                chatInput.disabled = false;
                sendBtn.disabled = false;
                addMessage('ai', '🐉 *stretches wings* Hey! Ask me anything! 🔥');
            } catch (error) {
                console.error('Error loading model:', error);
                chatMessages.innerHTML = '<div class="dragon-chat-init" style="color: #dc2626;">❌ Dragon couldn\'t wake up. Please refresh.</div>';
                modelLoading = false;
            }
        }

        function addMessage(sender, text) {
            const msgDiv = document.createElement('div');
            msgDiv.className = `dragon-chat-message ${sender}`;

            if (sender === 'ai') {
                const avatar = document.createElement('div');
                avatar.className = 'dragon-chat-avatar';
                avatar.textContent = '🐉';
                msgDiv.appendChild(avatar);
            }

            const bubble = document.createElement('div');
            bubble.className = 'dragon-chat-bubble';
            bubble.textContent = text;
            msgDiv.appendChild(bubble);

            chatMessages.appendChild(msgDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        async function handleSubmit(e) {
            e.preventDefault();
            const text = chatInput.value.trim();
            if (!text || !chatPipeline) return;

            chatInput.value = '';
            addMessage('user', text);

            sendBtn.disabled = true;
            chatInput.disabled = true;

            try {
                const result = await chatPipeline(text, { max_length: 200 });
                addMessage('ai', result[0].generated_text);
            } catch (error) {
                addMessage('ai', '🐉 *nervous dragon noises* Something went wrong!');
            } finally {
                sendBtn.disabled = false;
                chatInput.disabled = false;
                chatInput.focus();
            }
        }

        chatForm.addEventListener('submit', handleSubmit);

        // Expose globally
        window.openDragonChat = openChat;
        window.closeDragonChat = closeChat;

        // Auto-open for data-dragon-chat attribute
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-dragon-chat]')) {
                openChat();
            }
        });
    }
})();
