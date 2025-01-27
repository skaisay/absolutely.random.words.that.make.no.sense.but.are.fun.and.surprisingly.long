/* Основные стили */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

body {
  background: #000000;
  color: #ffffff;
  min-height: 100vh;
  overflow-x: hidden;
}

/* Снежинки */
.snowflake {
  position: fixed;
  width: 4px;
  height: 4px;
  background: #ffffff;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(1px);
  animation: fall linear infinite;
  z-index: 1;
  box-shadow: 0 0 5px #ffffff;
  opacity: 0.6;
}

@keyframes fall {
  to {
    transform: translateY(100vh) rotate(360deg);
  }
}

/* Анимированный робот */
.robot {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 60px;
  background: #2ea6ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: float 3s ease-in-out infinite;
  box-shadow: 0 0 30px #2ea6ff;
}

.robot svg {
  width: 40px;
  height: 40px;
  fill: white;
  filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.8));
}

@keyframes float {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-10px); }
}

/* Чат */
.chat-container {
  padding: 80px 20px 100px;
  height: 100vh;
  overflow-y: auto;
  position: relative;
  z-index: 2;
}

.messages-wrapper {
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

.message {
  margin: 10px 0;
  padding: 12px 16px;
  border-radius: 16px;
  max-width: 80%;
  animation: fadeIn 0.3s ease-in-out;
  position: relative;
  line-height: 1.5;
  word-wrap: break-word;
  background: rgba(45, 45, 45, 0.5);
  backdrop-filter: blur(10px);
}

.user-message {
  background: rgba(46, 166, 255, 0.8);
  margin-left: auto;
  border-bottom-right-radius: 4px;
}

.bot-message {
  background: rgba(45, 45, 45, 0.5);
  margin-right: auto;
  border-bottom-left-radius: 4px;
  padding-left: 45px;
}

.message-icon {
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.message-icon svg {
  width: 24px;
  height: 24px;
  fill: #2ea6ff;
  filter: drop-shadow(0 0 3px #2ea6ff);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Поле ввода */
.input-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  display: flex;
  gap: 12px;
  z-index: 1000;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  left: 50%;
  transform: translateX(-50%);
}

.input-field {
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 16px;
  transition: all 0.3s ease;
  width: 100%;
}

.input-field:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.15);
}

.buttons-container {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.send-button,
.mic-button {
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  background: #2ea6ff;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  box-shadow: 0 0 15px #2ea6ff;
  flex-shrink: 0;
}

.send-button:hover,
.mic-button:hover {
  background: #52b5ff;
  transform: scale(1.05);
}

.send-button svg,
.mic-button svg {
  width: 24px;
  height: 24px;
  fill: white;
}

.send-button svg {
  transform: rotate(45deg);
}

.mic-button.recording {
  background: #ff4444;
  box-shadow: 0 0 15px #ff4444;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(255, 68, 68, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(255, 68, 68, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 68, 68, 0); }
}

/* Скроллбар */
.chat-container::-webkit-scrollbar {
  width: 6px;
}

.chat-container::-webkit-scrollbar-track {
  background: transparent;
}

.chat-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

/* Адаптивность */
@media (max-width: 600px) {
  .chat-container {
    padding: 80px 10px 90px;
  }

  .message {
    max-width: 85%;
    font-size: 15px;
  }

  .input-container {
    padding: 10px;
    width: calc(100% - 20px);
    max-width: none;
  }

  .input-field {
    font-size: 14px;
  }

  .send-button,
  .mic-button {
    width: 40px;
    height: 40px;
  }
}

/* Планшеты */
@media (min-width: 601px) and (max-width: 1024px) {
  .input-container {
    width: calc(100% - 40px);
    max-width: 600px;
  }
}

/* Десктопы */
@media (min-width: 1025px) {
  .input-container {
    max-width: 800px;
  }
}
