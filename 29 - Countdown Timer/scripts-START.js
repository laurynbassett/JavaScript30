const timeLeft = document.querySelector('.display__time-left')
const endTime = document.querySelector('.display__end-time')
const timerButtons = document.querySelectorAll('.timer__button')
const timerForm = document.querySelector('form[name="customForm"]')
const clearButton = document.querySelector('.clear__button')
const pauseButton = document.querySelector('.pause__button')
const playButton = document.querySelector('.play__button')
let countdown
let secsLeft
let isPaused = false

/* EVENT HANDLERS */

// TIMER
function timer(secs) {
  // clear any existing timer
  clearInterval(countdown)

  const now = Date.now()
  const then = now + secs * 1000

  // display total seconds once before entering interval
  displayTimeLeft(secs)
  displayEndTime(then)

  countdown = setInterval(() => {
    secsLeft = Math.round((then - Date.now()) / 1000)

    // check if seconds left is 0
    if (secsLeft <= 0) {
      clearInterval(countdown)
      return
    }

    // display time left in DOM
    displayTimeLeft(secsLeft)
  }, 1000)
}

// DISPLAY TIME LEFT
function displayTimeLeft(secs) {
  const hours = Math.floor(secs / 3600) || ''
  const minutes = Math.floor(secs / 60) % 60
  const formattedMinutes = minutes < 10 && hours ? `0${minutes}` : minutes
  const seconds = secs % 60 // secs - (minutes * 60)
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds
  const display = `${hours ? hours + ':' : ''}${formattedMinutes}:${formattedSeconds}`
  timeLeft.textContent = display
  document.title = display
}

// DISPLAY END TIME
function displayEndTime(timestamp) {
  const end = new Date(timestamp)
  const hours = end.getHours()
  const formattedHours = hours > 12 ? hours - 12 : hours
  const minutes = end.getMinutes()
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes
  endTime.textContent = `Be back at ${formattedHours}:${formattedMinutes}`
}

// SET MINUTES
function setMinutes(e) {
  e.preventDefault()
  const seconds = Math.floor(this.minutes.value * 60)
  timer(seconds)
  this.reset()
}

// START TIMER
function startTimer() {
  const seconds = parseInt(this.dataset.time)
  timer(seconds)
}

// TOGGLE TIMER
function toggle() {
  if (isPaused) {
    timer(secsLeft)
  } else {
    clearInterval(countdown)
  }
  isPaused = !isPaused
}

// CLEAR TIMER
function clearTimer() {
  clearInterval(countdown)
  timeLeft.textContent = ''
  endTime.textContent = ''
}

/* EVENT LISTENERS */

timerButtons.forEach(timerButton => {
  timerButton.addEventListener('click', startTimer)
})
timerForm.addEventListener('submit', setMinutes)
clearButton.addEventListener('click', clearTimer)
pauseButton.addEventListener('click', toggle)
playButton.addEventListener('click', toggle)
