class MessageProcessor {
  static useOpenAI = false;
  static openAIKey = null;

  static async initOpenAI(apiKey) {
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
      return true;
    } catch (error) {
      console.error('Failed to initialize OpenAI:', error);
      return false;
    }
  }

  static async getOpenAIResponse(userInput) {
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

  static async toggleOpenAI() {
    try {
      if (!this.useOpenAI) {
        if (!this.openAIKey) {
          const key = prompt('Пожалуйста, введите ваш OpenAI API ключ:');
          if (!key) {
            throw new Error('API ключ не предоставлен');
          }
          
          const initialized = await this.initOpenAI(key);
          if (!initialized) {
            throw new Error('Не удалось инициализировать OpenAI');
          }
        }
      }
      
      this.useOpenAI = !this.useOpenAI;
      return this.useOpenAI 
        ? "Режим OpenAI включен. Теперь я буду использовать ИИ для ответов."
        : "Режим OpenAI выключен. Возврат к стандартному режиму.";
    } catch (error) {
      console.error('Error toggling OpenAI:', error);
      throw error;
    }
  }

  static async processMessage(text) {
    if (this.useOpenAI) {
      try {
        return await this.getOpenAIResponse(text);
      } catch (error) {
        console.error('OpenAI error:', error);
        return "Извините, произошла ошибка при обработке запроса. Попробуйте позже или переключитесь в обычный режим.";
      }
    }

    // Локальная обработка
    const normalizedText = text.toLowerCase().trim()
      .replace(/[.,!?]/g, '')
      .replace(/\s+/g, ' ');

    if (window.database[normalizedText]) {
      return window.database[normalizedText];
    }

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
}

// Делаем класс доступным глобально
window.MessageProcessor = MessageProcessor;
