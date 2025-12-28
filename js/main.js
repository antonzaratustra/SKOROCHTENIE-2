document.addEventListener('DOMContentLoaded', function() {
    initializeSnowEffect();
    initializeMuzzleFlashes();
    initializeTVStatic();
    initializeTrackMenu();
    initializeCustomPlayer();
    initializeMobileMenu();
    loadTrack(tracks[2]);
});

// МОБИЛЬНОЕ МЕНЮ
function initializeMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const closeBtn = document.getElementById('close-menu-btn');
    const menu = document.getElementById('track-menu');

    if (menuBtn && menu) {
        menuBtn.addEventListener('click', function() {
            menu.classList.add('menu-open');
        });
    }

    if (closeBtn) closeBtn.addEventListener('click', closeMenu);

    function closeMenu() {
        if (menu) menu.classList.remove('menu-open');
    }
}

// ПЛЕЕР-
function initializeCustomPlayer() {
    const audioPlayer = document.getElementById('track-player');
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const volumeBar = document.getElementById('volume-bar');
    
    playBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', playPrevTrack);
    nextBtn.addEventListener('click', playNextTrack);
    
    progressBar.addEventListener('input', function() {
        if (audioPlayer.duration) audioPlayer.currentTime = this.value;
    });
    
    let isSeeking = false;
    progressBar.addEventListener('mousedown', () => isSeeking = true);
    progressBar.addEventListener('touchstart', () => isSeeking = true, {passive: true});
    progressBar.addEventListener('mouseup', () => isSeeking = false);
    progressBar.addEventListener('touchend', () => isSeeking = false);
    
    volumeBar.addEventListener('input', function() { audioPlayer.volume = this.value; });
    
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('loadedmetadata', updateDuration);
    audioPlayer.addEventListener('ended', function() {
        audioPlayer.currentTime = 0;
        resetProgressBar();
        playNextTrack();
    });
    audioPlayer.addEventListener('play', () => playBtn.classList.add('playing'));
    audioPlayer.addEventListener('pause', () => playBtn.classList.remove('playing'));
    
    function togglePlay() {
        if (audioPlayer.paused) audioPlayer.play(); else audioPlayer.pause();
    }
    
    function updateProgress() {
        if (!isSeeking && audioPlayer.duration) {
            progressBar.value = audioPlayer.currentTime;
            currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
        }
    }
    
    function updateDuration() {
        if (audioPlayer.duration) {
            durationEl.textContent = formatTime(audioPlayer.duration);
            progressBar.max = audioPlayer.duration;
        }
    }
    
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    }
    
    function playNextTrack() {
        const menuOrder = ['track3', 'track1', 'track2', 'track4', 'track5', 'track6', 'track7'];
        const currentId = getCurrentTrackId();
        const idx = menuOrder.indexOf(currentId);
        if (idx !== -1) {
            const nextId = menuOrder[(idx + 1) % menuOrder.length];
            const nextTrack = tracks.find(t => t.id === nextId);
            if (nextTrack) { loadTrack(nextTrack); setTimeout(() => audioPlayer.play(), 100); }
        }
    }
    
    function playPrevTrack() {
        const menuOrder = ['track3', 'track1', 'track2', 'track4', 'track5', 'track6', 'track7'];
        const currentId = getCurrentTrackId();
        const idx = menuOrder.indexOf(currentId);
        if (idx !== -1) {
            const prevId = menuOrder[(idx - 1 + menuOrder.length) % menuOrder.length];
            const prevTrack = tracks.find(t => t.id === prevId);
            if (prevTrack) { loadTrack(prevTrack); setTimeout(() => audioPlayer.play(), 100); }
        }
    }
    
    function getCurrentTrackId() {
        const src = audioPlayer.src;
        const parts = src.split('/');
        return parts[parts.length - 1].replace('.mp3', '').split('?')[0];
    }
}

function resetProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    const currentTimeEl = document.getElementById('current-time');
    if (progressBar) progressBar.value = 0;
    if (currentTimeEl) currentTimeEl.textContent = '0:00';
}

// ОПИСАНИЕ АЛЬБОМА (ПОЛНЫЙ ТЕКСТ)
function showAlbumDescription() {
    const menu = document.getElementById('track-menu');
    if (menu) menu.classList.remove('menu-open');

    const popup = document.createElement('div');
    popup.classList.add('album-description-popup');
    
    // ПОЛНЫЙ ТЕКСТ ВОЗВРАЩЕН
    const content = `
# Описание альбома

Это мощный, пугающе целостный концептуальный альбом, который можно охарактеризовать как «Хроники распада личности в эпоху катастроф».
Это не просто сборник треков, а линейный психологический триллер или аудио-роад-муви. Сюжет альбома описывает одну поездку, которая происходит как в физическом пространстве (гонка по трассе), так и в ментальном (стремительная деградация рассудка). Герой пытается «прочитать» хаос современности на огромной скорости, что приводит к перегрузке систем и гибели.
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
Психология: Герой проваливается в детские травмы («мама уточка», «Деда Мороза нет»). Он понимает, что застрял в прошлом и будущего нет. Внутренний конфликт достигает пика: он мечется между ролью хищника и испуганного «утенка».

### Акт IV: Катарсис через Бред (Мегаломания)

6. «Budda on the grille» (Психотический эпизод).
Сюжет: Психика, не в силах справиться с болью предыдущего трека, выбирает манию величия.
Психология: Полный отрыв от реальности. Герой воображает себя неуязвимым злодеем, оперным певцом, Богом («Будда на гриле»). Связь с треком 4: Герой становится тем самым «вторичным злодеем», над которым смеялся ранее. Тень победила и теперь управляет телом, говоря на чужом, ломаном языке.

### Акт V: Финал (Столкновение)

7. «В серость туманов» (Возвращение в реальность).
Сюжет: Мания спадает. Гонка, начатая во втором треке, заканчивается закономерно — ударом об «асфальт времен».
Финал: Машина сносит поребрик. Герой погибает в автокатастрофе. Все цвета (оранжевый огонь, синяя гжель) исчезают в серости. Круг zamыкается, мотор обесточен.

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

    document.body.appendChild(popup);
    popup.querySelector('.close-btn').addEventListener('click', () => popup.remove());
    popup.addEventListener('click', (e) => { if (e.target === popup) popup.remove(); });
}

// ЭФФЕКТЫ (ВЕРНУЛ ЛОГИКУ)
function initializeSnowEffect() {
    const snowContainer = document.querySelector('.snowflakes');
    for (let i = 0; i < 50; i++) {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
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

function initializeMuzzleFlashes() {
    const muzzleFlashContainer = document.querySelector('.muzzle-flashes');
    setInterval(() => {
        const flashCount = Math.floor(Math.random() * 5) + 1;
        for (let i = 0; i < flashCount; i++) {
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const flash = document.createElement('div');
            flash.classList.add('muzzle-flash');
            flash.style.left = `${posX}%`;
            flash.style.top = `${posY}%`;
            const size = Math.random() * 3 + 2;
            flash.style.width = `${size}px`;
            flash.style.height = `${size}px`;
            muzzleFlashContainer.appendChild(flash);
            setTimeout(() => { if (flash.parentNode) flash.parentNode.removeChild(flash); }, 100);
        }
    }, 200);
}

function initializeTVStatic() {
    // Create a more performant version using CSS animations
    const staticContainer = document.getElementById('tv-static');
    
    // Use CSS animation instead of canvas for better performance
    staticContainer.style.position = 'fixed';
    staticContainer.style.top = '0';
    staticContainer.style.left = '0';
    staticContainer.style.width = '100%';
    staticContainer.style.height = '100%';
    staticContainer.style.pointerEvents = 'none';
    staticContainer.style.zIndex = '1000';
    staticContainer.style.opacity = '0.15';
    
    // Create a more visually appealing static effect using CSS
    staticContainer.style.background = 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.1) 100%)';
    staticContainer.style.animation = 'tvStaticNoise 0.05s infinite'; // Faster animation for more dynamic effect
    staticContainer.style.opacity = '0.25'; // Increase opacity
    
    // Add the CSS for the animation if it doesn't exist
    const style = document.createElement('style');
    style.textContent = `@keyframes tvStaticNoise {\n` +
        `    0%, 100% { \n` +
        `        background: \n` +
        `            radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.1) 100%),\n` +
        `            linear-gradient(rgba(255,255,255,0.15) 0 0) 0 0 / 2px 2px;\n` +
        `        opacity: 0.25;\n` +
        `    }\n` +
        `    25% { \n` +
        `        background: \n` +
        `            radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.12) 100%),\n` +
        `            linear-gradient(rgba(255,255,255,0.12) 0 0) 1px 1px / 3px 3px;\n` +
        `        opacity: 0.22;\n` +
        `    }\n` +
        `    50% { \n` +
        `        background: \n` +
        `            radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.08) 100%),\n` +
        `            linear-gradient(rgba(255,255,255,0.18) 0 0) 2px 2px / 4px 4px;\n` +
        `        opacity: 0.30;\n` +
        `    }\n` +
        `    75% { \n` +
        `        background: \n` +
        `            radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(0,0,0,0.1) 100%),\n` +
        `            linear-gradient(rgba(255,255,255,0.1) 0 0) 0 0 / 5px 5px;\n` +
        `        opacity: 0.27;\n` +
        `    }\n` +
        `}`;
    document.head.appendChild(style);
}

function initializeTrackMenu() {
    const trackList = document.getElementById('track-list');
    const firstTrack = tracks[2];
    const firstLi = document.createElement('li');
    firstLi.textContent = firstTrack.title;
    firstLi.setAttribute('data-text', firstTrack.title);
    firstLi.dataset.trackId = firstTrack.id;
    firstLi.addEventListener('click', () => loadTrack(firstTrack));
    trackList.appendChild(firstLi);
    
    tracks.forEach((track, index) => {
        if (index !== 2) {
            const li = document.createElement('li');
            li.textContent = track.title;
            li.setAttribute('data-text', track.title);
            li.dataset.trackId = track.id;
            li.addEventListener('click', () => loadTrack(track));
            trackList.appendChild(li);
        }
    });
    
    // Добавляем элемент "о чем этот альбом" в конец списка треков
    const aboutAlbumLi = document.createElement('li');
    aboutAlbumLi.textContent = 'о чем этот альбом';
    aboutAlbumLi.setAttribute('data-text', 'о чем этот альбом');
    aboutAlbumLi.classList.add('about-album-item');
    aboutAlbumLi.addEventListener('click', showAlbumDescription);
    trackList.appendChild(aboutAlbumLi);
}

function loadTrack(track) {
    const audioPlayer = document.getElementById('track-player');
    audioPlayer.src = track.audioSrc;
    audioPlayer.load();
    audioPlayer.currentTime = 0;
    
    document.getElementById('track-img').src = track.imageSrc;
    document.getElementById('track-title').textContent = track.title;
    document.getElementById('song-lyrics').innerHTML = marked.parse(track.lyrics);
    document.getElementById('song-decoding').innerHTML = marked.parse(track.decoding);
    
    document.querySelectorAll('.track-menu li').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.trackId === track.id) {
            item.classList.add('active');
        }
    });
    
    const menu = document.getElementById('track-menu');
    if (window.innerWidth <= 768 && menu) {
        menu.classList.remove('menu-open');
    }
    
    setTimeout(() => { resetProgressBar(); }, 100);
    document.getElementById('play-btn').classList.remove('playing');
}