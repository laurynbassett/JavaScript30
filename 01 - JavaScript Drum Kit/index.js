/**
 * on keydown check what key was pressed then run playSound
 * @param {any} event
 */
// get key
function findKey(e) {
    var key = {
        keyCode: this.dataset.key
    };
    playSound(key);
}
/**
 * on keydown event play sound
 * from matching audio element
 * @param {any} event
 */
function playSound(keyObj) {
    var key = document.querySelector("div[data-key=\"" + keyObj.keyCode + "\"]");
    var audio = document.querySelector("audio[data-key=\"" + keyObj.keyCode + "\"]");
    if (!audio)
        return;
    key.classList.add('playing');
    audio.play();
}
/**
 * when transition ends
 * remove 'playing' from element classlist
 * @param {any} event
 */
function removeTransition(e) {
    var key = e.target;
    key.classList.remove('playing');
}
var keys = document.querySelectorAll('.key');
keys.forEach(function (key) {
    // find and play matching sound on mouse click
    key.addEventListener('mousedown', findKey);
    // remove transition on end
    key.addEventListener('transitionend', removeTransition);
});
// play matching sound on key press
document.addEventListener('keydown', playSound);
//# sourceMappingURL=index.js.map