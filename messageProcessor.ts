class MessageProcessor {
  constructor() {
    this.useOpenAI = false;
    this.openAIKey = null;
    console.log('MessageProcessor initialized');
  }

  async initOpenAI(apiKey) {
    if (!apiKey || apiKey.trim() === '') {
      console.error('Empty API key provided');
      return false;
    }

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
        console.error('OpenAI API error:', response.status, response.statusText);
        return false;
      }

      this.openAIKey = apiKey;
      this.useOpenAI = true;
      console.log('OpenAI initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize OpenAI:', error);
      this.openAIKey = null;
      this.useOpenAI = false;
      return false;
    }
  }

  async getOpenAIResponse(userInput) {
    if (!this.openAIKey || !this.useOpenAI) {
      throw new Error('OpenAI не инициализирован');
    }

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
    console.log('Toggling OpenAI mode. Current state:', this.useOpenAI);
    
    try {
      if (!this.useOpenAI) {
        const key = window.prompt('Пожалуйста, введите ваш PAEEAPI ключ:');
        console.log('API key received:', key ? 'Yes' : 'No');
        
        if (!key) {
          return "Операция отменена. API ключ не был предоставлен.";
        }

        const initialized = await this.initOpenAI(key);
        console.log('OpenAI initialization result:', initialized);
        
        if (!initialized) {
          return "Не удалось подключиться к OpenAI. Проверьте ваш API ключ и попробуйте снова.";
        }
        
        return "Режим OpenAI включен. Теперь я буду использовать ИИ для ответов.";
      } else {
        this.useOpenAI = false;
        this.openAIKey = null;
        console.log('OpenAI mode disabled');
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
    console.log('Processing message:', text);
    console.log('OpenAI mode:', this.useOpenAI);
    
    if (this.useOpenAI && this.openAIKey) {
      try {
        return await this.getOpenAIResponse(text);
      } catch (error) {
        console.error('OpenAI error:', error);
        this.useOpenAI = false;
        this.openAIKey = null;
        return "Произошла ошибка при использовании OpenAI. Переключаюсь в обычный режим...";
      }
    }

    const normalizedText = text.toLowerCase().trim()
      .replace(/[.,!?]/g, '')
      .replace(/\s+/g, ' ');

    console.log('Normalized text:', normalizedText);

    // Прямое совпадение
    if (window.database[normalizedText]) {
      console.log('Direct match found');
      return window.database[normalizedText];
    }

    // Поиск частичных совпадений
    const words = normalizedText.split(' ');
    let bestMatch = {
      response: '',
      confidence: 0,
      matchedKey: ''
    };

    for (const key of Object.keys(window.database)) {
      const keyWords = key.split(' ');
      let matchCount = 0;
      let exactMatches = 0;

      for (const word of words) {
        if (keyWords.includes(word)) {
          matchCount++;
          if (word.length > 3) { // Учитываем только значимые слова
            exactMatches++;
          }
        }
      }

      // Улучшенный алгоритм подсчета уверенности
      const confidence = (matchCount / Math.max(words.length, keyWords.length)) +
                        (exactMatches * 0.2); // Бонус за точные совпадения

      if (confidence > bestMatch.confidence && confidence > 0.3) {
        bestMatch = {
          response: window.database[key],
          confidence: confidence,
          matchedKey: key
        };
      }
    }

    console.log('Best match:', bestMatch);

    return bestMatch.confidence > 0
      ? bestMatch.response
      : "Извините, я не совсем понял ваш вопрос. Можете переформулировать?";
  }
}

// Создаем глобальный экземпляр MessageProcessor
window.messageProcessor = new MessageProcessor();
