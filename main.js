import database from './database.js';

// Инициализация Telegram WebApp
const tg = window.Telegram?.WebApp;
if (tg) {
    tg.ready();
}

// Элементы DOM
const chatContainer = document.getElementById('chatContainer');
const questionInput = document.getElementById('questionInput');
const sendButton = document.getElementById('sendButton');

// Функция для добавления сообщений в чат
function createMessageElement(text, isUser) {
    const messageElement = document.createElement('div');
    messageElement.textContent = text;
    messageElement.className = isUser ? 'user-message' : 'bot-message';
    chatContainer.appendChild(messageElement);
}

// Функция обработки ответа бота
function handleQuestion() {
    const question = questionInput.value.trim();
    if (!question) return; // Если поле ввода пустое

    createMessageElement(question, true); // Добавляем сообщение пользователя
    questionInput.value = ''; // Очищаем поле ввода

    // Ищем ответ в базе данных
    const response = database["приветствия"].includes(question)
        ? "Привет! Чем могу помочь?"
        : "Извините, я не понимаю ваш вопрос.";
    createMessageElement(response, false); // Добавляем ответ бота
}

// Обработчик нажатия кнопки отправки
sendButton.addEventListener('click', handleQuestion);

// Обработчик нажатия Enter
questionInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleQuestion();
});
