// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initializeSnowEffect();
    initializeMuzzleFlashes();
    initializeTVStatic();
    initializeTrackMenu();
    initializeCustomPlayer();
    loadTrack(tracks[2]); // Загрузка третьего трека (Выше этого) по умолчанию
});

// Инициализация кастомного плеера
function initializeCustomPlayer() {
    const audioPlayer = document.getElementById('track-player');
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const volumeBar = document.getElementById('volume-bar');
    const trackTitle = document.getElementById('track-title');
    
    // Обработчики кнопок
    playBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', playPrevTrack);
    nextBtn.addEventListener('click', playNextTrack);
    
    // Обработчики прогресса
    progressBar.addEventListener('input', handleProgressBar);
    progressBar.addEventListener('change', skipToTime);
    
    // Обработчик громкости
    volumeBar.addEventListener('input', setVolume);
    
    // Обработчики аудио событий
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('loadedmetadata', updateDuration);
    
    // Добавляем обработчик для начала перемотки
    let isSeeking = false;
    
    progressBar.addEventListener('mousedown', function() {
        isSeeking = true;
    });
    
    progressBar.addEventListener('mouseup', function() {
        isSeeking = false;
    });
    
    progressBar.addEventListener('input', function() {
        if (audioPlayer.duration && !isNaN(audioPlayer.duration)) {
            audioPlayer.currentTime = this.value;
        }
    });
    
    audioPlayer.addEventListener('ended', function() {
        // Убедимся, что трек полностью закончился
        audioPlayer.currentTime = 0;
        resetProgressBar();
        playNextTrack();
    });
    audioPlayer.addEventListener('play', () => {
        playBtn.classList.add('playing');
    });
    audioPlayer.addEventListener('pause', () => {
        playBtn.classList.remove('playing');
    });
    
    // Функция переключения воспроизведения
    function togglePlay() {
        if (audioPlayer.paused) {
            audioPlayer.play();
        } else {
            audioPlayer.pause();
        }
    }
    
    // Функция обновления прогресса
    function updateProgress() {
        // Обновляем прогресс только если не идет перемотка
        if (!isSeeking && audioPlayer.duration && !isNaN(audioPlayer.duration)) {
            progressBar.value = audioPlayer.currentTime;
            
            // Обновляем время
            currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
        }
    }
    
    // Функция обновления общей длительности
    function updateDuration() {
        // Устанавливаем максимальное значение слайдера равным длительности трека
        if (!isNaN(audioPlayer.duration)) {
            durationEl.textContent = formatTime(audioPlayer.duration);
            progressBar.max = audioPlayer.duration;
            
            // Проверяем, что currentTime не превышает duration
            if (audioPlayer.currentTime > audioPlayer.duration && audioPlayer.duration > 0) {
                audioPlayer.currentTime = audioPlayer.duration;
            }
        }
    }
    
    // Функция форматирования времени
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    }
    
    // Функция обработки перетаскивания прогресса
    function handleProgressBar() {
        if (audioPlayer.duration && !isNaN(audioPlayer.duration)) {
            // this.value здесь - это значение в секундах (т.к. max=duration), а не процент
            audioPlayer.currentTime = this.value;
        }
    }
    
    // Функция перемотки
    function skipToTime() {
        if (audioPlayer.duration && !isNaN(audioPlayer.duration)) {
            // this.value здесь - это значение в секундах (т.к. max=duration), а не процент
            audioPlayer.currentTime = this.value;
        }
    }
    
    // Функция установки громкости
    function setVolume() {
        audioPlayer.volume = this.value;
    }
    
    // Функция воспроизведения следующего трека
    function playNextTrack() {
        // Порядок треков в меню: 1) выше этого (track3), 2) поющая могилка (track1), 3) недоверия раб (track2), 4) черный челик (track4)
        const menuOrder = ['track3', 'track1', 'track2', 'track4'];
        const currentTrackId = getCurrentTrackId();
        const currentIndex = menuOrder.indexOf(currentTrackId);
        
        if (currentIndex !== -1) {
            const nextIndex = (currentIndex + 1) % menuOrder.length;
            const nextTrackId = menuOrder[nextIndex];
            const nextTrack = tracks.find(track => track.id === nextTrackId);
            
            if (nextTrack) {
                loadTrack(nextTrack);
                setTimeout(() => audioPlayer.play(), 100);
            }
        }
    }
    
    // Функция воспроизведения предыдущего трека
    function playPrevTrack() {
        // Порядок треков в меню: 1) выше этого (track3), 2) поющая могилка (track1), 3) недоверия раб (track2), 4) черный челик (track4)
        const menuOrder = ['track3', 'track1', 'track2', 'track4'];
        const currentTrackId = getCurrentTrackId();
        const currentIndex = menuOrder.indexOf(currentTrackId);
        
        if (currentIndex !== -1) {
            const prevIndex = (currentIndex - 1 + menuOrder.length) % menuOrder.length;
            const prevTrackId = menuOrder[prevIndex];
            const prevTrack = tracks.find(track => track.id === prevTrackId);
            
            if (prevTrack) {
                loadTrack(prevTrack);
                setTimeout(() => audioPlayer.play(), 100);
            }
        }
    }
    
    // Функция получения текущего ID трека
    function getCurrentTrackId() {
        // Получаем полный путь и извлекаем ID трека из имени файла
        const src = audioPlayer.src;
        // Извлекаем имя файла из пути, поддерживая разные форматы URL
        const pathParts = src.split('/');
        const fileName = pathParts[pathParts.length - 1];
        // Извлекаем ID из имени файла, например, 'track1.mp3' -> 'track1'
        return fileName.replace('.mp3', '').split('?')[0]; // Убираем возможные параметры
    }
}

