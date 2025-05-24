# Extract album art from MP3 files
$mp3Files = Get-ChildItem -Path "songs" -Filter "*.mp3"

foreach ($file in $mp3Files) {
    $outputImage = Join-Path -Path "images" -ChildPath ($file.BaseName + ".jpg")
    
    # Extract album art using ffmpeg
    ffmpeg -i $file.FullName -an -c copy $outputImage
    
    if (Test-Path $outputImage) {
        Write-Host "Successfully extracted album art from $($file.Name)"
    } else {
        Write-Host "No album art found in $($file.Name)"
    }
}
