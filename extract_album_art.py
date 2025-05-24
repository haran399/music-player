from mutagen.mp3 import MP3
from mutagen.id3 import ID3, APIC
import os
from PIL import Image

# Create images directory if it doesn't exist
if not os.path.exists('images'):
    os.makedirs('images')

def extract_album_art(mp3_path):
    try:
        # Load the MP3 file
        audio = MP3(mp3_path, ID3=ID3)
        
        # Get the album art
        for tag in audio.tags.getall('APIC'):
            # Get the image data
            image_data = tag.data
            
            # Create the output filename
            base_name = os.path.splitext(os.path.basename(mp3_path))[0]
            output_path = os.path.join('images', f'{base_name}.jpg')
            
            # Save the image
            with open(output_path, 'wb') as img_file:
                img_file.write(image_data)
                
            # Optimize the image
            try:
                img = Image.open(output_path)
                img.save(output_path, 'JPEG', quality=85, optimize=True)
                print(f'Successfully extracted album art from {os.path.basename(mp3_path)}')
            except Exception as e:
                print(f'Error optimizing image for {os.path.basename(mp3_path)}: {str(e)}')
            
            return True
        
        print(f'No album art found in {os.path.basename(mp3_path)}')
        return False
    except Exception as e:
        print(f'Error processing {os.path.basename(mp3_path)}: {str(e)}')
        return False

def main():
    # Get all MP3 files in the songs directory
    mp3_files = [f for f in os.listdir('songs') if f.lower().endswith('.mp3')]
    
    # Process each MP3 file
    for mp3_file in mp3_files:
        mp3_path = os.path.join('songs', mp3_file)
        extract_album_art(mp3_path)

if __name__ == '__main__':
    main()
