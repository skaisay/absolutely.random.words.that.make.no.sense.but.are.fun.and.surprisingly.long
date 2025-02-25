// Конфигурация матричного эффекта
const matrixConfig = {
    fontSize: 18,          // Увеличили с 14 до 18
    chars: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    speed: 50,
    opacity: 1.0           // Увеличили с 0.8 до 1.0
};

// Класс для управления символом матрицы
class MatrixSymbol {
    constructor(x, y, canvas, speed) {
        this.x = x;
        this.y = y;
        this.canvas = canvas;
        this.speed = speed;
        this.value = '';
        this.switchInterval = Math.random() * 2000 + 500;
        this.lastSwitch = Date.now();
    }

    // Обновление символа
    update() {
        this.y += this.speed * 0.5; // Замедлили скорость падения
        if (this.y > this.canvas.height) {
            this.y = 0;
        }

        // Периодически меняем символ
        if (Date.now() - this.lastSwitch > this.switchInterval) {
            this.value = matrixConfig.chars[Math.floor(Math.random() * matrixConfig.chars.length)];
            this.lastSwitch = Date.now();
        }
    }

    // Отрисовка символа
    draw(ctx) {
        const alpha = (this.canvas.height - this.y) / this.canvas.height;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * matrixConfig.opacity})`;
        ctx.fillText(this.value, this.x, this.y);
    }
}

// Инициализация матричного эффекта
function initMatrix() {
    const canvas = document.getElementById('matrix');
    const ctx = canvas.getContext('2d');

    // Установка размеров canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.font = `${matrixConfig.fontSize}px monospace`;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Создание символов
    const columns = Math.floor(canvas.width / matrixConfig.fontSize);
    const symbols = [];

    for (let i = 0; i < columns; i++) {
        symbols.push(new MatrixSymbol(
            i * matrixConfig.fontSize,
            Math.random() * canvas.height,
            canvas,
            Math.random() * 1 + 0.5 // Уменьшили скорость падения
        ));
        symbols[i].value = matrixConfig.chars[Math.floor(Math.random() * matrixConfig.chars.length)];
    }

    // Функция анимации
    function animate() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        symbols.forEach(symbol => {
            symbol.update();
            symbol.draw(ctx);
        });

        requestAnimationFrame(animate);
    }

    // Запуск анимации
    animate();
}

// Запуск после загрузки страницы
document.addEventListener('DOMContentLoaded', initMatrix);
