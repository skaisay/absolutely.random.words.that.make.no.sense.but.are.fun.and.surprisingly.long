class MessageProcessor {
  constructor() {
    this.useOpenAI = false;
    this.openAIKey = null;
    console.log('MessageProcessor initialized');
  }

  async initOpenAI(apiKey) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'system', content: 'Test connection' }],
          max_tokens: 5
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      this.openAIKey = apiKey;
      this.useOpenAI = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize OpenAI:', error);
      return false;
    }
  }

  async getOpenAIResponse(userInput) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openAIKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: userInput }],
          temperature: 0.7,
          max_tokens: 150
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error getting OpenAI response:', error);
      throw error;
    }
  }

  async toggleOpenAI() {
    try {
      if (!this.useOpenAI) {
        const key = window.prompt('Пожалуйста, введите ваш PAEEAPI ключ:');
        if (!key) {
          return "Операция отменена. API ключ не был предоставлен.";
        }

        const initialized = await this.initOpenAI(key);
        if (!initialized) {
          return "Не удалось подключиться к OpenAI. Проверьте ваш API ключ и попробуйте снова.";
        }
        
        return "Режим OpenAI включен. Теперь я буду использовать ИИ для ответов.";
      } else {
        this.useOpenAI = false;
        this.openAIKey = null;
        return "Режим OpenAI выключен. Возврат к стандартному режиму.";
      }
    } catch (error) {
      console.error('Error toggling OpenAI:', error);
      this.useOpenAI = false;
      this.openAIKey = null;
      return `Ошибка при переключении режима: ${error.message}`;
    }
  }

  async processMessage(text) {
    try {
      if (this.useOpenAI && this.openAIKey) {
        return await this.getOpenAIResponse(text);
      }

      const normalizedText = text.toLowerCase().trim()
        .replace(/[.,!?]/g, '')
        .replace(/\s+/g, ' ');

      // Прямое совпадение
      if (database[normalizedText]) {
        return database[normalizedText];
      }

      // Поиск частичных совпадений
      const words = normalizedText.split(' ');
      let bestMatch = {
        response: '',
        confidence: 0
      };

      for (const key of Object.keys(database)) {
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
            response: database[key],
            confidence: confidence
          };
        }
      }

      return bestMatch.confidence > 0
        ? bestMatch.response
        : "Извините, я не совсем понял ваш вопрос. Можете переформулировать?";
    } catch (error) {
      console.error('Error in message processing:', error);
      return "Извините, произошла ошибка при обработке сообщения.";
    }
  }
}

// Создаем глобальный экземпляр MessageProcessor
window.messageProcessor = new MessageProcessor();
