const player = document.querySelector('.player')
const video = player.querySelector('.viewer')
const toggle = player.querySelector('.toggle')
const ranges = player.querySelectorAll('.player__slider')
const skipButtons = player.querySelectorAll('[data-skip]')
const progressBar = player.querySelector('div.progress')
const progress = player.querySelector('div.progress__filled')

function togglePlay(e) {
  const action = video.paused ? 'play' : 'pause'
  video[action]()
}

function updateButton(e) {
  const icon = this.paused ? '►' : '❙❙'
  toggle.innerText = icon
}

function skip(e) {
  video.currentTime += parseFloat(this.dataset.skip)
}

function handleRangeChange(e) {
  const inputName = this.name
  video[inputName] = e.target.value
}

function handleVideoChange(e) {
  const progressPercent = `${video.currentTime / video.duration * 100}%`
  progress.style.flexBasis = progressPercent
}

// function offset(el) {
//   let rect = el.getBoundingClientRect(),
//     scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
//     scrollTop = window.pageYOffset || document.documentElement.scrollTop
//   return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
// }

function handleProgressChange(e) {
  // const divOffset = offset(video)
  // const clickedPosition = e.pageX - divOffset.left
  // const widthToDurationConversion = video.duration / video.clientWidth
  // const clickedTime = clickedPosition * widthToDurationConversion

  const calcTime = e.offsetX / progressBar.offsetWidth * video.duration
  video.currentTime = calcTime
}

video.addEventListener('click', togglePlay)
video.addEventListener('play', updateButton)
video.addEventListener('pause', updateButton)
video.addEventListener('timeupdate', handleVideoChange)

toggle.addEventListener('click', togglePlay)
skipButtons.forEach(skipBtn => skipBtn.addEventListener('click', skip))
ranges.forEach(range => range.addEventListener('change', handleRangeChange))
progressBar.addEventListener('click', handleProgressChange)
