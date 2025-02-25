document.addEventListener('DOMContentLoaded', function() {
    // Объект с переводами
    const translations = {
        ru: {
            language: 'Язык приложения',
            languageDesc: 'Выберите предпочитаемый язык интерфейса. Это изменит язык всех надписей в приложении.',
            animation: 'Анимация звёзд',
            animationDesc: 'Отключение анимации может улучшить производительность приложения и снизить нагрузку на батарею вашего устройства.',
            version: 'Версия приложения',
            versionNumber: '1.0.0 Beta',
            toggleOn: 'Включено',
            toggleOff: 'Выключено',
            backButton: 'Назад',
            aboutApp: 'О приложении',
            profile: 'Профиль',
            settings: 'Настройки',
            menu: 'Меню',
            loading: 'Загрузка...',
            language_code: 'Язык',
            id: 'ID'
        },
        en: {
            language: 'Application Language',
            languageDesc: 'Choose your preferred interface language. This will change the language of all text in the application.',
            animation: 'Star Animation',
            animationDesc: 'Disabling animation can improve application performance and reduce battery drain on your device.',
            version: 'Application Version',
            versionNumber: '1.0.0 Beta',
            toggleOn: 'Enabled',
            toggleOff: 'Disabled',
            backButton: 'Back',
            aboutApp: 'About',
            profile: 'Profile',
            settings: 'Settings',
            menu: 'Menu',
            loading: 'Loading...',
            language_code: 'Language',
            id: 'ID'
        },
        zh: {
            language: '应用语言',
            languageDesc: '选择您喜欢的界面语言。这将更改应用程序中的所有文本。',
            animation: '星星动画',
            animationDesc: '禁用动画可以提高应用程序性能并减少设备电池消耗。',
            version: '应用版本',
            versionNumber: '1.0.0 Beta',
            toggleOn: '已启用',
            toggleOff: '已禁用',
            backButton: '返回',
            aboutApp: '关于',
            profile: '个人资料',
            settings: '设置',
            menu: '菜单',
            loading: '加载中...',
            language_code: '语言',
            id: '编号'
        },
        no: {
            language: 'Applikasjonsspråk',
            languageDesc: 'Velg ditt foretrukne grensesnittspråk. Dette vil endre språket for all tekst i applikasjonen.',
            animation: 'Stjerneanimasjon',
            animationDesc: 'Å deaktivere animasjon kan forbedre applikasjonens ytelse og redusere batteriforbruket på enheten din.',
            version: 'Applikasjonsversjon',
            versionNumber: '1.0.0 Beta',
            toggleOn: 'Aktivert',
            toggleOff: 'Deaktivert',
            backButton: 'Tilbake',
            aboutApp: 'Om',
            profile: 'Profil',
            settings: 'Innstillinger',
            menu: 'Meny',
            loading: 'Laster...',
            language_code: 'Språk',
            id: 'ID'
        }
    };

    // Получаем сохранённые настройки или устанавливаем значения по умолчанию
    const currentLang = localStorage.getItem('appLanguage') || 'ru';
    const isAnimationEnabled = localStorage.getItem('starAnimation') !== 'false';

    // Функция для обновления текстов на странице
    function updatePageTexts(lang) {
        const texts = translations[lang];
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.dataset.translate;
            if (texts[key]) {
                element.textContent = texts[key];
            }
        });
    }

    // Инициализация переключателя языка
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        if (btn.dataset.lang === currentLang) {
            btn.classList.add('active');
        }

        btn.addEventListener('click', function() {
            // Убираем активный класс у всех кнопок
            langButtons.forEach(b => b.classList.remove('active'));
            // Добавляем активный класс нажатой кнопке
            this.classList.add('active');
            // Сохраняем выбранный язык
            const selectedLang = this.dataset.lang;
            localStorage.setItem('appLanguage', selectedLang);
            // Обновляем тексты на странице
            updatePageTexts(selectedLang);
        });
    });

    // Инициализация переключателя анимации
    const animationToggle = document.getElementById('starAnimation');
    const canvas = document.getElementById('starfield');

    // Устанавливаем начальное состояние
    animationToggle.checked = isAnimationEnabled;
    updateAnimationState(isAnimationEnabled);

    animationToggle.addEventListener('change', function() {
        const isEnabled = this.checked;
        localStorage.setItem('starAnimation', isEnabled);
        updateAnimationState(isEnabled);
    });

    function updateAnimationState(isEnabled) {
        if (isEnabled) {
            canvas.style.display = 'block';
            // Перезапускаем анимацию, если она была остановлена
            if (window.initStarfield) {
                window.initStarfield();
            }
        } else {
            canvas.style.display = 'none';
        }

        // Обновляем текст
        document.querySelector('.toggle-label').textContent = 
            isEnabled ? translations[currentLang].toggleOn : translations[currentLang].toggleOff;
    }

    // Инициализация текстов при загрузке
    updatePageTexts(currentLang);
});
