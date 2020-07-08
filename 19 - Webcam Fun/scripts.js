const video = document.querySelector('.player')
const canvas = document.querySelector('.photo')
const ctx = canvas.getContext('2d')
const strip = document.querySelector('.strip')
const snap = document.querySelector('.snap')
const colorRanges = document.querySelectorAll('[type=range]')

const photoStrip = JSON.parse(localStorage.getItem('strip')) || []

/* ----- FUNCTIONS ----- */

// Get webcam permission & play
function getVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then(localMediaStream => {
      video.srcObject = localMediaStream
      video.play()
    })
    .catch(err => {
      console.log('Error accessing webcam: ', err)
    })
}

// Paint webcam feed to canvas
function paintToCanvas() {
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight

  setInterval(() => {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height)
    // adjust pixels
    pixels = rgbSplit(pixels)
    // put adjusted pixels back into video
    ctx.putImageData(pixels, 0, 0)
  }, 16)
}

// Take photo
function takePhoto() {
  snap.currentTime = 0
  snap.play()
  // get image data from canvas
  const data = canvas.toDataURL('image/jpeg')
  // add image url to photostrip array
  photoStrip.push(data)
  // update strip in DOM
  populateStrip(photoStrip, strip)
  // add item to items in local storage
  localStorage.setItem('strip', JSON.stringify(photoStrip))
}

// Convert Base64 URL to Blob URL
function getBase64Url(data, mimeType) {
  let byteCharacters = atob(data.substr(`data:${mimeType};base64,`.length))
  let byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  let byteArray = new Uint8Array(byteNumbers)
  let file = new Blob([byteArray], { type: mimeType })
  return URL.createObjectURL(file)
}

// Populate Photo Strip
function populateStrip(photos = [], strip) {
  // reset strip before adding photos
  strip.innerHTML = ''
  photos.forEach(data => {
    const link = document.createElement('a')
    // convert base64 to blob URL
    link.href = getBase64Url(data, 'image/jpeg')
    // set element attributes
    link.setAttribute('rel', 'noopener noreferrer')
    link.setAttribute('target', '_blank')
    link.innerHTML = `<img src=${data} alt='webcam pic' />`
    // add element to strip
    strip.insertBefore(link, strip.firstChild)
  })
}

/* ----- IMAGE EFFECTS ----- */

function redEffect(pixels) {
  // Iterate through every pixel
  for (let i = 0; i < pixels.data.length; i += 4) {
    // Modify pixel data
    pixels.data[i + 0] += 200 // R value
    pixels.data[i + 1] -= 50 // G value
    pixels.data[i + 2] *= 0.5 // B value
  }
  return pixels
}

function rgbSplit(pixels) {
  // Iterate through every pixel
  for (let i = 0; i < pixels.data.length; i += 4) {
    // Modify pixel data
    pixels.data[i - 150] = pixels.data[i + 0] // R value
    pixels.data[i + 500] = pixels.data[i + 1] // G value
    pixels.data[i - 550] = pixels.data[i + 2] // B value
  }
  return pixels
}

function greenScreen(pixels) {
  const levels = {}
  colorRanges.forEach(range => (levels[range.name] = range.value))

  // Iterate through every pixel
  for (let i = 0; i < pixels.data.length; i += 4) {
    // Modify pixel data
    red = pixels.data[i + 0] // R value
    green = pixels.data[i + 1] // G value
    blue = pixels.data[i + 2] // B value
    alpha = pixels.data[i + 3] // A value

    if (
      red >= levels.rmin &&
      green >= levels.gmin &&
      blue >= levels.bmin &&
      red <= levels.rmax &&
      green <= levels.gmax &&
      blue <= levels.bmax
    ) {
      // take it out!
      if (i < 100) console.log('REM')
      pixels.data[i + 3] = 0
    }
  }
  return pixels
}

function invertColors(pixels) {
  // Iterate through every pixel
  for (let i = 0; i < pixels.data.length; i += 4) {
    // Modify pixel data
    pixels.data[i + 0] = 255 - pixels.data[i + 0] // R value
    pixels.data[i + 1] = 255 - pixels.data[i + 1] // G value
    pixels.data[i + 2] = 255 - pixels.data[i + 2] // B value
  }
  return pixels
}

function changeColor(e) {
  const rangeName = e.target.name
  console.log(e.target.name, e.target.value)
  const range = document.querySelector(`[name=${e.target.name}]`)
  console.log('RANGE', range)
  // take pixels out of video
  let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height)
  // adjust pixels for effect
  // if (rangeName === 'rmin') {
  // } else if (rangeName === 'rmax') {
  // } else if (rangeName === 'gmin') {
  // } else if (rangeName === 'gmax') {
  // } else if (rangeName === 'bmin') {
  // } else {
  // }

  // put adjusted pixels back into video
  ctx.putImageData(pixels, 0, 0)
}

/* ----- EVENT LISTENERS & ON READY ----- */

video.addEventListener('canplay', paintToCanvas)
// colorRanges.forEach(colorRange => colorRange.addEventListener('change', changeColor))

// get webcam permissions and stream
getVideo()

// populate photo strip in the DOM
populateStrip(photoStrip, strip)
