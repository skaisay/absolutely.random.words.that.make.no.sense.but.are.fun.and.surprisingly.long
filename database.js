// База данных вопросов, ответов и ссылок
export const database = {
    // Существующие категории остаются без изменений
    "привет": ["Привет! Как я могу помочь?", "Здравствуйте! Рад вас видеть!", "Привет-привет! Что нового?"],
    // ... (остальные существующие категории)

    // Новая структура для ссылок
    links_database: {
        // Категория: Программирование
        programming: [
            {
                request_variations: [
                    "как научиться программировать",
                    "где учить программирование",
                    "сайт для обучения программированию",
                    "хочу стать программистом",
                    "курсы программирования",
                    "обучение кодингу",
                    "где писать код онлайн"
                ],
                responses: [
                    "Рекомендую начать с MDN Web Docs - отличный ресурс для изучения веб-разработки: https://developer.mozilla.org",
                    "freeCodeCamp предлагает бесплатные курсы по программированию: https://www.freecodecamp.org",
                    "Codecademy - интерактивная платформа для изучения кода: https://www.codecademy.com"
                ]
            },
            {
                request_variations: [
                    "как учить javascript",
                    "уроки javascript",
                    "учебник по javascript",
                    "js туториал",
                    "javascript для начинающих",
                    "где учить js"
                ],
                responses: [
                    "Лучший русскоязычный учебник по JavaScript: https://learn.javascript.ru",
                    "Современный учебник JavaScript с практическими примерами: https://javascript.info",
                    "MDN предлагает отличную документацию по JavaScript: https://developer.mozilla.org/ru/docs/Web/JavaScript"
                ]
            }
        ],

        // Категория: Дизайн
        design: [
            {
                request_variations: [
                    "где найти бесплатные иконки",
                    "скачать иконки",
                    "иконки для сайта",
                    "бесплатные svg иконки",
                    "ресурс с иконками"
                ],
                responses: [
                    "Feather Icons предлагает красивые открытые иконки: https://feathericons.com",
                    "Material Icons от Google: https://material.io/icons",
                    "Font Awesome - популярная библиотека иконок: https://fontawesome.com"
                ]
            },
            {
                request_variations: [
                    "где найти бесплатные фото",
                    "стоковые изображения",
                    "картинки для сайта",
                    "фотографии без авторских прав",
                    "бесплатные изображения"
                ],
                responses: [
                    "Unsplash предлагает бесплатные высококачественные фото: https://unsplash.com",
                    "Pexels - отличный ресурс с бесплатными изображениями: https://pexels.com",
                    "Pixabay предоставляет изображения без авторских прав: https://pixabay.com"
                ]
            }
        ],

        // Категория: Инструменты разработчика
        dev_tools: [
            {
