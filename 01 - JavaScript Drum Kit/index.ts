/**
 * on keydown check what key was pressed then run playSound
 * @param {any} event
 */
// get key
function findKey(e: MouseEvent) {
  const key: { keyCode: number } = {
    keyCode: this.dataset.key
  }
  playSound(key)
}

/**
 * on keydown event play sound
 * from matching audio element
 * @param {any} event
 */

function playSound(keyObj: any) {
  const key = document.querySelector(`div[data-key="${keyObj.keyCode}"]`)
  const audio = document.querySelector(`audio[data-key="${keyObj.keyCode}"]`) as HTMLAudioElement

  if (!audio) return
  key.classList.add('playing')
  audio.play()
}

/**
 * when transition ends
 * remove 'playing' from element classlist
 * @param {any} event
 */
function removeTransition(e: Event) {
  const key = e.target as HTMLInputElement
  key.classList.remove('playing')
}

const keys = document.querySelectorAll('.key')

keys.forEach(key => {
  // find and play matching sound on mouse click
  key.addEventListener('mousedown', findKey)
  // remove transition on end
  key.addEventListener('transitionend', removeTransition)
})

// play matching sound on key press
document.addEventListener('keydown', playSound)
