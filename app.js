document.addEventListener('DOMContentLoaded', function() {
    // Инициализация Telegram WebApp
    const tg = window.Telegram.WebApp;
    tg.expand(); // Развернуть приложение на весь экран

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
            'about': document.querySelector('.about-container')
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
        if (section === 'about') {
            navigation.style.display = 'none';
        } else {
            navigation.style.display = 'flex';
        }

        // Обновляем активные элементы в навигации
        document.querySelectorAll('.nav-item').forEach(nav => {
            nav.classList.remove('active');
        });
        if (section !== 'about') {
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

    // Обработчик клика по пункту меню "О приложении"
    document.querySelector('.menu-item[data-screen="about"]')?.addEventListener('click', function() {
        switchScreen('about');
    });

    // Обработчик клика по кнопке "Назад"
    document.querySelector('.back-button')?.addEventListener('click', function() {
        switchScreen('menu');
    });

    // Показываем профиль по умолчанию
    switchScreen('profile');
});
