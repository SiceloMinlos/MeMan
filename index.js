const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')     //canvas context to call the canvas draw functions
const scoreElement = document.querySelector("#score")

canvas.width = innerWidth
canvas.height = innerHeight

class Boundary {
    static width = 40
    static height = 40

    constructor({ position, image }) {           //parameter passed through within an object as a property, order of arguments does not matter no more
        this.position = position
        this.width = Boundary.width
        this.height = Boundary.height
        this.image = image
    }

    draw() {
        // ctx.fillStyle = 'blue'
        // ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
        ctx.drawImage(this.image, this.position.x, this.position.y)
    }
}

class Player {
    constructor({
        position,
        velocity
    }) {
        this.position = position
        this.velocity = velocity
        this.radius = 15
        this.radians = 0.75
        this.openrate = 0.12
        this.rotatation = 0
    }

    draw() {
        ctx.save()
        ctx.translate(this.position.x, this.position.y)
        ctx.rotate(this.rotatation)
        ctx.translate(-this.position.x, -this.position.y)

        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, this.radians, Math.PI * 2 - this.radians)
        ctx.lineTo(this.position.x, this.position.y)
        ctx.fillStyle = 'red'
        ctx.fill()
        ctx.closePath()
        ctx.restore()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.radians < 0 || this.radians > 0.75) {
            this.openrate = -this.openrate
        }
        this.radians += this.openrate
    }
}

