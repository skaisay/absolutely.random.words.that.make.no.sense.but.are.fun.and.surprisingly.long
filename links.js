// База данных ссылок с категориями
export const linksDatabase = {
    // Образование
    education: {
        programming: [
            {
                request_variations: [
                    "как научиться программировать",
                    "где учить программирование",
                    "сайт для обучения программированию",
                    "хочу стать программистом",
                    "курсы программирования онлайн",
                    "обучение кодингу с нуля",
                    "где писать код онлайн"
                ],
                responses: [
                    "MDN Web Docs - отличный ресурс для изучения веб-разработки. Здесь вы найдете подробные руководства, справочники и учебники: https://developer.mozilla.org",
                    "freeCodeCamp предлагает бесплатные интерактивные курсы по программированию с сертификацией: https://www.freecodecamp.org",
                    "Codecademy - популярная платформа для изучения программирования с практическими заданиями: https://www.codecademy.com"
                ]
            },
            {
                request_variations: [
                    "как учить javascript",
                    "уроки javascript",
                    "учебник по javascript",
                    "js туториал",
                    "javascript для начинающих",
                    "где учить js",
                    "джаваскрипт обучение"
                ],
                responses: [
                    "learn.javascript.ru - лучший русскоязычный учебник по JavaScript с практическими примерами: https://learn.javascript.ru",
                    "JavaScript.info - современный учебник JavaScript с интерактивными примерами: https://javascript.info",
                    "W3Schools - простой и понятный ресурс для изучения JavaScript: https://www.w3schools.com/js/"
                ]
            }
        ],
        languages: [
            {
                request_variations: [
                    "где учить английский",
                    "сайты для изучения английского",
                    "английский язык онлайн",
                    "приложение для английского",
                    "как выучить инглиш",
                    "английский для начинающих",
                    "курсы английского"
                ],
                responses: [
                    "Duolingo - бесплатное приложение для изучения языков с игровым подходом: https://www.duolingo.com",
                    "LingoDeer - эффективное приложение для изучения английского и других языков: https://www.lingodeer.com",
                    "BBC Learning English - бесплатные материалы для изучения английского: https://www.bbc.co.uk/learningenglish"
                ]
            }
        ]
    },

    // Работа и карьера
    career: {
        job_search: [
            {
                request_variations: [
                    "где искать работу",
                    "сайты для поиска работы",
                    "вакансии онлайн",
                    "работа программистом",
                    "поиск вакансий",
                    "найти работу в it",
                    "работа разработчиком"
                ],
                responses: [
                    "hh.ru - крупнейший сайт по поиску работы в России: https://hh.ru",
                    "LinkedIn - международная платформа для профессиональных контактов и поиска работы: https://www.linkedin.com",
                    "Хабр Карьера - специализированная площадка для IT-специалистов: https://career.habr.com"
                ]
            }
        ],
        freelance: [
            {
                request_variations: [
                    "где найти фриланс",
                    "сайты для фрилансеров",
                    "работа на фрилансе",
                    "заказы для фрилансеров",
                    "фриланс биржи",
                    "удаленная работа",
                    "работа на себя"
                ],
                responses: [
                    "Upwork - международная платформа для фрилансеров: https://www.upwork.com",
                    "Freelance.ru - популярная русскоязычная биржа фриланса: https://freelance.ru",
                    "FL.ru - старейшая русскоязычная биржа удаленной работы: https://fl.ru"
                ]
            }
        ]
    },

    // Инструменты разработчика
    dev_tools: {
        code_editors: [
            {
                request_variations: [
                    "где писать код онлайн",
                    "онлайн редактор кода",
                    "ide в браузере",
                    "редактор для javascript",
                    "песочница для кода",
                    "онлайн компилятор",
                    "где тестировать код"
                ],
                responses: [
                    "CodePen - популярная платформа для создания и тестирования веб-проектов: https://codepen.io",
                    "CodeSandbox - мощный онлайн-редактор для веб-разработки: https://codesandbox.io",
                    "StackBlitz - быстрый онлайн IDE для веб-разработки: https://stackblitz.com"
                ]
            }
        ],
        version_control: [
            {
                request_variations: [
                    "где хранить код",
                    "система контроля версий",
                    "хостинг репозиториев",
                    "где держать проекты",
                    "git хостинг",
                    "система версионирования",
                    "облако для кода"
                ],
                responses: [
                    "GitHub - крупнейший хостинг для Git-репозиториев: https://github.com",
                    "GitLab - платформа для хостинга Git-репозиториев с CI/CD: https://gitlab.com",
                    "Bitbucket - хостинг Git-репозиториев от Atlassian: https://bitbucket.org"
                ]
            }
        ]
    }
};
