interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

class MessageProcessor {
  private useOpenAI: boolean = false;
  private openAIKey: string | null = null;

  async initOpenAI(apiKey: string): Promise<boolean> {
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
      console.log('OpenAI initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize OpenAI:', error);
      this.openAIKey = null;
      return false;
    }
  }

  async getOpenAIResponse(userInput: string): Promise<string> {
    if (!this.openAIKey) {
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

      const data: OpenAIResponse = await response.json();
      return data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error getting OpenAI response:', error);
      throw error;
    }
  }

  async toggleOpenAI(): Promise<string> {
    try {
      if (!this.useOpenAI) {
        const key = prompt('Пожалуйста, введите ваш OpenAI API ключ:');
        if (!key) {
          return "Операция отменена. API ключ не был предоставлен.";
        }

        const initialized = await this.initOpenAI(key);
        if (!initialized) {
          return "Не удалось подключиться к OpenAI. Проверьте ваш API ключ и попробуйте снова.";
        }
        this.useOpenAI = true;
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

  async processMessage(text: string): Promise<string> {
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
          response: database[key],
          confidence: confidence
        };
      }
    }

    return bestMatch.confidence > 0
      ? bestMatch.response
      : "Извините, я не совсем понял ваш вопрос. Можете переформулировать?";
  }
}

const messageProcessor = new MessageProcessor();
