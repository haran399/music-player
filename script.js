class MusicPlayer {
    constructor() {
        this.audio = new Audio();
        this.isPlaying = false;
        this.currentSongIndex = 0;
        this.songs = [];
        this.shuffle = false;
        this.repeat = false;
        this.filteredSongs = [];
        this.initializeElements();
        this.loadSong();
        this.addEventListeners();
    }

    initializeElements() {
        this.playBtn = document.getElementById('play-btn');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.shuffleBtn = document.getElementById('shuffle-btn');
        this.repeatBtn = document.getElementById('repeat-btn');
        this.muteBtn = document.getElementById('mute-btn');
        this.volumeSlider = document.getElementById('volume-slider');
        this.progressBar = document.getElementById('progress-bar');
        this.progress = document.getElementById('progress');
        this.currentTime = document.getElementById('current-time');
        this.duration = document.getElementById('duration');
        this.songImage = document.getElementById('song-image');
        this.songTitle = document.getElementById('song-title');
        this.songArtist = document.getElementById('song-artist');
        this.playlistSelector = document.getElementById('playlist-selector');
        this.playlistContainer = document.getElementById('playlist-container');
        this.relatedSongsContainer = document.getElementById('related-songs');
    }

    addEventListeners() {
        this.playBtn.addEventListener('click', () => this.togglePlay());
        this.prevBtn.addEventListener('click', () => this.prevSong());
        this.nextBtn.addEventListener('click', () => this.nextSong());
        this.shuffleBtn.addEventListener('click', () => this.toggleShuffle());
        this.repeatBtn.addEventListener('click', () => this.toggleRepeat());
        this.muteBtn.addEventListener('click', () => this.toggleMute());
        this.volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));
        this.progressBar.addEventListener('click', (e) => this.seek(e));
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.handleSongEnd());
        this.playlistSelector.addEventListener('change', () => this.updatePlaylist());
    }

    loadSong() {
        const song = this.songs[this.currentSongIndex];
        this.audio.src = song.path;
        this.audio.load();
        this.songImage.src = song.image;
        this.songTitle.textContent = song.title;
        this.songArtist.textContent = song.artist;
        this.updateRelatedSongs();
    };

    togglePlay() {
        if (this.isPlaying) {
            this.audio.pause();
            this.playBtn.textContent = '▶';
        } else {
            this.audio.play().catch(error => {
                console.error('Error playing song:', error);
            });
            this.playBtn.textContent = '⏸';
        }
        this.isPlaying = !this.isPlaying;
    };

    prevSong() {
        if (this.shuffle) {
            this.currentSongIndex = Math.floor(Math.random() * this.songs.length);
        } else {
            this.currentSongIndex = (this.currentSongIndex - 1 + this.songs.length) % this.songs.length;
        }
        this.loadSong();
        if (this.isPlaying) {
            this.audio.play();
        }
    };

    nextSong() {
        if (this.shuffle) {
            this.currentSongIndex = Math.floor(Math.random() * this.songs.length);
        } else {
            this.currentSongIndex = (this.currentSongIndex + 1) % this.songs.length;
        }
        this.loadSong();
        if (this.isPlaying) {
            this.audio.play();
        }
    };

    toggleShuffle() {
        this.shuffle = !this.shuffle;
        this.shuffleBtn.classList.toggle('active');
    };

    toggleRepeat() {
        this.repeat = !this.repeat;
        this.repeatBtn.classList.toggle('active');
    };

    toggleMute() {
        this.audio.muted = !this.audio.muted;
        this.muteBtn.classList.toggle('muted');
        this.volumeSlider.value = this.audio.muted ? 0 : this.volumeSlider.value;
    };

    setVolume(value) {
        this.audio.volume = value / 100;
        if (this.audio.muted) {
            this.audio.muted = false;
            this.muteBtn.classList.remove('muted');
        }
    };

    seek(e) {
        const rect = this.progressBar.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;
        const progress = x / width;
        this.audio.currentTime = progress * this.audio.duration;
    };

    updateProgress() {
        const currentTime = this.audio.currentTime;
        const duration = this.audio.duration;
        const progress = (currentTime / duration) * 100;
        this.progress.style.width = `${progress}%`;
        this.currentTime.textContent = this.formatTime(currentTime);
        this.duration.textContent = this.formatTime(duration);
    };

    handleSongEnd() {
        if (this.repeat) {
            this.audio.currentTime = 0;
            this.audio.play();
        } else {
            this.nextSong();
        }
    };

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    updateRelatedSongs() {
        const song = this.songs[this.currentSongIndex];
        const relatedSongs = song.relatedSongs.map(index => this.songs[index]);
        this.relatedSongsContainer.innerHTML = relatedSongs.map(song => `
            <div class="song-item" onclick="player.loadSong(${song.relatedSongs.indexOf(this.currentSongIndex)})">
                <img src="${song.image}" alt="${song.title}">
                <div class="song-info">
                    <div class="song-title">${song.title}</div>
                    <div class="song-artist">${song.artist}</div>
                </div>
            </div>
        `).join('');
    };

    updatePlaylist() {
        const selectedLanguage = this.playlistSelector.value;
        this.filteredSongs = selectedLanguage === 'All' 
            ? this.songs 
            : this.songs.filter(song => song.language === selectedLanguage);
        this.playlistContainer.innerHTML = this.filteredSongs.map((song, index) => `
            <div class="song-item" onclick="player.loadSong(${index})">
                <img src="${song.image}" alt="${song.title}">
                <div class="song-info">
                    <div class="song-title">${song.title}</div>
                    <div class="song-artist">${song.artist}</div>
                </div>
            </div>
        `).join('');
    };
};

