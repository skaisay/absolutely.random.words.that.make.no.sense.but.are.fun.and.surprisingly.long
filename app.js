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

    // Обработчики кликов по навигации
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            // Здесь можно добавить логику навигации
            console.log(`Переход в раздел: ${section}`);
            
            // Добавляем эффект нажатия
            this.style.opacity = '0.7';
            setTimeout(() => {
                this.style.opacity = '1';
            }, 200);
        });
    });

    // Применяем цветовую схему Telegram
    document.documentElement.style.setProperty('--tg-theme-bg-color', tg.backgroundColor);
    document.documentElement.style.setProperty('--tg-theme-text-color', tg.textColor);
    document.documentElement.style.setProperty('--tg-theme-hint-color', tg.hint_color);
    document.documentElement.style.setProperty('--tg-theme-link-color', tg.link_color);
    document.documentElement.style.setProperty('--tg-theme-button-color', tg.button_color);
    document.documentElement.style.setProperty('--tg-theme-button-text-color', tg.button_text_color);
});
