// Класс для обработки сообщений
class MessageProcessor {
  static useOpenAI = false;
  static openAIKey = null;

  // Обработка сообщений
  static processMessage(text) {
    // Нормализация текста
    const normalizedText = text.toLowerCase().trim()
      .replace(/[.,!?]/g, '')
      .replace(/\s+/g, ' ');

    // Проверка пустой строки
    if (!normalizedText) {
      return "Пожалуйста, введите сообщение.";
    }

    // Поиск точного совпадения
    if (window.database[normalizedText]) {
      return window.database[normalizedText];
    }

    // Поиск похожих фраз
    const words = normalizedText.split(' ');
    let bestMatch = {
      response: '',
      confidence: 0
    };

    for (const key of Object.keys(window.database)) {
      const keyWords = key.split(' ');
      let matchCount = 0;

      for (const word of words) {
        if (keyWords.includes(word)) {
          matchCount++;
        }
      }

      const confidence = matchCount / Math.max(words.length, keyWords.length);

      if (confidence > bestMatch.confidence && confidence > 0.3) {
        bestMatch = {
          response: window.database[key],
          confidence: confidence
        };
      }
    }

    return bestMatch.confidence > 0
      ? bestMatch.response
      : "Извините, я не совсем понял ваш вопрос. Можете переформулировать?";
  }

  // Переключение режима OpenAI
  static toggleOpenAI() {
    this.useOpenAI = !this.useOpenAI;
    return this.useOpenAI 
      ? "Режим OpenAI включен. Теперь я буду использовать ИИ для ответов."
      : "Режим OpenAI выключен. Возврат к стандартному режиму.";
  }
}

// Делаем класс доступным глобально
window.MessageProcessor = MessageProcessor;