// Initialize songs array
const player = new MusicPlayer();
player.songs = [
    {
        title: "Vellai Pookal",
        artist: "Yuvan Shankar Raja",
        album: "Vikram",
        year: 2022,
        duration: "4:30",
        path: "songs/vellai-pookal.mp3",
        image: "images/vellai-pookal.jpg",
        language: "Tamil",
        relatedSongs: [1, 2, 3]
    },
    {
        title: "Ennai Thalatta",
        artist: "Anirudh Ravichander",
        album: "Vikram",
        year: 2022,
        duration: "3:45",
        path: "songs/ennai-thalatta.mp3",
        image: "images/ennai-thalatta.jpg",
        language: "Tamil",
        relatedSongs: [0, 2, 3]
    },
    {
        title: "Kaththi",
        artist: "Yuvan Shankar Raja",
        album: "Vikram",
        year: 2022,
        duration: "4:15",
        path: "songs/kaththi.mp3",
        image: "images/kaththi.jpg",
        language: "Tamil",
        relatedSongs: [0, 1, 3]
    },
    {
        title: "Vellai Raagam",
        artist: "Yuvan Shankar Raja",
        album: "Vikram",
        year: 2022,
        duration: "5:00",
        path: "songs/vellai-raagam.mp3",
        image: "images/vellai-raagam.jpg",
        language: "Tamil",
        relatedSongs: [0, 1, 2]
    },
    {
        title: "Arjunar Villu",
        artist: "Anirudh",
        path: "songs/Arjunar_Villu.mp3",
        image: "images/Arjunar_Villu.jpg",
        relatedSongs: [0, 1, 2, 3],
        language: "Tamil",
        album: "VIP",
        releaseYear: 2023
    },
    {
        title: "Vaa Vaa Vaa",
        artist: "Anirudh",
        path: "songs/Vaa_Vaa_Vaa.mp3",
        image: "images/Vaa_Vaa_Vaa.jpg",
        relatedSongs: [0, 1, 2, 3],
        language: "Tamil",
        album: "VIP",
        releaseYear: 2023
    }
];
player.initializeElements();
player.addEventListeners();
player.loadSong();
            {
                title: "Ezhu Velaikkara",
                artist: "Anirudh",
                path: "songs/Ezhu_Velaikkara.mp3",
                image: "images/Ezhu_Velaikkara.jpg",
                relatedSongs: [0, 1, 2],
                language: "Tamil",
                album: "VIP",
                releaseYear: 2023
            },
            {
                title: "Furious Wings Theme",
                artist: "Anirudh",
                path: "songs/Furious_Wings_Theme.mp3",
                image: "images/Furious_Wings_Theme.jpg",
                relatedSongs: [0, 1, 2],
                language: "Tamil",
                album: "VIP",
                releaseYear: 2023
            },
            {
                title: "Hey Mama",
                artist: "Anirudh",
                path: "songs/Hey_Mama.mp3",
                image: "images/Hey_Mama.jpg",
                relatedSongs: [0, 1, 2],
                language: "Tamil",
                album: "VIP",
                releaseYear: 2023
            },
            {
                title: "Kaalai Theme",
                artist: "Anirudh",
                path: "songs/Kaalai_Theme.mp3",
                image: "images/Kaalai_Theme.jpg",
                relatedSongs: [0, 1, 2],
                language: "Tamil",
                album: "VIP",
                releaseYear: 2023
            }
        ];

        this.initializeElements();
        this.loadSong();
        this.addEventListeners();
    }

    initializeElements() {
        this.playBtn = document.getElementById('play-btn');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.shuffleBtn = document.getElementById('shuffle-btn');
        this.repeatBtn = document.getElementById('repeat-btn');
        this.volumeBtn = document.getElementById('volume-btn');
        this.volumeSlider = document.getElementById('volume-slider');
        this.progress = document.getElementById('progress');
        this.currentTime = document.getElementById('current-time');
        this.duration = document.getElementById('duration');
        this.songImage = document.getElementById('song-image');
        this.title = document.getElementById('song-title');
        this.artist = document.getElementById('song-artist');
        this.playlist = document.getElementById('playlist');
        this.relatedSongs = document.getElementById('related-songs');
    }

    addEventListeners() {
        this.playBtn.addEventListener('click', () => this.togglePlay());
        this.prevBtn.addEventListener('click', () => this.prevSong());
        this.nextBtn.addEventListener('click', () => this.nextSong());
        this.shuffleBtn.addEventListener('click', () => this.toggleShuffle());
        this.repeatBtn.addEventListener('click', () => this.toggleRepeat());
        this.volumeBtn.addEventListener('click', () => this.toggleMute());
        this.volumeSlider.addEventListener('input', () => this.setVolume());
        this.progress.addEventListener('click', (e) => this.seek(e));
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.handleSongEnd());
    }

    loadSong() {
        const song = this.songs[this.currentSongIndex];
        this.audio.src = song.path;
        this.title.textContent = song.title;
        this.artist.textContent = `${song.artist} • ${song.album} • ${song.releaseYear}`;
        this.songImage.src = song.image;
        this.updatePlaylist();
        this.updateRelatedSongs();
    }

    togglePlay() {
        if (this.isPlaying) {
            this.audio.pause();
            this.playBtn.classList.remove('playing');
        } else {
            this.audio.play();
            this.playBtn.classList.add('playing');
        }
        this.isPlaying = !this.isPlaying;
    }

    prevSong() {
        this.currentSongIndex = (this.currentSongIndex - 1 + this.songs.length) % this.songs.length;
        this.loadSong();
        this.isPlaying = true;
        this.playBtn.classList.add('playing');
        this.audio.play();
    }

    nextSong() {
        this.currentSongIndex = (this.currentSongIndex + 1) % this.songs.length;
        this.loadSong();
        this.isPlaying = true;
        this.playBtn.classList.add('playing');
        this.audio.play();
    }

    toggleShuffle() {
        this.shuffle = !this.shuffle;
        this.shuffleBtn.classList.toggle('active');
    }

    toggleRepeat() {
        this.repeat = !this.repeat;
        this.repeatBtn.classList.toggle('active');
    }

    toggleMute() {
        this.audio.muted = !this.audio.muted;
        this.volumeBtn.classList.toggle('muted');
    }

    setVolume() {
        this.audio.volume = this.volumeSlider.value / 100;
        this.volumeBtn.classList.toggle('muted', this.audio.muted);
    }

    seek(e) {
        const rect = this.progress.getBoundingClientRect();
        const offset = e.clientX - rect.left;
        const width = rect.width;
        const progress = offset / width;
        this.audio.currentTime = progress * this.audio.duration;
    }

    updateProgress() {
        const currentTime = this.audio.currentTime;
        const duration = this.audio.duration;
        if (duration > 0) {
            this.progress.style.width = `${(currentTime / duration) * 100}%`;
        }
        this.currentTime.textContent = this.formatTime(currentTime);
        this.duration.textContent = this.formatTime(duration);
    }

    handleSongEnd() {
        if (this.repeat) {
            this.audio.currentTime = 0;
            this.audio.play();
        } else if (this.shuffle) {
            this.currentSongIndex = Math.floor(Math.random() * this.songs.length);
            this.loadSong();
            this.audio.play();
        } else {
            this.nextSong();
        }
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    updatePlaylist() {
        const selectedLanguage = document.getElementById('playlist-selector').value;
        this.filteredSongs = selectedLanguage === 'All' 
            ? this.songs 
            : this.songs.filter(song => song.language === selectedLanguage);
        this.playlist.innerHTML = this.filteredSongs.map(song => `
            <div class="playlist-item" onclick="player.loadSong(${this.filteredSongs.indexOf(song)})">
                <img src="${song.image}" alt="${song.title}">
                <div class="song-info">
                    <h3>${song.title}</h3>
                    <p>${song.artist}</p>
                </div>
            </div>
        `).join('');
    }

    updateRelatedSongs() {
        const currentSong = this.songs[this.currentSongIndex];
        this.relatedSongs.innerHTML = currentSong.relatedSongs.map(index => `
            <div class="related-song" onclick="player.loadSong(${index})">
                <img src="${this.songs[index].image}" alt="${this.songs[index].title}">
                <div class="song-info">
                    <h3>${this.songs[index].title}</h3>
                    <p>${this.songs[index].artist}</p>
                </div>
            </div>
        `).join('');
    }
};

