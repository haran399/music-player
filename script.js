class MusicPlayer {
    constructor() {
        this.audio = new Audio();
        this.isPlaying = false;
        this.songs = [
            {
                title: "Arjunar Villu",
                artist: "Anirudh",
                path: "songs/Arjunar_Villu-StarMusiQ.Com.mp3",
                image: "images/Arjunar_Villu.jpg",
                relatedSongs: [1, 2, 3],
                language: "Tamil"
            },
            {
                title: "Athiradi",
                artist: "Anirudh",
                path: "songs/Athiradi [Starmusiq.info].mp3",
                image: "images/Athiradi.jpg",
                relatedSongs: [0, 2, 3],
                language: "Tamil"
            },
            {
                title: "Deerane",
                artist: "Anirudh",
                path: "songs/Deerane-StarMusiQ.Com.mp3",
                image: "images/Deerane.jpg",
                relatedSongs: [0, 1, 3],
                language: "Tamil"
            },
            {
                title: "Dub Theri Step",
                artist: "Anirudh",
                path: "songs/Dub_Theri_Step-StarMusiQ.Com.mp3",
                image: "images/Dub_Theri_Step.jpg",
                relatedSongs: [0, 1, 2],
                language: "Tamil"
            },
            {
                title: "Edhirthu Nil",
                artist: "Anirudh",
                path: "songs/Edhirthu_Nil-StarMusiQ.Com.mp3",
                image: "images/Edhirthu_Nil.jpg",
                relatedSongs: [0, 1, 2],
                language: "Tamil"
            },
            {
                title: "Ellaappugazhum",
                artist: "Anirudh",
                path: "songs/Ellaappugazhum - Copy.mp3",
                image: "images/Ellaappugazhum.jpg",
                relatedSongs: [0, 1, 2],
                language: "Tamil"
            },
            {
                title: "Ezhu Velaikkara",
                artist: "Anirudh",
                path: "songs/Ezhu Velaikkara [Starmusiq.info].mp3",
                image: "images/Ezhu_Velaikkara.jpg",
                relatedSongs: [0, 1, 2],
                language: "Tamil"
            },
            {
                title: "Furious Wings Theme",
                artist: "Anirudh",
                path: "songs/Furious Wings (Theme) [Starmusiq.cc].mp3",
                image: "images/Furious_Wings.jpg",
                relatedSongs: [0, 1, 2],
                language: "Tamil"
            },
            {
                title: "Hey Mama",
                artist: "Anirudh",
                path: "songs/Hey_Mama-StarMusiQ.Com.mp3",
                image: "images/Hey_Mama.jpg",
                relatedSongs: [0, 1, 2],
                language: "Tamil"
            },
            {
                title: "Kaalai Theme",
                artist: "Anirudh",
                path: "songs/Kaalai-Theme-MassTamilan.com.mp3",
                image: "images/Kaalai.jpg",
                relatedSongs: [0, 1, 2],
                language: "Tamil"
            },
            {
                title: "Mun Sellada",
                artist: "Anirudh",
                path: "songs/Mun Sellada [Starmusiq.xyz].mp3",
                image: "images/Mun_Sellada.jpg",
                relatedSongs: [0, 1, 2],
                language: "Tamil"
            },
            {
                title: "Nenjae Yezhu",
                artist: "Anirudh",
                path: "songs/nenjae_yezhu-starmusiq.com.mp3",
                image: "images/Nenjae_Yezhu.jpg",
                relatedSongs: [0, 1, 2],
                language: "Tamil"
            },
            {
                title: "Neruppu Da",
                artist: "Anirudh",
                path: "songs/Neruppu Da - IsaiKadal.com.mp3",
                image: "images/Neruppu_Da.jpg",
                relatedSongs: [0, 1, 2],
                language: "Tamil"
            },
            {
                title: "Veeram",
                artist: "Anirudh",
                path: "songs/Veeram_Tamilmini.Net.mp3",
                image: "images/Veeram.jpg",
                relatedSongs: [0, 1, 2],
                language: "Tamil"
            },
            {
                title: "Vetri Kodi",
                artist: "Anirudh",
                path: "songs/VETRIKODI_1.mp3mp3uli.mp3",
                image: "images/Vetri_Kodi.jpg",
                relatedSongs: [0, 1, 2],
                language: "Tamil"
            },
            {
                title: "VIP Title Song",
                artist: "Anirudh",
                path: "songs/VIP_(Title_Song)-StarMusiQ.Com.mp3",
                image: "images/VIP.jpg",
                relatedSongs: [0, 1, 2],
                language: "Tamil"
            },
            {
                title: "Hindi Song 1",
                artist: "Hindi Artist",
                path: "songs/Hindi_Song_1.mp3",
                image: "images/Hindi_Song_1.jpg",
                relatedSongs: [16, 17, 18],
                language: "Hindi"
            },
            {
                title: "Hindi Song 2",
                artist: "Hindi Artist",
                path: "songs/Hindi_Song_2.mp3",
                image: "images/Hindi_Song_2.jpg",
                relatedSongs: [15, 17, 18],
                language: "Hindi"
            },
            {
                title: "Hindi Song 3",
                artist: "Hindi Artist",
                path: "songs/Hindi_Song_3.mp3",
                image: "images/Hindi_Song_3.jpg",
                relatedSongs: [15, 16, 18],
                language: "Hindi"
            },
            {
                title: "Hindi Song 4",
                artist: "Hindi Artist",
                path: "songs/Hindi_Song_4.mp3",
                image: "images/Hindi_Song_4.jpg",
                relatedSongs: [15, 16, 17],
                language: "Hindi"
            }
        ];
        this.currentSongIndex = 0;
        this.relatedSongsList = document.getElementById('related-songs-list');
        this.playlistSelector = document.getElementById('playlist-selector');

        this.initializeElements();
        this.setupEventListeners();
        this.loadSong();
        this.updateRelatedSongs();
        this.updatePlaylist();
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
                const song = this.filteredSongs[index];
                this.currentSongIndex = this.songs.indexOf(song);
                this.loadSong();
                this.playSong();
            }
        });

        // Add event listener for playlist selector
        this.playlistSelector.addEventListener('change', () => this.updatePlaylist());
    }

    loadSong() {
        const song = this.songs[this.currentSongIndex];
        this.audio.src = song.path;
        this.songTitle.textContent = song.title;
        this.songArtist.textContent = song.artist;
        this.songImage.src = song.image;
        this.audio.load();
        this.updateRelatedSongs();
        this.updatePlaylist();
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
        // Get current position in filtered songs
        const currentFilteredIndex = this.filteredSongs.findIndex(song => 
            song.path === this.songs[this.currentSongIndex].path
        );
        
        // Calculate previous index in filtered songs
        let prevFilteredIndex = (currentFilteredIndex - 1 + this.filteredSongs.length) % this.filteredSongs.length;
        
        // Find the corresponding index in the full songs array
        const prevSong = this.filteredSongs[prevFilteredIndex];
        this.currentSongIndex = this.songs.indexOf(prevSong);
        
        this.loadSong();
        this.playSong();
    }

    nextSong() {
        // Get current position in filtered songs
        const currentFilteredIndex = this.filteredSongs.findIndex(song => 
            song.path === this.songs[this.currentSongIndex].path
        );
        
        // Calculate next index in filtered songs
        let nextFilteredIndex = (currentFilteredIndex + 1) % this.filteredSongs.length;
        
        // Find the corresponding index in the full songs array
        const nextSong = this.filteredSongs[nextFilteredIndex];
        this.currentSongIndex = this.songs.indexOf(nextSong);
        
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