class Ghost {
    static speed = 2
    constructor({
        position,
        velocity,
        color = 'pink',
    }) {
        this.position = position
        this.velocity = velocity
        this.radius = 15
        this.color = color
        this.previousCollision = []
        this.speed = 2
        this.scared = false
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.scared ? 'blue' : this.color       //turynery??? if scared is true, fillstyle sholud be blue else fillstyle sholud be this.color
        ctx.fill()
        ctx.closePath()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Pellet {
    constructor({
        position
    }) {
        this.position = position
        this.radius = 3
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'white'
        ctx.fill()
        ctx.closePath()
    }
}

class PowerUp {
    constructor({
        position
    }) {
        this.position = position
        this.radius = 7
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'white'
        ctx.fill()
        ctx.closePath()
    }
}

const pellets = []
const powerUps = []
const boundaries = []
const ghosts = [
    new Ghost({
        position: {
            x: Boundary.width * 5 + Boundary.width / 2,
            y: Boundary.height + Boundary.height / 2
        },
        velocity: {
            x: Ghost.speed,
            y: 0
        }
    }),
    new Ghost({
        position: {
            x: Boundary.width * 10 + Boundary.width / 2,
            y: Boundary.height * 11 + Boundary.height / 2
        },
        velocity: {
            x: Ghost.speed,
            y: 0
        },
        color: 'green'
    }),
    new Ghost({
        position: {
            x: Boundary.width * 7 + Boundary.width / 2,
            y: Boundary.height * 7 + Boundary.height / 2
        },
        velocity: {
            x: Ghost.speed,
            y: 0
        },
        color: 'brown'
    }),
    new Ghost({
        position: {
            x: Boundary.width * 7 + Boundary.width / 2,
            y: Boundary.height + Boundary.height / 2
        },
        velocity: {
            x: Ghost.speed,
            y: 0
        },
        color: 'yellow'
    })
]

const player = new Player({                     //Player object
    position: {
        x: Boundary.width + Boundary.width / 2,
        y: Boundary.height + Boundary.height / 2
    },
    velocity: {
        x: 0,
        y: 0
    }
})

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

let lastKey = ''
let score = 0;

const map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, '*', 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, '*', 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, '*', 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

function createImage(src) {
    const image = new Image()                       //creates html image elements
    image.src = src
    return image
}

map.forEach((row, i) => {                        //i and j are the associated indices of the symbol
    row.forEach((symbol, j) => {                 //nested loop to access the symbols
        switch (symbol) {
            case 1:
                boundaries.push(new Boundary({
                    position: {                 //position property
                        x: Boundary.width * j,
                        y: Boundary.height * i
                    },
                    image: createImage('./assets/wall.png')
                }))
                break
            case 2:
                pellets.push(new Pellet({
                    position: {                 //position property
                        x: Boundary.width * j + Boundary.width / 2,
                        y: Boundary.height * i + Boundary.height / 2
                    }
                }))
                break
            case '*':
                powerUps.push(new PowerUp({
                    position: {                 //position property
                        x: Boundary.width * j + Boundary.width / 2,
                        y: Boundary.height * i + Boundary.height / 2
                    }
                }))
                break
        }
    })
})

function collisionDetection({ circle, rectangle }) {
    const padding = Boundary.width / 2 - circle.radius - 1
    return (circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height + padding
        && circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x - padding
        && circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y - padding
        && circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width + padding)
}

let animationId

function animate() {
    let animationId = requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (keys.w.pressed && lastKey === 'w') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (collisionDetection({
                circle: {
                    ...player,              //...spread operator, player properties can easily be changed this way
                    velocity: {
                        x: 0,
                        y: -5
                    }
                },
                rectangle: boundary
            })) {
                player.velocity.y = 0
                break
            } else {
                player.velocity.y = -5
            }
        }
    } else if (keys.a.pressed && lastKey === 'a') {

        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (collisionDetection({
                circle: {
                    ...player,              //...spread operator, player properties can easily be changed this way
                    velocity: {
                        x: -5,
                        y: 0
                    }
                },
                rectangle: boundary
            })) {
                player.velocity.x = 0
                break
            } else {
                player.velocity.x = -5
            }
        }

    } else if (keys.s.pressed && lastKey === 's') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (collisionDetection({
                circle: {
                    ...player,              //...spread operator, player properties can easily be changed this way
                    velocity: {
                        x: 0,
                        y: 5
                    }
                },
                rectangle: boundary
            })) {
                player.velocity.y = 0
                break
            } else {
                player.velocity.y = 5
            }
        }
    } else if (keys.d.pressed && lastKey === 'd') {

        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (collisionDetection({
                circle: {
                    ...player,              //...spread operator, player properties can easily be changed this way
                    velocity: {
                        x: 5,
                        y: 0
                    }
                },
                rectangle: boundary
            })) {
                player.velocity.x = 0
                break
            } else {
                player.velocity.x = 5
            }
        }
    }

    //ghosts eating
    for (let i = ghosts.length - 1; 0 <= i; i--) {
        const ghost = ghosts[i]
        if (Math.hypot(ghost.position.x - player.position.x, ghost.position.y - player.position.y) < ghost.radius + player.radius) {
            if (ghost.scared) {
                ghosts.splice(i, 1)
            } else {
                cancelAnimationFrame(animationId)
                console.log("Sorry bruv, you lose :(")
            }

        }
    }

    if (pellets.length === 0) {
        console.log("You win bruv")
        cancelAnimationFrame(animationId)
        
    }


    //powerups
    for (let i = powerUps.length - 1; 0 <= i; i--) {
        const powerUp = powerUps[i]
        powerUp.draw()

        //touch powerup
        if (Math.hypot(powerUp.position.x - player.position.x, powerUp.position.y - player.position.y) < powerUp.radius + player.radius) {
            powerUps.splice(i, 1)
            //scare them ghosts
            ghosts.forEach(ghost => {
                ghost.scared = true

                setTimeout(() => {
                    ghost.scared = false
                }, 9000)
            })
        }
    }

    //touching pellets
    for (let i = pellets.length - 1; 0 <= i; i--) {
        const pellet = pellets[i]
        pellet.draw()

        if (Math.hypot(pellet.position.x - player.position.x, pellet.position.y - player.position.y) < pellet.radius + player.radius) {
            pellets.splice(i, 1)
            score += 10
            scoreElement.innerHTML = score
        }
    }


    boundaries.forEach((boundary) => {            //for each boundary, draw it
        boundary.draw()

        if (collisionDetection({
            circle: player,
            rectangle: boundary
        })) {
            player.velocity.x = 0
            player.velocity.y = 0
        }
    })

    player.update()

    ghosts.forEach((ghost) => {
        ghost.update()

        if (Math.hypot(ghost.position.x - player.position.x, ghost.position.y - player.position.y) < ghost.radius + player.radius && !ghost.scared) {
            cancelAnimationFrame(animationId)
            console.log("Sorry bruv, you lose :(")
        }


        const collisions = []
        boundaries.forEach((boundary) => {
            if (!collisions.includes('right') && collisionDetection({
                circle: {
                    ...ghost,              //...spread operator, player properties can easily be changed this way
                    velocity: {
                        x: ghost.speed,
                        y: 0
                    }
                },
                rectangle: boundary
            })) {
                collisions.push('right')
            }
            else if (!collisions.includes('left') && collisionDetection({
                circle: {
                    ...ghost,              //...spread operator, player properties can easily be changed this way
                    velocity: {
                        x: -ghost.speed,
                        y: 0
                    }
                },
                rectangle: boundary
            })) {
                collisions.push('left')
            }
            else if (!collisions.includes('up') && collisionDetection({
                circle: {
                    ...ghost,              //...spread operator, player properties can easily be changed this way
                    velocity: {
                        x: 0,
                        y: -ghost.speed
                    }
                },
                rectangle: boundary
            })) {
                collisions.push('up')
            }
            else if (!collisions.includes('down') && collisionDetection({
                circle: {
                    ...ghost,              //...spread operator, player properties can easily be changed this way
                    velocity: {
                        x: 0,
                        y: ghost.speed
                    }
                },
                rectangle: boundary
            })) {
                collisions.push('down')
            }
        })

        if (collisions.length > ghost.previousCollision.length)
            ghost.previousCollision = collisions

        if (JSON.stringify(collisions) !== JSON.stringify(ghost.previousCollision)) {

            if (ghost.velocity.x > 0) {
                ghost.previousCollision.push('right')
            } else if (ghost.velocity.x < 0) {
                ghost.previousCollision.push('left')
            } else if (ghost.velocity.y < 0) {
                ghost.previousCollision.push('up')
            } else if (ghost.velocity.y > 0) {
                ghost.previousCollision.push('down')
            }

            const pathway = ghost.previousCollision.filter((collision) => {
                return !collisions.includes(collision)
            })

            const direction = pathway[Math.floor(Math.random() * pathway.length)]

            switch (direction) {
                case 'left':
                    ghost.velocity.x = -ghost.speed
                    ghost.velocity.y = 0
                    break

                case 'right':
                    ghost.velocity.x = ghost.speed
                    ghost.velocity.y = 0
                    break

                case 'up':
                    ghost.velocity.x = 0
                    ghost.velocity.y = -ghost.speed
                    break

                case 'down':
                    ghost.velocity.x = 0
                    ghost.velocity.y = ghost.speed
                    break
            }

            ghost.previousCollision = []
        }

        // console.log(collisions)
    })

    if (player.velocity.x > 0) {
        player.rotatation = 0
    } else if (player.velocity.x < 0) {
        player.rotatation = Math.PI
    }  else if (player.velocity.y > 0) {
        player.rotatation = Math.PI / 2
    }  else if (player.velocity.y < 0) {
        player.rotatation = Math.PI * 1.5
    }

}

animate()

window.addEventListener('keyup', ({ key }) => {          //{} destructures the event property
    switch (key) {
        case 'w':
            keys.w.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 's':
            keys.s.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
    }
})


window.addEventListener('keydown', ({ key }) => {          //{} destructures the event property
    switch (key) {
        case 'w':
            keys.w.pressed = true
            lastKey = 'w'
            break
        case 'a':
            keys.a.pressed = true
            lastKey = 'a'
            break
        case 's':
            keys.s.pressed = true
            lastKey = 's'
            break
        case 'd':
            keys.d.pressed = true
            lastKey = 'd'
            break
    }
})
