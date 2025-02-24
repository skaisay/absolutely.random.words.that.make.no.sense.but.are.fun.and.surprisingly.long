import { articles } from './articles.js';

// Основные элементы DOM
const root = document.getElementById('root');

// Функция для рендеринга статей
function renderArticles() {
  const articlesHTML = articles.map(article => `
    <div class="card" style="margin-bottom: 1rem;">
      <img src="${article.image}" alt="${article.title}" style="width: 100%; height: 200px; object-fit: cover;">
      <div style="padding: 1rem;">
        <h3>${article.title}</h3>
        <p>${article.content}</p>
        <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
          <span class="badge">${article.category}</span>
        </div>
      </div>
    </div>
  `).join('');

  root.innerHTML = `
    <div style="padding: 1rem;">
      <h1 style="margin-bottom: 2rem;">Crypto News</h1>
      <div>${articlesHTML}</div>
    </div>
  `;
}

// Инициализация приложения
window.addEventListener('DOMContentLoaded', () => {
  // Инициализация Telegram Mini App
  window.Telegram?.WebApp?.ready();
  
  // Рендеринг контента
  renderArticles();
});
