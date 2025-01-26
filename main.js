import { database, communicationStyles, emotionalTriggers, findBestMatch, findLinks, findConversationResponse, getRandomResponse } from './database.js';

// Инициализация Telegram WebApp
const tg = window.Telegram?.WebApp;
if (tg) {
    tg.expand();
    tg.ready();
}

// DOM элементы
const chatContainer = document.getElementById('chatContainer');
const messagesWrapper = document.getElementById('messagesWrapper');
const questionInput = document.getElementById('questionInput');
const sendButton = document.getElementById('sendButton');
const micButton = document.getElementById('micButton');

// Функция создания элемента сообщения
function createMessageElement(text, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');

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
    // Проверка на URL в тексте
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    parts.forEach((part, index) => {
        if (part.match(urlRegex)) {
            const link = document.createElement('a');
            link.href = part;
            link.textContent = part;
            link.target = '_blank';
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
    await new Promise(resolve => setTimeout(resolve, 1000));

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
            textSpan.appendChild(link);
            await new Promise(resolve => setTimeout(resolve, 100));
        } else {
            const words = part.split(' ');
            for (const word of words) {
                await new Promise(resolve => {
                    requestAnimationFrame(() => {
                        textSpan.appendChild(document.createTextNode(word + ' '));
                        chatContainer.scrollTop = chatContainer.scrollHeight;
                        setTimeout(resolve, 50);
                    });
                });
            }
        }
    }
}

// Функция определения эмоции
async function detectEmotion(text) {
    const normalizedText = text.toLowerCase();
    for (const [emotion, triggers] of Object.entries(emotionalTriggers)) {
        if (triggers.some(trigger => normalizedText.includes(trigger))) {
            return emotion;
        }
    }
    return 'neutral';
}

// Обработчик вопросов
async function handleQuestion() {
    const question = questionInput.value.trim();
    if (!question) return;

    const messageElement = createMessageElement(question, true);
    messagesWrapper.appendChild(messageElement);
    questionInput.value = '';
    chatContainer.scrollTop = chatContainer.scrollHeight;

    try {
        // Определение эмоционального состояния
        const emotion = await detectEmotion(question);
        currentStyle = emotion === 'neutral' ? 'friendly' : 'emotional';

        // Поиск ответа в разных источниках
        let answer;

        // 1. Проверяем прямые совпадения в базе данных
        answer = findBestMatch(question);
        if (answer) {
            answer = getRandomResponse(answer);
        } else {
            // 2. Проверяем наличие ссылок
            const links = findLinks(question);
            if (links) {
                answer = getRandomResponse(links);
            } else {
                // 3. Проверяем базу диалогов
                answer = findConversationResponse(question);
                if (!answer) {
                    answer = "Извините, я не совсем понял ваш вопрос. Можете переформулировать?";
                }
            }
        }

        await typeResponse(answer);
    } catch (error) {
        console.error('Ошибка обработки вопроса:', error);
        await typeResponse(communicationStyles[currentStyle].responses.error);
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

let currentStyle = 'friendly';

// Приветственное сообщение
setTimeout(() => {
    typeResponse(communicationStyles.friendly.greeting);
}, 500);

// Инициализация распознавания речи
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'ru-RU';
    recognition.continuous = false;
    recognition.interimResults = true;

    let isRecording = false;

    recognition.onstart = () => {
        isRecording = true;
        micButton.classList.add('recording');
        questionInput.value = '';
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
        console.error('Ошибка распознавания:', event.error);
        recognition.stop();
    };

    micButton.addEventListener('click', () => {
        if (!isRecording) {
            recognition.start();
        } else {
            recognition.stop();
        }
    });
} else {
    micButton.style.display = 'none';
    console.log('Распознавание речи не поддерживается в этом браузере');
}