// Функция сброса прогресс-бара
function resetProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    const currentTimeEl = document.getElementById('current-time');
    
    if (progressBar) {
        progressBar.value = 0;
    }
    
    if (currentTimeEl) {
        currentTimeEl.textContent = '0:00';
    }
}

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

// Функция инициализации эффекта вспышек от стрельбы
function initializeMuzzleFlashes() {
    const muzzleFlashContainer = document.querySelector('.muzzle-flashes');
    
    // Создаем случайные вспышки от стрельбы
    setInterval(() => {
        // Создаем случайное количество вспышек (1-5) за один раз
        const flashCount = Math.floor(Math.random() * 5) + 1;
        
        for (let i = 0; i < flashCount; i++) {
            // Случайная позиция
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            
            // Создаем элемент вспышки
            const flash = document.createElement('div');
            flash.classList.add('muzzle-flash');
            flash.style.left = `${posX}%`;
            flash.style.top = `${posY}%`;
            
            // Случайный размер вспышки
            const size = Math.random() * 3 + 2;
            flash.style.width = `${size}px`;
            flash.style.height = `${size}px`;
            
            // Добавляем вспышку
            muzzleFlashContainer.appendChild(flash);
            
            // Удаляем вспышку после окончания анимации
            setTimeout(() => {
                if (flash.parentNode) {
                    flash.parentNode.removeChild(flash);
                }
            }, 100);
        }
    }, 200); // Создаем вспышки каждые 200мс
}

// Функция инициализации эффекта телевизионного белого шума
function initializeTVStatic() {
    const staticContainer = document.getElementById('tv-static');
    
    // Создаем canvas для генерации шума
    const canvas = document.createElement('canvas');
    const tam = 400; // Размер canvas
    canvas.width = tam;
    canvas.height = tam;
    
    const ctx = canvas.getContext('2d');
    
    // Функция для генерации шума
    function generateStatic() {
        // Очищаем canvas
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, tam, tam);
        
        // Рисуем случайные пиксели
        for (let y = 0; y < tam; y += 1) {
            for (let x = 0; x < tam; x += 1) {
                // Случайно выбираем цвет пикселя (черный или белый с низкой прозрачностью)
                const alpha = Math.random() < 0.3 ? 0.15 : 0.05; // Меньше шансов на темные пиксели
                ctx.fillStyle = `rgba(${Math.random() < 0.5 ? 0 : 255}, ${Math.random() < 0.5 ? 0 : 255}, ${Math.random() < 0.5 ? 0 : 255}, ${alpha})`;
                ctx.fillRect(x, y, 1, 1);
            }
        }
        
        // Устанавливаем canvas как фон контейнера
        staticContainer.style.backgroundImage = `url(${canvas.toDataURL()})`;
        staticContainer.style.backgroundRepeat = 'repeat';
        
        // Смещаем фон для создания эффекта движения
        staticContainer.style.backgroundPosition = `${Math.floor(Math.random() * tam)}px ${Math.floor(Math.random() * tam)}px`;
    }
    
    // Генерируем шум с интервалом
    generateStatic();
    setInterval(generateStatic, 50); // Обновляем каждые 50мс
}

// Функция инициализации меню треков
function initializeTrackMenu() {
    const trackList = document.getElementById('track-list');
    
    // Сначала добавляем третий трек ("Выше этого") как первый в меню
    const firstTrack = tracks[2];
    const firstLi = document.createElement('li');
    firstLi.textContent = firstTrack.title;
    firstLi.setAttribute('data-text', firstTrack.title);
    firstLi.dataset.trackId = firstTrack.id;
    firstLi.addEventListener('click', () => loadTrack(firstTrack));
    trackList.appendChild(firstLi);
    
    // Затем добавляем остальные треки
    tracks.forEach((track, index) => {
        if (index !== 2) { // Пропускаем третий трек, так как он уже добавлен первым
            const li = document.createElement('li');
            li.textContent = track.title;
            li.setAttribute('data-text', track.title);
            li.dataset.trackId = track.id;
            li.addEventListener('click', () => loadTrack(track));
            trackList.appendChild(li);
        }
    });
}

// Функция загрузки трека
function loadTrack(track) {
    // Обновляем плеер
    const audioPlayer = document.getElementById('track-player');
    audioPlayer.src = track.audioSrc;
    audioPlayer.load();
    
    // Сбрасываем позицию аудио до 0
    audioPlayer.currentTime = 0;
    
    // Обновляем изображение
    const trackImg = document.getElementById('track-img');
    trackImg.src = track.imageSrc;
    trackImg.alt = track.title;
    
    // Обновляем название трека
    const trackTitle = document.getElementById('track-title');
    trackTitle.textContent = track.title;
    
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
    
    // Сбрасываем прогресс-бар
    setTimeout(() => {
        resetProgressBar();
    }, 100);
    
    // Сбрасываем состояние кнопки воспроизведения к "воспроизвести" (не "пауза")
    const playBtn = document.getElementById('play-btn');
    playBtn.classList.remove('playing');
}