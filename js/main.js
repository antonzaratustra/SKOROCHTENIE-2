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
        // Порядок треков в меню: 1) выше этого (track3), 2) поющая могилка (track1), 3) недоверия раб (track2), 4) черный челик (track4), 5) Уточним (track5), 6) Budda on the grille (track6), 7) В серость туманов (track7)
        const menuOrder = ['track3', 'track1', 'track2', 'track4', 'track5', 'track6', 'track7'];
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
        // Порядок треков в меню: 1) выше этого (track3), 2) поющая могилка (track1), 3) недоверия раб (track2), 4) черный челик (track4), 5) Уточним (track5), 6) Budda on the grille (track6), 7) В серость туманов (track7)
        const menuOrder = ['track3', 'track1', 'track2', 'track4', 'track5', 'track6', 'track7'];
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

// Функция показа описания альбома
function showAlbumDescription() {
    // Создаем всплывающее окно
    const popup = document.createElement('div');
    popup.classList.add('album-description-popup');
    
    // Создаем содержимое всплывающего окна
    const content = `
# Описание альбома

Это мощный, пугающе целостный концептуальный альбом, который можно охарактеризовать как «Хроники распада личности в эпоху катастроф».
Это не просто сборник треков, а линейный психологический триллер или аудио-роуд-муви. Сюжет альбома описывает одну поездку, которая происходит как в физическом пространстве (гонка по трассе), так и в ментальном (стремительная деградация рассудка). Герой пытается «прочитать» хаос современности на огромной скорости, что приводит к перегрузке систем и гибели.
Ниже представлен детальный анализ концепции, сюжетной арки и скрытых связей, объединяющий все смысловые слои.

## 1. Сюжетная арка: Траектория падения

Альбом выстроен по законам классической трагедии: от травмирующего события через попытку бегства и безумие к неизбежному финалу.

### Акт I: Вторжение реальности (Травма)

1. «Выше этого» (Точка отсчета).
Сюжет: Внешний мир (война, технологии) вторгается в частную жизнь. Герой — «плененный партизан», запертый в квартире, пока за окном летают дроны («беспилы»).
Психология: Рождение ПТСР. Герой пытается диссоциировать («я выше этого», «я — дрон»), но ужас реальности («убить чужих детей») ломает его защиту. Запускается «Колесо» (истории и судьбы), которое будет катиться до самого конца альбома.

### Акт II: Реакция и Бегство (Диссоциация)

2. «Поющая могилка» (Начало движения).
Сюжет: Психика не выдерживает давления первого трека. Герой садится в машину и жмет на газ. Это попытка физически убежать от ужаса.
Ключевой момент: Смерть «внутреннего ребенка». Если в первом треке убивали «чужих детей», то здесь герой везет труп своего. Он сам становится «поющей могилкой» — мертвецом, который продолжает говорить.

3. «Недоверия раб» (Ожесточение).
Сюжет: Мир окончательно рухнул (постапокалипсис).
Психология: Чтобы выжить после смерти своей «детской» части, герой отращивает броню. Он убивает в себе эмпатию, становясь параноиком и «отцом», который учит жестокости. «Доверие требует времени», а времени нет, есть только скорость и выживание.

### Акт III: Расщепление (Шизофрения)

4. «Черный челик» (Встреча с Тенью).
Сюжет: Изоляция приводит к галлюцинациям. Герой встречает своего двойника (совесть/рефлексию).
Психология: В отличие от героя Есенина, этот персонаж агрессивно отрицает свою темную сторону («Я не ты»). Он подавляет внутренний голос, называя его «кринжем». Это фатальная ошибка: отвергнутая Тень позже захватит контроль.

5. «Уточним» (Срыв и Регрессия).
Сюжет: Оборона прорвана. Агрессия батл-рэпа сменяется депрессией и флешбэками.
Психология: Герой проваливается в детские травмы («мама уточка», «Деда Мороза нет»). Он понимает, что застрял в прошлом и будущего нет. Внутренний конфликт достигает пика: он мечется между ролью хищника («Ломаченко») и испуганного «утенка».

### Акт IV: Катарсис через Бред (Мегаломания)

6. «Budda on the grille» (Психотический эпизод).
Сюжет: Психика, не в силах справиться с болью предыдущего трека, выбирает манию величия.
Психология: Полный отрыв от реальности. Герой воображает себя неуязвимым злодеем, оперным певцом, Богом («Будда на гриле»). Связь с треком 4: Герой становится тем самым «вторичным злодеем», над которым смеялся ранее. Тень победила и теперь управляет телом, говоря на чужом, ломаном языке.

### Акт V: Финал (Столкновение)

7. «В серость туманов» (Возвращение в реальность).
Сюжет: Мания спадает. Гонка, начатая во втором треке, заканчивается закономерно — ударом об «асфальт времен».
Финал: Машина сносит поребрик. Герой погибает в автокатастрофе. Все цвета (оранжевый огонь, синяя гжель) исчезают в серости. Круг замыкается, мотор обесточен.

## 2. Сквозные мотивы и символы

Этот альбом пронизан системой лейтмотивов, которые связывают песни в единое полотно.

### А. Мотив «Мертвого Ребенка» (Деградация невинности)

Это самый сильный связующий элемент альбома.

- Трек 1: Дрон убивает чужих детей.
- Трек 2: Герой везет труп своего внутреннего ребенка.
- Трек 3: Герой выступает в роли жестокого Отца, поучающего инфантильного сына («Толкаешь речи, как ребенок»).
- Трек 5: Регрессия в детство (синдром «Утенка», травма с Дедом Морозом).
- Трек 7: Обращение к потомкам, которым достанется выжженная земля.

Вывод: Альбом — реквием по невинности. Война убивает в человеке ребенка, превращая его сначала в циника, а потом в безумца.

### Б. Мотив «Еды» (Гротескное потребление)

Еда в альбоме всегда связана с насилием, распадом или отвращением.

- Трек 1: Человек как «протухший пармезан».
- Трек 2: Творчество как акт дефекации («навалю кусками» в скибиди туалет).
- Трек 3: «Столовая ложка» как оружие, «яства» как оправдание убийства.
- Трек 6: Каннибальский пир во время чумы — «Butter my bread» на фоне пожаров, «Poisoned cupcakes».
- Трек 7: Мозг превращается в еду при ударе — «Мыслей омлет... в котлету».

Вывод: Мир пытается сожрать героя, герой пытается «съесть» этот мир, но давится им.

### В. Мотив «Колеса и Скорости»

Герой постоянно движется, но это движение к смерти.

- Начало (Т1): «Катится колесо» (Запуск механизма судьбы).
- Развитие (Т2): Скорость 200 км/ч.
- Кульминация (Т6): «Trains collided» (Столкновение поездов).
- Конец (Т7): «Съевшим камней килограмм колесом». Колесо раздавило героя, как и было предсказано в первой строчке.

### Г. Цветовая кодировка

- Оранжевый: Главный цвет безумия и опасности. В «Поющей могилке» это «любимый цвет» (феникс, огонь). В «Budda on the grille» — «ring of forest fires».
- Серый: Цвет смерти и реальности. В финале («В серость туманов») огонь гаснет, остается только пепел и туман.

## 3. Неочевидные детали и скрытые связи

1. **Эволюция Языка = Эволюция Распада**

Одна из самых тонких деталей альбома — смена языкового кода:

- Начало (Т1-Т3): Современный русский язык, насыщенный сленгом и англицизмами (метамодерн, NPC, Space X). Это язык человека, еще связанного с социумом.
- Середина (Т5): Язык ломается, ритмика сбивается, появляются сложные, вязкие конструкции.
- Пик безумия (Т6): Переход на ломаный английский (Runglish). Герой теряет свою идентичность, культурный код и родную речь. Он становится «чужим».
- Финал (Т7): Возвращение к высокому, поэтичному русскому слогу («ризы», «веретено», «гжель»). Это момент предсмертного просветления, когда напускное (сленг, английский) слетает, и остается только вечное.

2. **Пророчество названия**

Название второго трека — «Поющая могилка» — описывает судьбу героя на весь альбом вперед. Начиная с этого момента, он уже мертв внутри, но продолжает «петь» (читать рэп) еще 5 треков, пока его тело не умирает физически в 7-м треке.

3. **Зеркальность поражения (Т4 vs Т6)**

В треке «Черный челик» герой высмеивает двойника, сравнивая его с «Fear Project Origin» (неудачный сиквел) и называя «поставщиком кринжа».

Но в треке «Budda on the grille» герой сам становится этим карикатурным злодеем («I'm shining like Tom Cruise»). Он превратился в то, что презирал. Тень поглотила его, сделав его жизнь «неудачным сиквелом» и «чистым кринжем».

## Итог

Этот альбом — пугающее исследование того, что происходит с человеческой душой, когда она сталкивается с невыносимым. Герой не проходит путь героя; он проходит путь распада. Он пытается сбежать от реальности в цинизм, в агрессию, в безумие, но реальность — в виде бетонной стены или «асфальта времен» — всё равно оказывается тверже.`;
    
    popup.innerHTML = `
        <div class="popup-content">
            <div class="popup-header">
                <h2>О чем этот альбом</h2>
                <button class="close-btn">×</button>
            </div>
            <div class="popup-body">
                <div class="markdown-content">${marked.parse(content)}</div>
            </div>
        </div>
    `;
    
    // Добавляем всплывающее окно к body
    document.body.appendChild(popup);
    
    // Добавляем обработчик закрытия
    popup.querySelector('.close-btn').addEventListener('click', function() {
        popup.remove();
    });
    
    // Закрытие при клике вне области контента
    popup.addEventListener('click', function(e) {
        if (e.target === popup) {
            popup.remove();
        }
    });
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
    
    // Добавляем спейсер для выравнивания элемента "о чем этот альбом" внизу
    const spacer = document.createElement('li');
    spacer.classList.add('menu-spacer');
    spacer.style.flex = '1';
    trackList.appendChild(spacer);
    
    // Добавляем разделитель перед элементом "о чем этот альбом" для визуального отделения
    const separator = document.createElement('div');
    separator.classList.add('menu-separator');
    separator.style.height = '10px';
    trackList.appendChild(separator);
    
    // Добавляем элемент "о чем этот альбом" в конец списка
    const aboutAlbumLi = document.createElement('li');
    aboutAlbumLi.textContent = 'о чем этот альбом';
    aboutAlbumLi.setAttribute('data-text', 'о чем этот альбом');
    aboutAlbumLi.classList.add('about-album-item');
    aboutAlbumLi.addEventListener('click', showAlbumDescription);
    trackList.appendChild(aboutAlbumLi);
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