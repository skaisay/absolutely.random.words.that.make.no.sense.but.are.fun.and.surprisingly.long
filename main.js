import { database, communicationStyles, emotionalTriggers, findBestMatch, findLinks, getRandomResponse } from './database.js';

// Безопасная инициализация Telegram WebApp
let tg = null;
try {
    tg = window.Telegram?.WebApp;
    if (tg) {
        tg.expand();
        tg.ready();
    }
} catch (error) {
    console.warn('Telegram WebApp not available:', error);
}

// DOM элементы
const chatContainer = document.getElementById('chatContainer');
const messagesWrapper = document.getElementById('messagesWrapper');
const questionInput = document.getElementById('questionInput');
const sendButton = document.getElementById('sendButton');
const micButton = document.getElementById('micButton');

// Проверка наличия элементов
if (!chatContainer || !messagesWrapper || !questionInput || !sendButton || !micButton) {
    console.error('Required DOM elements not found');
    throw new Error('Required DOM elements not found');
}

// Функция создания элемента сообщения
function createMessageElement(text, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', isUser ? 'user-message' : 'bot-message');

    if (!isUser) {
        const iconDiv = document.createElement('div');
        iconDiv.classList.add('message-icon');
        iconDiv.innerHTML = `
            <svg viewBox="0 0 24 24">
                <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z" />
            </svg>`;
        messageDiv.appendChild(iconDiv);
    }

    const textSpan = document.createElement('span');
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    parts.forEach(part => {
        if (part.match(urlRegex)) {
            const link = document.createElement('a');
            link.href = part;
            link.textContent = part;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            textSpan.appendChild(link);
        } else {
            textSpan.appendChild(document.createTextNode(part));
        }
    });

    messageDiv.appendChild(textSpan);
    return messageDiv;
}

// Функция анимированного вывода ответа
async function typeResponse(text) {
    if (!text) return;

    try {
        await new Promise(resolve => setTimeout(resolve, 500));

        const messageElement = createMessageElement('', false);
        const textSpan = messageElement.querySelector('span');
        messagesWrapper.appendChild(messageElement);

        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = text.split(urlRegex);

        for (const part of parts) {
            if (part.match(urlRegex)) {
                const link = document.createElement('a');
                link.href = part;
                link.textContent = part;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                textSpan.appendChild(link);
            } else {
                for (const char of part) {
                    textSpan.appendChild(document.createTextNode(char));
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                    await new Promise(resolve => setTimeout(resolve, 20));
                }
            }
        }
    } catch (error) {
        console.error('Error in typeResponse:', error);
    }
}

// Определение эмоции
async function detectEmotion(text) {
    try {
        const normalizedText = text.toLowerCase();
        for (const [emotion, triggers] of Object.entries(emotionalTriggers)) {
            if (triggers.some(trigger => normalizedText.includes(trigger))) {
                return emotion;
            }
        }
        return 'neutral';
    } catch (error) {
        console.error('Error in detectEmotion:', error);
        return 'neutral';
    }
}

// Обработчик вопросов
async function handleQuestion() {
    const question = questionInput.value.trim();
    if (!question) return;

    try {
        // Добавляем сообщение пользователя
        const messageElement = createMessageElement(question, true);
        messagesWrapper.appendChild(messageElement);
        questionInput.value = '';
        chatContainer.scrollTop = chatContainer.scrollHeight;

        // Определяем эмоцию и стиль общения
        const emotion = await detectEmotion(question);
        const currentStyle = emotion === 'neutral' ? 'friendly' : 'emotional';

        // Ищем ответ
        let answer = findBestMatch(question);
        if (!answer) {
            const links = findLinks(question);
            answer = links || communicationStyles[currentStyle].responses.unclear;
        }

        // Выводим ответ
        await typeResponse(getRandomResponse(answer));
    } catch (error) {
        console.error('Error in handleQuestion:', error);
        await typeResponse(communicationStyles.friendly.responses.error);
    }
}

// Обработчики событий
questionInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleQuestion();
    }
});

sendButton.addEventListener('click', handleQuestion);

// Приветственное сообщение
setTimeout(() => {
    typeResponse(communicationStyles.friendly.greeting);
}, 500);

// Инициализация распознавания речи
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    try {
        const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'ru-RU';
        recognition.continuous = false;
        recognition.interimResults = true;

        let isRecording = false;

        recognition.onstart = () => {
            isRecording = true;
            micButton.classList.add('recording');
            questionInput.placeholder = 'Говорите...';
        };

        recognition.onend = () => {
            isRecording = false;
            micButton.classList.remove('recording');
            questionInput.placeholder = 'Введите ваш вопрос...';
        };

        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0].transcript)
                .join('');
            questionInput.value = transcript;
            if (event.results[0].isFinal) {
                handleQuestion();
                recognition.stop();
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            recognition.stop();
        };

        micButton.addEventListener('click', () => {
            if (!isRecording) {
                recognition.start();
            } else {
                recognition.stop();
            }
        });
    } catch (error) {
        console.error('Error initializing speech recognition:', error);
        micButton.style.display = 'none';
    }
} else {
    console.log('Speech recognition not supported');
    micButton.style.display = 'none';
}
