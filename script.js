const canvas = document.querySelector("canvas")
const c = canvas.getContext("2d")
const p1 = document.querySelector(".p1")
const p2 = document.querySelector(".p2")
const winScreen = document.querySelector(".winner")
const title = document.querySelector(".title")
const scoreContainer = document.querySelector(".score-container")
const play = document.querySelector(".play")
const restart = document.querySelector(".restart")
let p1Score = 0
let aiScore = 0
let previousPoint
let animateCheck = 0

// canvas.width = innerWidth
// canvas.height = innerHeight
canvas.width = 1300
canvas.height = 700

addEventListener("resize", () => {
	// canvas.width = innerWidth
	// canvas.height = innerHeight

	init()
})

function randomIntFromRange(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min)
}

function randomColor(colors) {
	return colors[Math.floor(Math.random() * colors.length)]
}

// Objects
class Ball {
	constructor(x, y, radius, color) {
		this.x = x
		this.y = y
		this.dx = 7.5
		this.dy = randomIntFromRange(-5, 5)
		this.velocity = 1
		this.radius = radius
		this.color = color
	}

	draw() {
		c.beginPath()
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
		c.fillStyle = this.color
		c.fill()
		c.stroke()
		c.closePath()
	}

	update() {
		if (
			this.x - this.radius < paddle1.x + paddle1.width &&
			this.y - this.radius > paddle1.y &&
			this.y + this.radius < paddle1.y + paddle1.height
		) {
			this.dx = -this.dx
			this.velocity += 0.05
		}

		if (
			this.x + this.radius > paddle2.x &&
			this.y - this.radius > paddle2.y &&
			this.y + this.radius < paddle2.y + paddle2.height
		) {
			this.dx = -this.dx
			this.velocity += 0.05
		}

		if (this.y - this.radius <= 0 || this.y + this.radius >= canvas.height) {
			this.dy = -this.dy
		}

		this.x += this.dx * this.velocity
		this.y += this.dy * this.velocity

		if (this.x - this.radius <= 0) {
			aiScore++
			previousPoint = "AI"
			init()
		}

		if (this.x + this.radius >= canvas.width) {
			p1Score++
			previousPoint = "P1"
			init()
		}

		this.draw()
	}
}

class Paddle {
	constructor(x, y, width, height, color) {
		this.x = x
		this.y = y
		this.width = width
		this.height = height
		this.color = color
		this.moveIncrease = 20
	}

	draw() {
		c.beginPath()
		c.fillStyle = this.color
		c.fillRect(this.x, this.y, this.width, this.height)
		c.closePath()
	}

	aiControle() {
		if (
			ball.y - ball.radius < this.y &&
			this.x - ball.x < canvas.width / 2 &&
			this.y >= this.moveIncrease
		) {
			this.y -= 7
		}

		if (
			ball.y + ball.radius > this.y + this.height &&
			this.x - ball.x < canvas.width / 2 &&
			this.y + this.height <= canvas.height - this.moveIncrease
		) {
			this.y += 7
		}
	}

	update() {
		this.draw()
	}

	moveWithArrows() {
		addEventListener("keydown", e => {
			if (e.key === "ArrowDown" && this.y + this.height <= canvas.height - 15) {
				this.y += this.moveIncrease
			}
			if (e.key === "ArrowUp" && this.y >= 15) {
				this.y -= this.moveIncrease
			}
		})
	}

	moveWithWS() {
		addEventListener("keydown", e => {
			if (
				e.key === "s" &&
				this.y + this.height <= canvas.height - this.moveIncrease
			) {
				this.y += this.moveIncrease
			}
			if (e.key === "w" && this.y >= this.moveIncrease / 2) {
				this.y -= this.moveIncrease
			}
			console.log(e.key)
		})
	}
}

let ball
let ballX, ballY
let paddleY
let paddle1, paddle2
const paddleWidth = 25
const paddleHeight = 175
const color = "hsl(360,50%,100%)"

function init() {
	play.removeEventListener("click", gameStart)
	restart.removeEventListener("click", restartInit)

	ballX = canvas.width / 2
	ballY = canvas.height / 2

	paddleY = canvas.height / 2 - paddleHeight / 2

	p1.textContent = `${p1Score}`
	p2.textContent = `${aiScore}`

	ball = new Ball(ballX, ballY, 15, color)
	paddle1 = new Paddle(25, paddleY, paddleWidth, paddleHeight, color)
	paddle2 = new Paddle(
		canvas.width - 55,
		paddleY,
		paddleWidth,
		paddleHeight,
		color
	)
	paddle1.moveWithArrows()

	if (previousPoint === "AI") {
		ball.dx = -ball.dx
	}

	checkBallDy()
}

// Animation Loop
function animate() {
	if (animateCheck === 0) {
		requestAnimationFrame(animate)
		c.fillStyle = "rgba(10,10,10,0.8)"
		c.fillRect(0, 0, canvas.width, canvas.height)

		ball.update()
		paddle2.aiControle()
		paddle1.update()
		paddle2.update()
		if (checkWin() === true) {
			animateCheck = 1
		}
	}
}

function checkWin() {
	if (p1Score === 10) {
		c.clearRect(0, 0, canvas.width, canvas.height)
		winScreen.textContent = "P1 just won!"
		ball.x = undefined
		ball.y = undefined
		ball.dx = 0
		ball.dy = 0
		resetPoints()
		restartShow()
		restart.addEventListener("click", restartInit)
		return true
	} else if (aiScore === 10) {
		c.clearRect(0, 0, canvas.width, canvas.height)
		winScreen.textContent = "AI just won!"
		ball.x = undefined
		ball.y = undefined
		ball.dx = 0
		ball.dy = 0
		resetPoints()
		restartShow()
		restart.addEventListener("click", restartInit)
		return true
	}
}

function checkBallDy() {
	if (ball.dy >= -2 && ball.dy <= 2) {
		ball.dy = randomIntFromRange(-5, 5)
		checkBallDy()
	} else {
		return
	}
}

function resetPoints() {
	previousPoint = ""
	p1Score = 0
	aiScore = 0
}

function closeWinner() {
	winScreen.textContent = ""
}

function restartShow() {
	restart.setAttribute("style", "z-index: 20; opacity: 1;")
}

function restartInit() {
	animateCheck = 0
	restart.setAttribute("style", "opacity: 0;")
	closeWinner()
	init()
	animate()
}

function gameStart() {
	init()
	animate()
	resetPoints()
	closeWinner()
	scoreContainer.style.opacity = 1
	play.setAttribute("style", "opacity: 0; z-index: 15")
	title.style.opacity = 0
}

play.addEventListener("click", gameStart)
