# Web Music Player

A modern web-based music player with related songs functionality.

## Features
- Play/Pause controls
- Next/Previous song navigation
- Volume control with mute option
- Progress bar with time display
- Related songs suggestions
- Responsive design

## Free Deployment Instructions

1. Create a GitHub account at https://github.com if you don't have one
2. Create a new repository:
   - Go to https://github.com/new
   - Name it "music-player" (or any name you prefer)
   - Don't initialize with README
   - Click "Create repository"

3. After creating the repository:
```bash
git remote add origin https://github.com/YOUR_USERNAME/music-player.git
git branch -M main
git push -u origin main
```

4. Enable GitHub Pages:
   - Go to your repository on GitHub
   - Click on "Settings" tab
   - Scroll down to "Pages" section
   - Under "Source", select "main" branch from the dropdown
   - Click "Save"

5. Your site will be available at:
   - `https://YOUR_USERNAME.github.io/music-player/`
   - Replace YOUR_USERNAME with your GitHub username

## Usage

1. Add your music files to the `songs` directory
2. Add album art to the `images` directory
3. Update the songs array in `script.js` with your music files
4. Access the player through your GitHub Pages URL

## License

MIT License
