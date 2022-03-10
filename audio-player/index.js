import songs from './songs.js';

const audio = document.querySelector('audio');
const controlBtn = document.querySelector('.control-button');
const cover = document.querySelector('.cover');
let isPlay = false;
const DEFAULT_VOLUME = .75;

const timeline = document.querySelector('.timeline');

const volumeSlider = document.querySelector('.volume-slider');
const volumeBtn = document.querySelector('.volume');

const nextBtn = document.querySelector('.next');
const PreviousBtn = document.querySelector('.previous');

// play-pause functionality
function playAudio() {
  audio.play();
  isPlay = true;
  controlBtn.src='./assets/svg/pause.svg';
  cover.classList.add('active');
}

function pauseAudio() {
  audio.pause();
  isPlay = false;
  controlBtn.src='./assets/svg/play.svg';
  cover.classList.remove('active');
}

controlBtn.addEventListener('click', () => {
    if (!isPlay) {
        playAudio();
    } else {
        pauseAudio();
    }
});    

// audio duration

audio.addEventListener('loadeddata', () => {
    audio.currentTime = 0; //moved from playAudio()
    document.querySelector('.length').textContent = getTimeCodeFromNum(audio.duration);
    audio.volume = newVolume;
});

function getTimeCodeFromNum(num) {
    let seconds = parseInt(num);
    let minutes = parseInt(seconds / 60);
    seconds -= minutes * 60;
    const hours = parseInt(minutes / 60);
    minutes -= hours * 60;
  
    if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
    return `${String(hours).padStart(2, 0)}:${minutes}:${String(
      seconds % 60
    ).padStart(2, 0)}`;
}

// click on timeline to change time code 

timeline.addEventListener('click', e => {
  const timelineWidth = window.getComputedStyle(timeline).width;
  const timeToSeek = e.offsetX / parseInt(timelineWidth) * audio.duration;
  audio.currentTime = timeToSeek;
}, false);

// progress bar

setInterval(() => {
    const progressBar = document.querySelector(".progress");
    progressBar.style.width = audio.currentTime / audio.duration * 100 + "%";
    document.querySelector(".current").textContent = getTimeCodeFromNum(
      audio.currentTime
    );
  }, 500);

// volume control

let newVolume = DEFAULT_VOLUME;

volumeSlider.addEventListener('click', e => {
  const sliderWidth = window.getComputedStyle(volumeSlider).width;
  newVolume = e.offsetX / parseInt(sliderWidth);
  audio.volume = newVolume;
  document.querySelector('.volume-percentage').style.width = newVolume * 100 + '%';
}, false)

volumeBtn.addEventListener('click', () => {
    if (audio.volume != 0) {
        audio.volume = 0;
        document.querySelector('.volume-percentage').style.width = 0 + '%';
    } else {
        audio.volume = newVolume;
        document.querySelector('.volume-percentage').style.width = newVolume * 100 + '%';
    }
})

// songs change

let songCounter = 0;

function changeSong(num) {
    audio.src = './assets/audio/' + songs[`${num}`]['audio-src'] + '.mp3';
    document.body.style.backgroundImage = 'url(./assets/img/' + songs[`${num}`]['image-src'] + `)`;
    cover.style.backgroundImage = 'url(./assets/img/' + songs[`${num}`]['image-src'] + `)`;
    document.querySelector('.author-name').textContent = `${songs[`${num}`]['song-author']}`;
    document.querySelector('.song-name').textContent = `${songs[`${num}`]['song-name']}`;
    playAudio();
};

nextBtn.addEventListener('click', () => {
    const finalSong = Object.keys(songs)[Object.keys(songs).length - 1];
    if (songCounter === parseInt(finalSong)) {
        songCounter = 0;
    } else {
        songCounter++;
    }
    changeSong(songCounter);
});

PreviousBtn.addEventListener('click', () => {
    const finalSong = Object.keys(songs)[Object.keys(songs).length - 1];
    if (songCounter === 0) {
        songCounter = parseInt(finalSong);
    } else {
        songCounter--;
    }
    changeSong(songCounter);
});
