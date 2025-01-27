// Основные элементы интерфейса
let chatContainer;
let messagesWrapper;
let inputField;
let sendButton;
let micButton;
let paeButton;
let isRecording = false;
let isTyping = false;
let shouldAutoScroll = true;

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
  createInterface();
  initializeSnowflakes();
  showWelcomeMessage();
});

// Создание интерфейса
function createInterface() {
  const root = document.getElementById('root');
  
  // Создаем робота
  const robot = document.createElement('div');
  robot.className = 'robot';
  robot.innerHTML = `
    <svg viewBox="0 0 24 24">
      <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z" />
    </svg>
  `;
  
  // Создаем контейнер чата
  chatContainer = document.createElement('div');
  chatContainer.className = 'chat-container';
  chatContainer.addEventListener('scroll', handleScroll);
  
  messagesWrapper = document.createElement('div');
  messagesWrapper.className = 'messages-wrapper';
  chatContainer.appendChild(messagesWrapper);
  
  // Создаем поле ввода
  const inputContainer = document.createElement('div');
  inputContainer.className = 'input-container';
  
  const inputWrapper = document.createElement('div');
  inputWrapper.className = 'input-wrapper';
  
  // Создаем кнопку PAE
  paeButton = document.createElement('button');
  paeButton.className = 'pae-button';
  paeButton.textContent = 'PAE';
  paeButton.addEventListener('click', async () => {
    try {
      const response = await window.MessageProcessor.toggleOpenAI();
      await addMessage(response, false);
    } catch (error) {
      console.error('Error toggling OpenAI:', error);
      await addMessage(error.message, false);
    }
  });
  inputWrapper.appendChild(paeButton);
  
  inputField = document.createElement('input');
  inputField.type = 'text';
  inputField.className = 'input-field';
  inputField.placeholder = 'Введите ваш вопрос...';
  inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSendMessage();
  });

  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'buttons-container';
  
  micButton = document.createElement('button');
  micButton.className = 'mic-button';
  micButton.innerHTML = `
    <svg viewBox="0 0 24 24">
      <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z"/>
    </svg>
  `;
  micButton.addEventListener('click', handleVoiceInput);
  
  sendButton = document.createElement('button');
  sendButton.className = 'send-button';
  sendButton.innerHTML = `
    <svg viewBox="0 0 24 24">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
    </svg>
  `;
  sendButton.addEventListener('click', handleSendMessage);
  
  buttonsContainer.appendChild(micButton);
  buttonsContainer.appendChild(sendButton);
  
  inputWrapper.appendChild(inputField);
  inputWrapper.appendChild(buttonsContainer);
  inputContainer.appendChild(inputWrapper);
  
  root.appendChild(robot);
  root.appendChild(chatContainer);
  root.appendChild(inputContainer);
}

// Инициализация снежинок
function initializeSnowflakes() {
  let snowflakeCount = 0;
  const MAX_SNOWFLAKES = 15;

  function createSnowflake() {
    if (snowflakeCount >= MAX_SNOWFLAKES) return;

    const snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');
    snowflake.style.left = `${Math.random() * 100}vw`;
    snowflake.style.animationDuration = `${Math.random() * 5 + 3}s`;
    snowflake.style.opacity = `${Math.random() * 0.2 + 0.1}`;
    document.body.appendChild(snowflake);

    snowflake.style.top = '-10px';
    snowflakeCount++;

    snowflake.addEventListener('animationend', () => {
      snowflake.remove();
      snowflakeCount--;
    });
  }

  setInterval(createSnowflake, 800);
}

// Показ приветственного сообщения
function showWelcomeMessage() {
  setTimeout(() => {
    addMessage("Привет! Задайте мне вопрос голосом или текстом, и я постараюсь на него ответить.", false);
  }, 500);
}

// Обработка скролла
function handleScroll() {
  if (chatContainer) {
    const { scrollTop, scrollHeight, clientHeight } = chatContainer;
    shouldAutoScroll = Math.abs(scrollHeight - clientHeight - scrollTop) < 50;
  }
}

// Добавление сообщения
async function addMessage(text, isUser) {
  const message = document.createElement('div');
  message.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
  
  if (!isUser) {
    const icon = document.createElement('div');
    icon.className = 'message-icon';
    icon.innerHTML = `
      <svg viewBox="0 0 24 24">
        <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z" />
      </svg>
    `;
    message.appendChild(icon);
  }

  const content = document.createElement('span');
  message.appendChild(content);
  messagesWrapper.appendChild(message);

  if (!isUser) {
    isTyping = true;
    content.textContent = '';
    let displayedText = '';
    
    for (let i = 0; i < text.length; i++) {
      displayedText += text[i];
      content.textContent = displayedText;
      await new Promise(resolve => setTimeout(resolve, 20));
      
      if (shouldAutoScroll) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }
    
    isTyping = false;
  } else {
    content.textContent = text;
  }

  if (shouldAutoScroll) {
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
}

// Обработка отправки сообщения
async function handleSendMessage() {
  if (!inputField.value.trim() || isTyping) return;

  const userMessage = inputField.value;
  inputField.value = '';
  
  await addMessage(userMessage, true);
  
  try {
    const response = await window.MessageProcessor.processMessage(userMessage);
    await addMessage(response, false);
  } catch (error) {
    console.error('Error processing message:', error);
    await addMessage("Извините, произошла ошибка при обработке сообщения.", false);
  }
}

// Обработка голосового ввода
function handleVoiceInput() {
  if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'ru-RU';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      isRecording = true;
      micButton.classList.add('recording');
      inputField.value = 'Говорите...';
      inputField.disabled = true;
    };

    recognition.onend = () => {
      isRecording = false;
      micButton.classList.remove('recording');
      inputField.disabled = false;
      if (inputField.value === 'Говорите...') {
        inputField.value = '';
      }
      inputField.focus();
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      inputField.value = transcript;
      
      if (event.results[0].isFinal) {
        recognition.stop();
        handleSendMessage();
      }
    };

    recognition.onerror = (event) => {
      console.error('Ошибка распознавания:', event.error);
      isRecording = false;
      micButton.classList.remove('recording');
      inputField.disabled = false;
      inputField.value = '';
    };

    recognition.start();
  } else {
    alert('К сожалению, ваш браузер не поддерживает распознавание речи.');
  }
}