const songs = [
    {
        title: "Arjunar Villu",
        artist: "Anirudh",
        path: "songs/Arjunar_Villu.mp3",
        image: "images/Arjunar_Villu.jpg",
        relatedSongs: [
            {
                title: "Vetri Kodi",
                artist: "Anirudh",
                path: "songs/Vetri_Kodi.mp3",
                image: "images/Vetri_Kodi.jpg"
            },
            {
                title: "Ezhu Velaikkara",
                artist: "Anirudh",
                path: "songs/Ezhu_Velaikkara.mp3",
                image: "images/Ezhu_Velaikkara.jpg"
            }
        ],
        language: "Tamil",
        album: "Arjunar",
        releaseYear: 2024
    },
    {
        title: "Vetri Kodi",
        artist: "Anirudh",
        path: "songs/Vetri_Kodi.mp3",
        image: "images/Vetri_Kodi.jpg",
        relatedSongs: [
            {
                title: "Arjunar Villu",
                artist: "Anirudh",
                path: "songs/Arjunar_Villu.mp3",
                image: "images/Arjunar_Villu.jpg"
            },
            {
                title: "Ezhu Velaikkara",
                artist: "Anirudh",
                path: "songs/Ezhu_Velaikkara.mp3",
                image: "images/Ezhu_Velaikkara.jpg"
            }
        ],
        language: "Tamil",
        album: "Arjunar",
        releaseYear: 2024
    },
    {
        title: "Ezhu Velaikkara",
        artist: "Anirudh",
        path: "songs/Ezhu_Velaikkara.mp3",
        image: "images/Ezhu_Velaikkara.jpg",
        relatedSongs: [
            {
                title: "Arjunar Villu",
                artist: "Anirudh",
                path: "songs/Arjunar_Villu.mp3",
                image: "images/Arjunar_Villu.jpg"
            },
            {
                title: "Vetri Kodi",
                artist: "Anirudh",
                path: "songs/Vetri_Kodi.mp3",
                image: "images/Vetri_Kodi.jpg"
            }
        ],
        language: "Tamil",
        album: "Arjunar",
        releaseYear: 2024
    },
    {
        title: "Athiradi",
        artist: "Anirudh",
        path: "songs/Athiradi.mp3",
        image: "images/Athiradi.jpg",
        relatedSongs: [
            {
                title: "Arjunar Villu",
                artist: "Anirudh",
                path: "songs/Arjunar_Villu.mp3",
                image: "images/Arjunar_Villu.jpg"
            },
            {
                title: "Vetri Kodi",
                artist: "Anirudh",
                path: "songs/Vetri_Kodi.mp3",
                image: "images/Vetri_Kodi.jpg"
            }
        ],
        language: "Tamil",
        album: "VIP",
        releaseYear: 2023
    },
    {
        title: "Deerane",
        artist: "Anirudh",
        path: "songs/Deerane.mp3",
        image: "images/Deerane.jpg",
        relatedSongs: [
            {
                title: "Arjunar Villu",
                artist: "Anirudh",
                path: "songs/Arjunar_Villu.mp3",
                image: "images/Arjunar_Villu.jpg"
            },
            {
                title: "Vetri Kodi",
                artist: "Anirudh",
                path: "songs/Vetri_Kodi.mp3",
                image: "images/Vetri_Kodi.jpg"
            }
        ],
        language: "Tamil",
        album: "VIP",
        releaseYear: 2023
    },
    {
        title: "Dub Theri Step",
        artist: "Anirudh",
        path: "songs/Dub_Theri_Step.mp3",
        image: "images/Dub_Theri_Step.jpg",
        relatedSongs: [
            {
                title: "Arjunar Villu",
                artist: "Anirudh",
                path: "songs/Arjunar_Villu.mp3",
                image: "images/Arjunar_Villu.jpg"
            },
            {
                title: "Vetri Kodi",
                artist: "Anirudh",
                path: "songs/Vetri_Kodi.mp3",
                image: "images/Vetri_Kodi.jpg"
            }
        ],
        language: "Tamil",
        album: "VIP",
        releaseYear: 2023
    },
    {
        title: "Edhirthu Nil",
        artist: "Anirudh",
        path: "songs/Edhirthu_Nil.mp3",
        image: "images/Edhirthu_Nil.jpg",
        relatedSongs: [
            {
                title: "Arjunar Villu",
                artist: "Anirudh",
                path: "songs/Arjunar_Villu.mp3",
                image: "images/Arjunar_Villu.jpg"
            },
            {
                title: "Vetri Kodi",
                artist: "Anirudh",
                path: "songs/Vetri_Kodi.mp3",
                image: "images/Vetri_Kodi.jpg"
            }
        ],
        language: "Tamil",
        album: "VIP",
        releaseYear: 2023
    },
    {
        title: "Ellaappugazhum",
        artist: "Anirudh",
        path: "songs/Ellaappugazhum.mp3",
        image: "images/Ellaappugazhum.jpg",
        relatedSongs: [
            {
                title: "Arjunar Villu",
                artist: "Anirudh",
                path: "songs/Arjunar_Villu.mp3",
                image: "images/Arjunar_Villu.jpg"
            },
            {
                title: "Vetri Kodi",
                artist: "Anirudh",
                path: "songs/Vetri_Kodi.mp3",
                image: "images/Vetri_Kodi.jpg"
            }
        ],
        relatedSongs: [0, 1, 2],
        language: "Tamil",
        album: "VIP",
        releaseYear: 2023
    },
    {
        title: "Furious Wings Theme",
        artist: "Anirudh",
        path: "songs/Furious_Wings_Theme.mp3",
        image: "images/Furious_Wings_Theme.jpg",
        relatedSongs: [0, 1, 2],
        language: "Tamil",
        album: "VIP",
        releaseYear: 2023
    },
    {
        title: "Hey Mama",
        artist: "Anirudh",
        path: "songs/Hey_Mama.mp3",
        image: "images/Hey_Mama.jpg",
        relatedSongs: [0, 1, 2],
        language: "Tamil",
                album: "VIP",
                releaseYear: 2023
            },
            {
                title: "Kaalai Theme",
                artist: "Anirudh",
                path: "songs/Kaalai_Theme.mp3",
                image: "images/Kaalai_Theme.jpg",
                relatedSongs: [0, 1, 2],
                language: "Tamil",
                album: "VIP",
                releaseYear: 2023
            }
        ];

        // Initialize UI elements
        this.initializeElements();

        // Load the first song
        this.loadSong();

        // Add event listeners
        this.addEventListeners();
    }
            {
                title: "Arjunar Villu",
                artist: "Anirudh",
                path: "songs/Arjunar_Villu.mp3",
                image: "images/Arjunar_Villu.jpg",
                relatedSongs: [1, 2, 3],
                language: "Tamil",
                album: "VIP",
                releaseYear: 2023
            },
            {
                title: "Athiradi",
                artist: "Anirudh",
                path: "songs/Athiradi.mp3",
                image: "images/Athiradi.jpg",
                relatedSongs: [0, 2, 3],
                language: "Tamil",
                album: "VIP",
                releaseYear: 2023
            },
            {
                title: "Deerane",
                artist: "Anirudh",
                path: "songs/Deerane.mp3",
                image: "images/Deerane.jpg",
                relatedSongs: [0, 1, 3],
                language: "Tamil",
                album: "VIP",
                releaseYear: 2023
            },
            {
                title: "Dub Theri Step",
                artist: "Anirudh",
                path: "songs/Dub_Theri_Step.mp3",
                image: "images/Dub_Theri_Step.jpg",
                relatedSongs: [0, 1, 2],
                language: "Tamil",
                album: "VIP",
                releaseYear: 2023
            },
            {
                title: "Edhirthu Nil",
                artist: "Anirudh",
                path: "songs/Edhirthu_Nil.mp3",
                image: "images/Edhirthu_Nil.jpg",
                relatedSongs: [0, 1, 2],
                language: "Tamil",
                album: "VIP",
                releaseYear: 2023
            },
            {
                title: "Ellaappugazhum",
                artist: "Anirudh",
                path: "songs/Ellaappugazhum.mp3",
                image: "images/Ellaappugazhum.jpg",
                relatedSongs: [0, 1, 2],
                language: "Tamil",
                album: "VIP",
                releaseYear: 2023
            },
            {
                title: "Ezhu Velaikkara",
                artist: "Anirudh",
                path: "songs/Ezhu_Velaikkara.mp3",
                image: "images/Ezhu_Velaikkara.jpg",
                relatedSongs: [0, 1, 2],
                language: "Tamil",
                album: "VIP",
                releaseYear: 2023
            },
            {
                title: "Furious Wings Theme",
                artist: "Anirudh",
                path: "songs/Furious_Wings_Theme.mp3",
                image: "images/Furious_Wings_Theme.jpg",
                relatedSongs: [0, 1, 2],
                language: "Tamil",
                album: "VIP",
                releaseYear: 2023
            },
            {
                title: "Hey Mama",
                artist: "Anirudh",
                path: "songs/Hey_Mama.mp3",
                image: "images/Hey_Mama.jpg",
                relatedSongs: [0, 1, 2],
                language: "Tamil",
                album: "VIP",
                releaseYear: 2023
            },
            {
                title: "Kaalai Theme",
                artist: "Anirudh",
                path: "songs/Kaalai_Theme.mp3",
                image: "images/Kaalai_Theme.jpg",
                relatedSongs: [0, 1, 2],
                language: "Tamil",
                album: "VIP",
                releaseYear: 2023
            },
            {
                title: "Mun Sellada",
                artist: "Anirudh",
                path: "songs/Mun_Sellada.mp3",
                image: "images/Mun_Sellada.jpg",
                relatedSongs: [0, 1, 2],
                language: "Tamil",
                album: "VIP",
                releaseYear: 2023
            },
            {
                title: "Nenjae Yezhu",
                artist: "Anirudh",
                path: "songs/Nenjae_Yezhu.mp3",
                image: "images/Nenjae_Yezhu.jpg",
                relatedSongs: [0, 1, 2],
                language: "Tamil",
                album: "VIP",
                releaseYear: 2023
            },
            {
                title: "Neruppu Da",
                artist: "Anirudh",
                path: "songs/Neruppu_Da.mp3",
                image: "images/Neruppu_Da.jpg",
                relatedSongs: [0, 1, 2],
                language: "Tamil",
                album: "VIP",
                releaseYear: 2023
            },
            {
                title: "Veeram",
                artist: "Anirudh",
                path: "songs/Veeram.mp3",
                image: "images/Veeram.jpg",
                relatedSongs: [0, 1, 2],
                language: "Tamil",
                album: "VIP",
                releaseYear: 2023
            },
            {
                title: "Vetri Kodi",
                artist: "Anirudh",
                path: "songs/Vetri_Kodi.mp3",
                image: "images/Vetri_Kodi.jpg",
                relatedSongs: [0, 1, 2],
                language: "Tamil",
                album: "VIP",
                releaseYear: 2023
            },
            {
                title: "VIP Title Song",
                artist: "Anirudh",
                path: "songs/VIP_Title_Song.mp3",
                image: "images/VIP_Title_Song.jpg",
                relatedSongs: [0, 1, 2],
                language: "Tamil",
                album: "VIP",
                releaseYear: 2023
            }
        ];
        this.filteredSongs = this.songs;
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
        this.progressContainer = document.getElementById('progress-container');
        this.progress = document.getElementById('progress');
        this.currentTime = document.getElementById('current-time');
        this.duration = document.getElementById('duration');
        this.songImage = document.getElementById('song-image');
        this.title = document.getElementById('title');
        this.artist = document.getElementById('artist');
        this.playlistList = document.getElementById('playlist-list');
        this.relatedSongsList = document.getElementById('related-songs-list');
        this.playlistSelector = document.getElementById('playlist-selector');
        this.relatedSongs = document.getElementById('related-songs');
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
        this.relatedSongs.addEventListener('click', (e) => {
            if (e.target.closest('.song-item')) {
                const index = e.target.closest('.song-item').dataset.index;
                const song = this.filteredSongs[index];
                this.currentSongIndex = this.songs.indexOf(song);
                this.loadSong();
                this.playSong();
            }
        });
        this.playlistSelector.addEventListener('change', () => this.updatePlaylist());
    }

    loadSong() {
        const song = this.songs[this.currentSongIndex];
        this.audio.src = song.path;
        this.title.textContent = song.title;
        this.artist.textContent = `${song.artist} • ${song.album} • ${song.releaseYear}`;
        this.songImage.src = song.image;
        
        this.songImage.onerror = () => {
            console.error('Image load failed:', song.image);
            this.songImage.src = 'images/placeholder.jpg';
        };
        
        this.progress.style.width = '0%';
        this.updateRelatedSongs();
    }

    togglePlay() {
        if (this.isPlaying) {
            this.audio.pause();
            this.isPlaying = false;
            this.playBtn.textContent = '▶️';
        } else {
            this.audio.play().catch(error => {
                console.error('Error playing song:', error);
            });
            this.isPlaying = true;
            this.playBtn.textContent = '⏸';
        }
    }

    nextSong() {
        const currentFilteredIndex = this.filteredSongs.findIndex(song => 
            song.path === this.songs[this.currentSongIndex].path
        );
        
        if (currentFilteredIndex === -1) {
            console.error('Current song not found in filtered list');
            return;
        }
        
        let nextFilteredIndex = (currentFilteredIndex + 1) % this.filteredSongs.length;
        const nextSong = this.filteredSongs[nextFilteredIndex];
        this.currentSongIndex = this.songs.indexOf(nextSong);
        
        this.loadSong();
        setTimeout(() => {
            if (this.audio.readyState >= 2) {
                this.audio.play().catch(error => {
                    console.error('Error playing song:', error);
                });
                this.isPlaying = true;
                this.playBtn.textContent = '⏸';
            }
        }, 200);
    }

    previousSong() {
        const currentFilteredIndex = this.filteredSongs.findIndex(song => 
            song.path === this.songs[this.currentSongIndex].path
        );
        
        if (currentFilteredIndex === -1) {
            console.error('Current song not found in filtered list');
            return;
        }
        
        let prevFilteredIndex = (currentFilteredIndex - 1 + this.filteredSongs.length) % this.filteredSongs.length;
        const prevSong = this.filteredSongs[prevFilteredIndex];
        this.currentSongIndex = this.songs.indexOf(prevSong);
        
        this.loadSong();
        setTimeout(() => {
            if (this.audio.readyState >= 2) {
                this.audio.play().catch(error => {
                    console.error('Error playing song:', error);
                });
                this.isPlaying = true;
                this.playBtn.textContent = '⏸';
            }
        }, 200);
    }

    setVolume(value) {
        this.audio.volume = value / 100;
        this.muteBtn.textContent = value === 0 ? '🔊' : '🔇';
    }

    toggleMute() {
        this.audio.muted = !this.audio.muted;
        this.muteBtn.textContent = this.audio.muted ? '🔊' : '🔇';
    }

    updateProgress() {
        const progress = (this.audio.currentTime / this.audio.duration) * 100;
        this.progress.style.width = `${progress}%`;
        
        this.currentTime.textContent = this.formatTime(this.audio.currentTime);
        this.duration.textContent = this.formatTime(this.audio.duration);
    }

    setProgress(e) {
        const width = this.progressContainer.clientWidth;
        const clickX = e.offsetX;
        const duration = this.audio.duration;
        this.audio.currentTime = (clickX / width) * duration;
    }

    updatePlaylist() {
        const selectedLanguage = this.playlistSelector.value;
        this.filteredSongs = selectedLanguage === 'All' 
            ? this.songs 
            : this.songs.filter(song => song.language === selectedLanguage);
        
        this.playlistList.innerHTML = '';
        this.filteredSongs.forEach((song, index) => {
            const li = document.createElement('li');
            li.className = 'song-item';
            li.dataset.index = index;
            li.innerHTML = `
                <img src="${song.image}" alt="${song.title}" class="playlist-song-image">
                <div class="playlist-song-info">
                    <h3>${song.title}</h3>
                    <p>${song.artist}</p>
                </div>
            `;
            this.playlistList.appendChild(li);
        });
    }

    updateRelatedSongs() {
        const song = this.songs[this.currentSongIndex];
        this.relatedSongsList.innerHTML = '';
        
        song.relatedSongs.forEach(index => {
            const relatedSong = this.songs[index];
            const li = document.createElement('li');
            li.className = 'song-item';
            li.dataset.index = index;
            li.innerHTML = `
                <img src="${relatedSong.image}" alt="${relatedSong.title}" class="related-song-image">
                <div class="related-song-info">
                    <h3>${relatedSong.title}</h3>
                    <p>${relatedSong.artist}</p>
                </div>
            `;
            this.relatedSongsList.appendChild(li);
        });
    }

    playSong() {
        this.audio.play().catch(error => {
            console.error('Error playing song:', error);
        });
        this.isPlaying = true;
        this.playBtn.textContent = '⏸';
    }

    stopSong() {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.isPlaying = false;
        this.playBtn.textContent = '▶️';
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
}

