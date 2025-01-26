// Вспомогательные функции
export function findBestMatch(question) {
    const normalizedQuestion = question.toLowerCase().trim();
    
    // Прямое совпадение
    if (database[normalizedQuestion]) {
        return database[normalizedQuestion];
    }

    // Поиск частичных совпадений
    let bestMatch = null;
    let bestScore = 0;

    for (const [key, value] of Object.entries(database)) {
        if (typeof key === 'string') {
            const score = calculateSimilarity(normalizedQuestion, key.toLowerCase());
            if (score > bestScore && score > 0.4) {
                bestScore = score;
                bestMatch = value;
            }
        }
    }

    return bestMatch;
}

export function findLinks(question) {
    const normalizedQuestion = question.toLowerCase().trim();
    
    // Поиск в базе ссылок
    for (const category of Object.values(database.links_database || {})) {
        for (const item of category) {
            if (item.request_variations.some(variation => 
                normalizedQuestion.includes(variation) || 
                calculateSimilarity(normalizedQuestion, variation) > 0.7
            )) {
                return item.responses;
            }
        }
    }
    
    return null;
}

export function getRandomResponse(responses) {
    if (Array.isArray(responses)) {
        return responses[Math.floor(Math.random() * responses.length)];
    }
    return responses;
}

function calculateSimilarity(str1, str2) {
    const words1 = str1.split(' ');
    const words2 = str2.split(' ');
    
    const commonWords = words1.filter(word => 
        words2.some(w2 => w2.includes(word) || word.includes(w2))
    );
    
    return commonWords.length / Math.max(words1.length, words2.length);
}

// База данных вопросов и ответов
export const database = {
    // Базовые приветствия
    "привет": ["Привет! Как я могу помочь?", "Здравствуйте! Рад вас видеть!", "Привет-привет! Что нового?"],
    "здравствуйте": ["Здравствуйте! Чем могу помочь?", "Добрый день! Рад вас видеть!", "Здравствуйте! Как ваши дела?"],
    
    // Прощания
    "пока": ["До свидания! Хорошего дня!", "Пока! Было приятно пообщаться!", "До встречи! Возвращайтесь!"],
    "до свидания": ["До свидания! Всего доброго!", "Всего хорошего! Буду рад помочь снова!", "До новых встреч!"],
    
    // Благодарности
    "спасибо": ["Пожалуйста! Рад был помочь! 😊", "Всегда пожалуйста! 😊", "Обращайтесь! 😊"],
    
    // База ссылок
    links_database: {
        programming: [
            {
                request_variations: ["как научиться программировать", "где учить программирование"],
                responses: [
                    "Вот отличные ресурсы для начала:\n- MDN Web Docs: https://developer.mozilla.org\n- freeCodeCamp: https://www.freecodecamp.org"
                ]
            }
        ]
    }
};

// Стили общения
export const communicationStyles = {
    friendly: {
        greeting: "Привет! Как я могу помочь? 😊",
        responses: {
            unclear: "Извините, я не совсем понял. Можете переформулировать вопрос? 🤔",
            error: "Упс! Что-то пошло не так. Давайте попробуем еще раз! 😅"
        }
    },
    formal: {
        greeting: "Здравствуйте! Чем могу помочь?",
        responses: {
            unclear: "Извините, не совсем понял ваш вопрос. Можете уточнить?",
            error: "Извините, произошла ошибка. Попробуйте еще раз."
        }
    }
};

// Эмоциональные триггеры
export const emotionalTriggers = {
    positive: ['счастлив', 'рад', 'весело', 'круто', 'супер'],
    negative: ['грустно', 'плохо', 'ужасно', 'печально'],
    neutral: ['нормально', 'обычно', 'как всегда']
};
