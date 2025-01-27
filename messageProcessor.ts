import { intents, type Intent, type Context, defaultContext } from '../data/database';

export class MessageProcessor {
  private static context: Context = { ...defaultContext };
  private static conversationHistory: string[] = [];
  
  private static normalizeText(text: string): string {
    return text.toLowerCase()
      .trim()
      .replace(/[.,!?]/g, '')
      .replace(/\s+/g, ' ');
  }

  private static findIntent(text: string): { intent: string; confidence: number } | null {
    const normalizedInput = this.normalizeText(text);
    const words = normalizedInput.split(' ');
    
    let bestMatch = {
      intent: '',
      confidence: 0
    };

    // Проверяем каждый интент
    for (const [intentName, intentData] of Object.entries(intents)) {
      for (const pattern of intentData.patterns) {
        const patternWords = pattern.split(' ');
        let matchCount = 0;

        // Считаем совпадающие слова
        for (const word of words) {
          if (patternWords.includes(word)) {
            matchCount++;
          }
        }

        // Вычисляем уверенность
        const confidence = matchCount / Math.max(words.length, patternWords.length);

        if (confidence > bestMatch.confidence) {
          bestMatch = {
            intent: intentName,
            confidence: confidence
          };
        }
      }
    }

    return bestMatch.confidence > 0.3 ? bestMatch : null;
  }

  private static getRandomResponse(intent: Intent): string {
    return intent.responses[Math.floor(Math.random() * intent.responses.length)];
  }

  private static handleAction(action: string): void {
    switch (action) {
      case 'nextStep':
        if (this.context.step !== undefined) {
          this.context.step++;
        }
        break;
      case 'previousStep':
        if (this.context.step !== undefined && this.context.step > 0) {
          this.context.step--;
        }
        break;
      case 'repeat':
        // Повторяем последнее сообщение бота
        if (this.conversationHistory.length >= 2) {
          return this.conversationHistory[this.conversationHistory.length - 2];
        }
        break;
    }
  }

  static processMessage(text: string): string {
    // Сохраняем сообщение пользователя
    this.conversationHistory.push(text);

    // Ищем подходящий интент
    const matchedIntent = this.findIntent(text);
    
    if (matchedIntent) {
      const intent = intents[matchedIntent.intent];
      
      // Обновляем контекст
      this.context.previousIntent = this.context.currentIntent;
      this.context.currentIntent = matchedIntent.intent;

      // Выполняем действие, если есть
      if (intent.action) {
        this.handleAction(intent.action);
      }

      // Генерируем ответ
      const response = this.getRandomResponse(intent);
      
      // Сохраняем ответ бота
      this.conversationHistory.push(response);
      
      return response;
    }

    // Если интент не найден
    const unknownResponses = [
      "Извините, я не совсем понял. Можете переформулировать?",
      "Не уверен, что правильно вас понял. Попробуйте сказать иначе.",
      "Простите, мне нужно больше контекста. Можете пояснить?",
      "Хмм... Не могу точно определить, что вы имеете в виду.",
      "Давайте попробуем иначе. Что конкретно вас интересует?"
    ];

    const response = unknownResponses[Math.floor(Math.random() * unknownResponses.length)];
    this.conversationHistory.push(response);
    return response;
  }

  // Методы для работы с контекстом
  static getContext(): Context {
    return this.context;
  }

  static setContext(newContext: Partial<Context>): void {
    this.context = { ...this.context, ...newContext };
  }

  static resetContext(): void {
    this.context = { ...defaultContext };
    this.conversationHistory = [];
  }
}