// Initialize the music player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const musicPlayer = new MusicPlayer();
});
            document.getElementById('volume-slider').addEventListener('input', (e) => this.setVolume(e.target.value));
            document.querySelector('.progress-container').addEventListener('click', (e) => this.setProgress(e));
            
            // Add event listeners to audio
            this.audio.addEventListener('timeupdate', () => this.updateProgress());
            this.audio.addEventListener('ended', () => this.nextSong());
            
            // Add event listener for related songs
            document.getElementById('related-songs-list').addEventListener('click', (e) => {
                if (e.target.closest('.song-item')) {
                    const index = e.target.closest('.song-item').dataset.index;
                    const song = this.filteredSongs[index];
                    this.currentSongIndex = this.songs.indexOf(song);
                    this.loadSong();
                    this.playSong();
                }
            });

            // Add event listener for playlist selector
            document.getElementById('playlist-selector').addEventListener('change', () => this.updatePlaylist());
        }

        loadSong() {
            const song = this.songs[this.currentSongIndex];
            this.audio.src = song.path;
            this.title.textContent = song.title;
            this.artist.textContent = song.artist;
            this.songImage.src = song.image;
            
            // Add error handling for image loading
            this.songImage.onerror = () => {
                console.error('Image load failed:', song.image);
                this.songImage.src = 'images/placeholder.jpg'; // Fallback image
            };
            
            // Update progress bar width
            this.progress.style.width = '0%';
            
            // Update related songs
            this.updateRelatedSongs();
        }

        togglePlay() {
            if (this.isPlaying) {
                this.audio.pause();
                this.isPlaying = false;
                document.getElementById('play-btn').textContent = '▶️';
            } else {
                this.audio.play().catch(error => {
                    console.error('Error playing song:', error);
                });
                this.isPlaying = true;
                document.getElementById('play-btn').textContent = '⏸';
            }
        }

        nextSong() {
            console.log('Next song clicked');
            
            // Get current position in filtered songs
            const currentFilteredIndex = this.filteredSongs.findIndex(song => 
                song.path === this.songs[this.currentSongIndex].path
            );
            
            if (currentFilteredIndex === -1) {
                console.error('Current song not found in filtered list');
                return;
            }
            
            // Calculate next index in filtered songs
            let nextFilteredIndex = (currentFilteredIndex + 1) % this.filteredSongs.length;
            
            // Find the corresponding index in the full songs array
            const nextSong = this.filteredSongs[nextFilteredIndex];
            this.currentSongIndex = this.songs.indexOf(nextSong);
            
            // Load the next song
            this.loadSong();
            
            // Play the song after a small delay
            setTimeout(() => {
                if (this.audio.readyState >= 2) { // HAVE_CURRENT_DATA
                    this.audio.play().catch(error => {
                        console.error('Error playing song:', error);
                    });
                    this.isPlaying = true;
                    document.getElementById('play-btn').textContent = '⏸';
                } else {
                    console.error('Audio not ready to play');
                }
            }, 200); // Increased delay for better reliability
        }

        previousSong() {
            console.log('Previous song clicked');
            
            // Get current position in filtered songs
            const currentFilteredIndex = this.filteredSongs.findIndex(song => 
                song.path === this.songs[this.currentSongIndex].path
            );
            
            if (currentFilteredIndex === -1) {
                console.error('Current song not found in filtered list');
                return;
            }
            
            // Calculate previous index in filtered songs
            let prevFilteredIndex = (currentFilteredIndex - 1 + this.filteredSongs.length) % this.filteredSongs.length;
            
            // Find the corresponding index in the full songs array
            const prevSong = this.filteredSongs[prevFilteredIndex];
            this.currentSongIndex = this.songs.indexOf(prevSong);
            
            // Load and play the previous song
            this.loadSong();
            setTimeout(() => {
                if (this.audio.readyState >= 2) {
                    this.audio.play().catch(error => {
                        console.error('Error playing song:', error);
                    });
                    this.isPlaying = true;
                    document.getElementById('play-btn').textContent = '⏸';
                }
            }, 200);
        }

        setVolume(value) {
            this.audio.volume = value / 100;
        }

        toggleMute() {
            this.audio.muted = !this.audio.muted;
            document.getElementById('mute-btn').textContent = this.audio.muted ? '🔊' : '🔇';
        }

        updateProgress() {
            const progress = (this.audio.currentTime / this.audio.duration) * 100;
            this.progress.style.width = `${progress}%`;
        }

        setProgress(e) {
            const width = this.progressContainer.clientWidth;
            const clickX = e.offsetX;
            const duration = this.audio.duration;
            
            this.audio.currentTime = (clickX / width) * duration;
        }

        updatePlaylist() {
            const selectedLanguage = document.getElementById('playlist-selector').value;
            this.filteredSongs = selectedLanguage === 'All' 
                ? this.songs 
                : this.songs.filter(song => song.language === selectedLanguage);
            
            this.playlistList.innerHTML = '';
            this.filteredSongs.forEach((song, index) => {
                const li = document.createElement('li');
                li.className = 'song-item';
                li.dataset.index = index;
                li.textContent = `${song.title} - ${song.artist}`;
                this.playlistList.appendChild(li);
            });
        }

        updateRelatedSongs() {
            const song = this.songs[this.currentSongIndex];
            this.relatedSongsList.innerHTML = '';
            
            song.relatedSongs.forEach(index => {
                const relatedSong = this.songs[index];
                const li = document.createElement('li');
                li.className = 'song-item';
                li.dataset.index = index;
                li.textContent = `${relatedSong.title} - ${relatedSong.artist}`;
                this.relatedSongsList.appendChild(li);
            });
        }

        playSong() {
            this.audio.play().catch(error => {
                console.error('Error playing song:', error);
            });
            this.isPlaying = true;
            document.getElementById('play-btn').textContent = '⏸';
        }

        stopSong() {
            this.audio.pause();
            this.audio.currentTime = 0;
            this.isPlaying = false;
            document.getElementById('play-btn').textContent = '▶️';
        }
    }

} // End of MusicPlayer class

