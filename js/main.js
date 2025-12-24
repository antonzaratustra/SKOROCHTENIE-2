// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initializeSnowEffect();
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
    audioPlayer.addEventListener('ended', playNextTrack);
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
        const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.value = percent;
        
        // Обновляем время
        currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
    }
    
    // Функция обновления общей длительности
    function updateDuration() {
        durationEl.textContent = formatTime(audioPlayer.duration);
        progressBar.max = audioPlayer.duration || 100;
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
        const percent = this.value;
        audioPlayer.currentTime = (percent / 100) * audioPlayer.duration;
    }
    
    // Функция перемотки
    function skipToTime() {
        const percent = this.value;
        audioPlayer.currentTime = (percent / 100) * audioPlayer.duration;
    }
    
    // Функция установки громкости
    function setVolume() {
        audioPlayer.volume = this.value;
    }
    
    // Функция воспроизведения следующего трека
    function playNextTrack() {
        const currentTrackId = getCurrentTrackId();
        const currentTrackIndex = tracks.findIndex(track => track.id === currentTrackId);
        const nextIndex = (currentTrackIndex + 1) % tracks.length;
        loadTrack(tracks[nextIndex]);
        setTimeout(() => audioPlayer.play(), 100); // Небольшая задержка для надежности
    }
    
    // Функция воспроизведения предыдущего трека
    function playPrevTrack() {
        const currentTrackId = getCurrentTrackId();
        const currentTrackIndex = tracks.findIndex(track => track.id === currentTrackId);
        const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
        loadTrack(tracks[prevIndex]);
        setTimeout(() => audioPlayer.play(), 100); // Небольшая задержка для надежности
    }
    
    // Функция получения текущего ID трека
    function getCurrentTrackId() {
        return audioPlayer.src.split('/').pop().split('.')[0];
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
}