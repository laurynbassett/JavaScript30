window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

const words = document.querySelector('.words')
const clearButton = document.querySelector('.clear')
const recognition = new SpeechRecognition()
recognition.interimResults = true
const transcript = JSON.parse(localStorage.getItem('transcript')) || []

// Start speech recognition
function startRecognition(e) {
  const currTranscript = Array.from(e.results).map(result => result[0].transcript).join('')

  let p = document.createElement('p')
  p.textContent = currTranscript

  if (e.results[0].isFinal) {
    words.appendChild(p)
    transcript.push(currTranscript)
  }
  if (currTranscript.includes('unicorn')) {
    console.log('🦄')
  }

  // show clear button
  showClearButton()

  // add item to items in local storage
  localStorage.setItem('transcript', JSON.stringify(transcript))
}

// Populate transcript
function populateTranscript(transcript = [], words) {
  console.log('TRA', transcript)
  // reset words element before adding transcript
  words.innerHTML = ''

  words.innerHTML = transcript.map(currTranscript => `<p>${currTranscript}</p>`).join('')
}

function clearTranscript() {
  // reset words element
  words.innerHTML = ''

  // empty local storage
  localStorage.removeItem('transcript')

  // clear transcript array
  transcript.splice(0, transcript.length)

  // hide clear button
  showClearButton()
}

// show clear button if transcript
function showClearButton() {
  console.log('CHECKING SHOW CLEAR', transcript)
  if (!transcript.length) {
    clearButton.style.visibility = 'hidden'
  } else {
    clearButton.style.visibility = 'visible'
  }
}

/* Event Listeners and On Ready */

recognition.addEventListener('result', startRecognition)
recognition.addEventListener('end', recognition.start)
clearButton.addEventListener('click', clearTranscript)

// start speech recognition
recognition.start()

// populate transcript in the DOM
populateTranscript(transcript, words)

if (!transcript.length) {
  clearButton.style.visibility = 'hidden'
} else {
  clearButton.style.visibility = 'visible'
}
