class MusicPlayer {
    constructor() {
        this.audio = new Audio();
        this.isPlaying = false;
        this.songs = [
            {
                title: "Song 1",
                artist: "Artist 1",
                path: "songs/song1.mp3",
                image: "images/song1.jpg",
                relatedSongs: [1, 3, 5]
            },
            {
                title: "Song 2",
                artist: "Artist 2",
                path: "songs/song2.mp3",
                image: "images/song2.jpg",
                relatedSongs: [0, 2, 4]
            },
            {
                title: "Song 3",
                artist: "Artist 3",
                path: "songs/song3.mp3",
                image: "images/song3.jpg",
                relatedSongs: [1, 4, 0]
            },
            {
                title: "Song 4",
                artist: "Artist 4",
                path: "songs/song4.mp3",
                image: "images/song4.jpg",
                relatedSongs: [2, 0, 3]
            },
            {
                title: "Song 5",
                artist: "Artist 5",
                path: "songs/song5.mp3",
                image: "images/song5.jpg",
                relatedSongs: [3, 1, 0]
            }
        ];
        this.currentSongIndex = 0;
        this.relatedSongsList = document.getElementById('related-songs-list');

        this.initializeElements();
        this.setupEventListeners();
        this.loadSong();
        this.updateRelatedSongs();
    }

    initializeElements() {
        this.playBtn = document.getElementById('play-btn');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.muteBtn = document.getElementById('mute-btn');
        this.volumeSlider = document.getElementById('volume-slider');
        this.progress = document.getElementById('progress');
        this.progressContainer = document.querySelector('.progress-container');
        this.currentTime = document.getElementById('current-time');
        this.duration = document.getElementById('duration');
        this.songTitle = document.getElementById('song-title');
        this.songArtist = document.getElementById('song-artist');
        this.songImage = document.getElementById('song-image');
    }

    setupEventListeners() {
        this.playBtn.addEventListener('click', () => this.togglePlay());
        this.prevBtn.addEventListener('click', () => this.previousSong());
        this.nextBtn.addEventListener('click', () => this.nextSong());
        this.muteBtn.addEventListener('click', () => this.toggleMute());
        this.volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));
        this.progressContainer.addEventListener('click', (e) => this.setProgress(e));
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.nextSong());
        
        // Add event listener for related songs
        this.relatedSongsList.addEventListener('click', (e) => {
            if (e.target.closest('.song-item')) {
                const index = e.target.closest('.song-item').dataset.index;
                this.currentSongIndex = parseInt(index);
                this.loadSong();
                this.playSong();
            }
        });
    }

    loadSong() {
        const song = this.songs[this.currentSongIndex];
        this.audio.src = song.path;
        this.songTitle.textContent = song.title;
        this.songArtist.textContent = song.artist;
        this.songImage.src = song.image;
        this.audio.load();
        this.updateRelatedSongs();
    }

    togglePlay() {
        if (this.isPlaying) {
            this.audio.pause();
            this.playBtn.textContent = '▶';
        } else {
            this.audio.play();
            this.playBtn.textContent = '⏸';
        }
        this.isPlaying = !this.isPlaying;
    }

    previousSong() {
        this.currentSongIndex = (this.currentSongIndex - 1 + this.songs.length) % this.songs.length;
        this.loadSong();
        this.playSong();
    }

    nextSong() {
        this.currentSongIndex = (this.currentSongIndex + 1) % this.songs.length;
        this.loadSong();
        this.playSong();
    }

    playSong() {
        this.audio.play();
        this.isPlaying = true;
        this.playBtn.textContent = '⏸';
    }

    toggleMute() {
        this.audio.muted = !this.audio.muted;
        this.muteBtn.textContent = this.audio.muted ? '🔇' : '🔊';
    }

    setVolume(value) {
        this.audio.volume = value / 100;
    }

    setProgress(e) {
        const width = this.progressContainer.clientWidth;
        const clickX = e.offsetX;
        const duration = this.audio.duration;
        this.audio.currentTime = (clickX / width) * duration;
    }

    updateProgress() {
        const { currentTime, duration } = this.audio;
        const progress = (currentTime / duration) * 100;
        this.progress.style.width = `${progress}%`;
        
        // Format time
        const formatTime = (seconds) => {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = Math.floor(seconds % 60);
            return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        };

        this.currentTime.textContent = formatTime(currentTime);
        this.duration.textContent = formatTime(duration);
    }
}

// Initialize the music player when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new MusicPlayer();
});
