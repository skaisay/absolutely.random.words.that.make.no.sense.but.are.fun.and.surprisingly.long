// Конфигурация звёздного поля
const starfieldConfig = {
    stars: 800,           // Количество звёзд
    speedBase: 0.15,      // Базовая скорость движения (было 0.3)
    speedRange: 0.2,      // Диапазон вариации скорости (было 0.5)
    fadeDistance: 0.75,   // Расстояние, на котором звёзды начинают исчезать
    maxSize: 2,          // Максимальный размер звезды
};

// Класс для управления отдельной звездой
class Star {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset();
    }

    // Сброс позиции звезды
    reset() {
        this.x = (Math.random() - 0.5) * 2;
        this.y = (Math.random() - 0.5) * 2;
        this.z = Math.random();
        this.speed = starfieldConfig.speedBase + Math.random() * starfieldConfig.speedRange;
    }

    // Обновление позиции звезды
    update() {
        this.z -= this.speed * 0.01;
        
        // Если звезда вышла за пределы видимости, сбрасываем её позицию
        if (this.z <= 0) {
            this.reset();
        }
    }

    // Отрисовка звезды
    draw(ctx) {
        // Вычисление проекции
        const projectedX = (this.x / this.z) * this.canvas.width / 2 + this.canvas.width / 2;
        const projectedY = (this.y / this.z) * this.canvas.height / 2 + this.canvas.height / 2;
        
        // Вычисление размера и прозрачности
        const size = (1 - this.z) * starfieldConfig.maxSize;
        const alpha = Math.min(1, (1 - this.z) / starfieldConfig.fadeDistance);
        
        // Отрисовка
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(projectedX, projectedY, size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Инициализация starfield
function initStarfield() {
    const canvas = document.getElementById('starfield');
    const ctx = canvas.getContext('2d');

    // Установка размеров canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    // Обработчик изменения размера окна
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Создание звёзд
    const stars = Array(starfieldConfig.stars)
        .fill(null)
        .map(() => new Star(canvas));

    // Функция анимации
    function animate() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        stars.forEach(star => {
            star.update();
            star.draw(ctx);
        });

        requestAnimationFrame(animate);
    }

    // Запуск анимации
    animate();
}

// Запуск после загрузки страницы
document.addEventListener('DOMContentLoaded', initStarfield);