// Initialize the music player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const musicPlayer = new MusicPlayer();
    musicPlayer.initialize();
});
    }
            {
                title: "Arjunar Villu",
                artist: "Anirudh",
                path: "songs/Arjunar_Villu-StarMusiQ.Com.mp3",
                image: "images/Arjunar_Villu-StarMusiQ.Com.jpg",
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
                image: "images/Dub_Theri_Step-StarMusiQ.Com.jpg",
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
                image: "images/Ezhu Velaikkara [Starmusiq.info].jpg",
                relatedSongs: [0, 1, 2],
                language: "Tamil"
            },
            {
                title: "Furious Wings Theme",
                artist: "Anirudh",
                path: "songs/Furious Wings (Theme) [Starmusiq.cc].mp3",
                image: "images/Furious Wings (Theme) [Starmusiq.cc].jpg",
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
                image: "images/Kaalai-Theme-MassTamilan.com.jpg",
                relatedSongs: [0, 1, 2],
                language: "Tamil"
            },
            {
                title: "Mun Sellada",
                artist: "Anirudh",
                path: "songs/Mun Sellada [Starmusiq.xyz].mp3",
                image: "images/Mun Sellada [Starmusiq.xyz].jpg",
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
                image: "images/Neruppu Da - IsaiKadal.com.jpg",
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
                image: "images/VIP_(Title_Song)-StarMusiQ.Com.jpg",
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
        this.filteredSongs = this.songs;
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
        this.progressContainer = document.querySelector('.progress-container');
        this.progress = document.querySelector('.progress');
        this.title = document.getElementById('song-title');
        this.artist = document.getElementById('song-artist');
        this.songImage = document.getElementById('song-image');
        this.relatedSongsList = document.getElementById('related-songs-list');
        this.playlistSelector = document.getElementById('playlist-selector');
        this.currentTime = document.getElementById('current-time');
        this.duration = document.getElementById('duration');
    }

    setupEventListeners() {
        // Add event listeners to buttons
        this.playBtn.addEventListener('click', () => this.togglePlay());
        this.prevBtn.addEventListener('click', () => this.previousSong());
        this.nextBtn.addEventListener('click', () => this.nextSong());
        this.muteBtn.addEventListener('click', () => this.toggleMute());
        
        // Add event listeners to volume and progress controls
        this.volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));
        this.progressContainer.addEventListener('click', (e) => this.setProgress(e));
        
        // Add event listeners to audio
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
    };

    loadSong() {
        const song = this.songs[this.currentSongIndex];
        console.log('Loading song:', song.title, 'with image:', song.image);
        this.audio.src = song.path;
        this.audio.load();
        
        // Wait for the audio to be ready before updating UI
        this.audio.onloadedmetadata = () => {
            console.log('Audio loaded:', song.title);
            this.songTitle.textContent = song.title;
            this.songArtist.textContent = song.artist;
            
            // Set image with error handling
            this.songImage.src = song.image;
            this.songImage.onload = () => {
                console.log('Image loaded successfully:', song.image);
            };
            this.songImage.onerror = () => {
                console.error('Image load failed:', song.image);
                this.songImage.src = 'images/placeholder.jpg'; // Fallback image
            };
            
            this.updateRelatedSongs();
            this.updatePlaylist();
            
            // Update duration display
            const duration = this.audio.duration;
            const formatTime = (seconds) => {
                const minutes = Math.floor(seconds / 60);
                const remainingSeconds = Math.floor(seconds % 60);
                return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
            };
            this.duration.textContent = formatTime(duration);
        };
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
        
        // Load and play the previous song
        this.loadSong();
        this.audio.play().catch(error => {
            console.error('Error playing song:', error);
        });
        
        // Update UI
        this.isPlaying = true;
        this.playBtn.textContent = '⏸';
    }

    nextSong() {
        console.log('Next song clicked');
        
        // Get current position in filtered songs
        const currentFilteredIndex = this.filteredSongs.findIndex(song => 
            song.path === this.songs[this.currentSongIndex].path
        );
        
        if (currentFilteredIndex === -1) {
            console.error('Current song not found in filtered list');
            return;
        }
        
        // Calculate next index in filtered songs
        let nextFilteredIndex = (currentFilteredIndex + 1) % this.filteredSongs.length;
        
        // Find the corresponding index in the full songs array
        const nextSong = this.filteredSongs[nextFilteredIndex];
        this.currentSongIndex = this.songs.indexOf(nextSong);
        
        // Load the next song
        this.loadSong();
        
        // Play the song after a small delay
        setTimeout(() => {
            if (this.audio.readyState >= 2) { // HAVE_CURRENT_DATA
                this.audio.play().catch(error => {
                    console.error('Error playing song:', error);
                });
                this.isPlaying = true;
                document.getElementById('play-btn').textContent = '⏸';
            } else {
                console.error('Audio not ready to play');
            }
        }, 200); // Increased delay for better reliability
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
