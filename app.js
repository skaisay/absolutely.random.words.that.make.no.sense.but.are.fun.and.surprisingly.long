document.addEventListener('DOMContentLoaded', function() {
    // Инициализация Telegram WebApp
    const tg = window.Telegram.WebApp;
    tg.expand(); // Развернуть приложение на весь экран

    // Предотвращаем закрытие приложения свайпами
    document.body.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, { passive: false });

    document.body.addEventListener('touchstart', function(e) {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });

    // Предотвращаем zoom
    document.addEventListener('gesturestart', function(e) {
        e.preventDefault();
    });

    // Получение данных пользователя
    const user = tg.initDataUnsafe.user;
    if (user) {
        // Установка данных пользователя
        document.getElementById('userName').textContent = user.first_name + 
            (user.last_name ? ' ' + user.last_name : '');
        document.getElementById('userId').textContent = user.id;
        document.getElementById('userLanguage').textContent = user.language_code || 'не указан';

        // Установка аватара пользователя
        if (user.photo_url) {
            document.getElementById('userAvatar').src = user.photo_url;
        } else {
            // Если аватар отсутствует, используем плейсхолдер
            document.getElementById('userAvatar').src = 'https://via.placeholder.com/100';
        }
    }

    // Функция для переключения между экранами
    function switchScreen(section) {
        const screens = {
            'profile': document.querySelector('.profile-container'),
            'settings': document.querySelector('.settings-container'),
            'menu': document.querySelector('.menu-container'),
            'about': document.querySelector('.about-container'),
            'verification': document.querySelector('.verification-container')
        };

        // Скрываем все экраны
        Object.values(screens).forEach(screen => {
            if (screen) screen.style.display = 'none';
        });

        // Показываем нужный экран
        if (screens[section]) {
            screens[section].style.display = 'block';
        }

        // Управляем видимостью навигации
        const navigation = document.querySelector('.navigation');
        if (section === 'about' || section === 'verification') {
            navigation.style.display = 'none';
        } else {
            navigation.style.display = 'flex';
        }

        // Обновляем активные элементы в навигации
        document.querySelectorAll('.nav-item').forEach(nav => {
            nav.classList.remove('active');
        });
        if (section !== 'about' && section !== 'verification') {
            document.querySelector(`.nav-item[data-section="${section}"]`).classList.add('active');
        }
    }

    // Обработчики кликов по навигации
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            switchScreen(section);
        });
    });

    // Обработчик клика по пунктам меню
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function() {
            const screen = this.getAttribute('data-screen');
            switchScreen(screen);
        });
    });

    // Обработчик клика по кнопкам "Назад"
    document.querySelectorAll('.back-button').forEach(button => {
        button.addEventListener('click', function() {
            switchScreen('menu');
        });
    });

    // Обработка верификации
    const verificationCode = document.getElementById('verificationCode');
    const submitCode = document.getElementById('submitCode');

    if (submitCode) {
        submitCode.addEventListener('click', function() {
            const code = verificationCode.value.trim();
            if (code.length === 16) {
                if (isValidVerificationCode(code)) {
                    tg.showPopup({
                        title: 'Успешная верификация',
                        message: 'Поздравляем! Код верификации подтвержден.',
                        buttons: [{
                            type: 'ok'
                        }]
                    });
                    switchScreen('menu');
                } else {
                    tg.showPopup({
                        title: 'Ошибка верификации',
                        message: 'Введенный код не найден в базе. Пожалуйста, проверьте код и попробуйте снова.',
                        buttons: [{
                            type: 'ok'
                        }]
                    });
                }
            } else {
                tg.showPopup({
                    title: 'Ошибка ввода',
                    message: 'Пожалуйста, введите 16-значный код верификации',
                    buttons: [{
                        type: 'ok'
                    }]
                });
            }
        });
    }

    // Показываем профиль по умолчанию
    switchScreen('profile');
});
