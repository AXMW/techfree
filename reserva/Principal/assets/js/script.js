const button = document.querySelector("button")
const modal = document.querySelector("dialog")
const buttonClose = document.querySelector("dialog button")
const overlay = document.getElementById('overlay');

button.onclick = function () {
    overlay.style.display = 'block';
    modal.show()
}

buttonClose.onclick = function () {
    modal.close()
    overlay.style.display = 'none';
}