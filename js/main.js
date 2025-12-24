// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initializeSnowEffect();
    initializeTrackMenu();
    loadTrack(tracks[0]); // Загрузка первого трека по умолчанию
});

// Функция инициализации эффекта снега
function initializeSnowEffect() {
    const snowContainer = document.querySelector('.snowflakes');
    
    // Создаем 50 снежинок
    for (let i = 0; i < 50; i++) {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        
        // Случайные размеры и позиции
        const size = Math.random() * 5 + 2;
        const posX = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = Math.random() * 10 + 5;
        
        snowflake.style.width = `${size}px`;
        snowflake.style.height = `${size}px`;
        snowflake.style.left = `${posX}%`;
        snowflake.style.animationDelay = `${delay}s`;
        snowflake.style.animationDuration = `${duration}s`;
        
        snowContainer.appendChild(snowflake);
    }
}

// Функция инициализации меню треков
function initializeTrackMenu() {
    const trackList = document.getElementById('track-list');
    
    tracks.forEach((track, index) => {
        const li = document.createElement('li');
        li.textContent = track.title;
        li.setAttribute('data-text', track.title);
        li.dataset.trackId = track.id;
        li.addEventListener('click', () => loadTrack(track));
        trackList.appendChild(li);
    });
}

// Функция загрузки трека
function loadTrack(track) {
    // Обновляем плеер
    const audioPlayer = document.getElementById('track-player');
    audioPlayer.src = track.audioSrc;
    audioPlayer.load();
    
    // Обновляем изображение
    const trackImg = document.getElementById('track-img');
    trackImg.src = track.imageSrc;
    trackImg.alt = track.title;
    
    // Обновляем тексты с поддержкой Markdown
    const lyricsElement = document.getElementById('song-lyrics');
    lyricsElement.innerHTML = marked.parse(track.lyrics);
    
    // Обновляем декодинг с поддержкой Markdown
    const decodingElement = document.getElementById('song-decoding');
    decodingElement.innerHTML = marked.parse(track.decoding);
    
    // Обновляем активный элемент в меню
    document.querySelectorAll('.track-menu li').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.trackId === track.id) {
            item.classList.add('active');
        }
    });
}