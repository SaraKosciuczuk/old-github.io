// canvas
const canvas = document.createElement("canvas") // creates an element called canvas
const context = canvas.getContext("2d")
canvas.width = 550
canvas.height = 350

// global var
const GAME_DURATION = 30
let [score, bestScore, interval] = [0, 0, GAME_DURATION]
let firstMove = true
let clock
let lastUpdate = Date.now()
let totalSeconds = 0

// show gamertag
function changeGamertag() {
	document.getElementById("showGamertag").innerHTML="hello "+gamertag;
}

// background image
const backgroundImg = { image: new Image(), ready: false, speed: 100 }
backgroundImg.image.onload = () => backgroundImg.ready = true
backgroundImg.image.src = "space.png"

// square
const squareImg = { speed: 400, width: 80, height: 80, image: new Image(), ready: false }
squareImg.image.onload = () => squareImg.ready = true
squareImg.image.src = "square.png"

// star
const starImg = { width: 60, height: 32, image: new Image(), ready: false }
starImg.image.onload = () => starImg.ready = true
starImg.image.src = "star.png"

// elements
let timerElem, scoreElem, bestScoreElem

// keycodes
const keyCodes = [LEFT, UP, RIGHT, DOWN] = [37, 38, 39, 40]
// key listeners
let keyActions = {}

// append canvas to div tag
window.onload = function () {
	document.getElementById("board").appendChild(canvas)

	timerElem = document.getElementById("clock")
	bestScoreElem = document.getElementById("bestscore")
	scoreElem = document.getElementById("score")

	updateScoreAndTime(interval, score, bestScore)
}

// add key listeners, whether keys where pressed
function addEventListeners() {

	// if the pressed key
	addEventListener("keydown", (e) => {
		if (!keyCodes.find(key => e.keyCode === key)) return
		if (firstMove) {
			firstMove = false
			setTimer()
		}

		keyActions[e.keyCode] = true
	}, true)

	// if the key is released
	addEventListener("keyup", (e) => {
		delete keyActions[e.keyCode]
	}, true)
}

// update rating values
// interval = game time left
// score = current score
// bestScore = best score
function updateScoreAndTime(interval, score, bestScore) {
	timerElem.setAttribute("value", '00 : ' + interval)
	bestScoreElem.setAttribute("value", 'Best score: ' + bestScore)
	scoreElem.setAttribute("value", score)

	localStorage.setItem('score', 'bestScore', parseInt(current_score) + 1);
	document.getElementById("SCORE").innerHTML = " [ " + current_score + " ] ";
}

// calculate the elements positions in canvas
function calculateFirstPositions() {

	if (firstMove) {
		// first square position in the middle
		squareImg.x = (canvas.width / 2) - (squareImg.width / 2)
		squareImg.y = (canvas.height / 2) - (squareImg.height / 2)
	}

	// random first star position
	starImg.x = Math.round(Math.random() * (canvas.width - starImg.width))
	starImg.y = Math.round(Math.random() * (canvas.height - starImg.height))
}


// update the square position and calculate if the birdhas been hit
function updateElements(elapsed) {

	// distance (pixels) = (pixels/second) * seconds
	const distance = squareImg.speed * elapsed
	// max pixels before the square crosses the limits
	const planeLimit = squareImg.width - 10
	const heightLimit = canvas.height - 10
	const widthLimit = canvas.width - 10

	// UP key
	if (keyActions.hasOwnProperty(UP)) {
		// crossing top canvas side
		(squareImg.y > -planeLimit) ? squareImg.y -= distance : squareImg.y = heightLimit
	}

	// DOWN key
	if (keyActions.hasOwnProperty(DOWN)) {
		// crossing bottom
		(squareImg.y < heightLimit) ? squareImg.y += distance : squareImg.y = -planeLimit
	}

	// RIGHT key
	if (keyActions.hasOwnProperty(RIGHT)) {
		// crossing right
		(squareImg.x < widthLimit) ? squareImg.x += distance : squareImg.x = -planeLimit
	}

	// LEFT key
	if (keyActions.hasOwnProperty(LEFT)) {
		// crossing left
		(squareImg.x > -planeLimit) ? squareImg.x -= distance : squareImg.x = widthLimit
	}

	// check collisions, if star was hit
	if (squareImg.x <= (starImg.x + (starImg.width / 2)) &&
		squareImg.y <= (starImg.y + (starImg.height / 2)) &&
		starImg.x <= (squareImg.x + (squareImg.width / 2)) &&
		starImg.y <= (squareImg.y + (squareImg.height / 2))) {
		score++
		calculateFirstPositions()
	}
}

// draw all the elements in the canvas
function paintElements(elapsed) {

	// draw the backgroundImage all the time to refresh and delete the last square position
	if (!firstMove) {
		totalSeconds += elapsed

		const numImages = Math.ceil(canvas.width / backgroundImg.image.width)
		const xpos = (totalSeconds * backgroundImg.speed) % backgroundImg.image.width // xpos pixels

		context.save()
		// Translate canvas (not with the background image)
		context.translate(-xpos, 0)
		context.restore()
	} 
		// reset background image in canvas to position 0 0 (dx dy)
		context.drawImage(backgroundImg.image, 0, 0, backgroundImg.image.width, backgroundImg.image.height)
		totalSeconds = 0

	// draw the sqaure
	context.drawImage(squareImg.image, squareImg.x, squareImg.y, squareImg.width, squareImg.height)
	// draw the star
	context.drawImage(starImg.image, starImg.x, starImg.y, starImg.width, starImg.height)
}

// main
function main() {

	// no logic untill the elements are ready
	if (!backgroundImg.ready || !starImg.ready || !squareImg.ready) return

	// calculate elapsed time (seconds)
	const now = Date.now()
	const elapsed = (now - lastUpdate) / 1000

	// udpate elements
	updateElements(elapsed)
	// draw elements
	paintElements(elapsed)
	// update values
	updateScoreAndTime(String("0" + interval).slice(-2), score, bestScore)

	// update time
	lastUpdate = now
}

// control game time
function setTimer() {
	clock = setInterval(() => {
		// GAME OVER
		if (interval === 0) {
			clearInterval(clock)
			firstMove = true
			interval = GAME_DURATION
			score > bestScore ? bestScore = score : bestScore // Update best score
			score = 0
			return calculateFirstPositions()
		}

		// 1 less second
		interval--
	}, 1000)
}

// calculate positions
calculateFirstPositions()

// add key event listeners
addEventListeners()

// execute main program every 1 ms
setInterval(main, 16)

// show gamertag
changeGamertag();