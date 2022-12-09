const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')     //canvas context to call the canvas draw functions
const scoreElement = document.querySelector("#score")

canvas.width = innerWidth
canvas.height = innerHeight

class Boundary {
    static width = 40
    static height = 40

    constructor({ position, image }) {           //parameter passed through withn an obejct as a property, order of arguments does not matter no more
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
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'red'
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

const pellets = []
const boundaries = []
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
    ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
    ['|', '.', '1', '~', '2', '.', 'b', '.', '1', '-', '2', '.', '1', '-', '2', '.', '^', '.', '1', '-', '2', '.', '|'],
    ['|', '.', '*', '.', '_', '.', '.', '.', '*', '.', '*', '.', '*', ' ', '*', '.', '*', '.', '*', ' ', '*', '.', '|'],
    ['|', '.', '*', '.', '.', '.', '^', '.', '*', '.', '_', '.', '*', ' ', '*', '.', '*', '.', '*', ' ', '*', '.', '|'],
    ['|', '.', '4', '-', '2', '.', '*', '.', '*', '.', ' ', '.', '*', '-', '3', '.', '*', '.', '*', ' ', '*', '.', '|'],
    ['|', '.', '.', '.', '*', '.', '*', '.', '*', '.', '^', '.', '*', '.', '.', '.', '*', '.', '*', ' ', '*', '.', '|'],
    ['|', '.', '^', '.', '*', '.', '*', '.', '*', '.', '*', '.', '*', '.', '^', '.', '*', '.', '*', ' ', '*', '.', '|'],
    ['|', '.', '4', '-', '3', '.', '_', '.', '4', '-', '3', '.', '4', '-', '3', '.', '_', '.', '4', '-', '3', '.', '|'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
    ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3'],
]

function createImage(src) {
    const image = new Image()                       //creates html image elements
    image.src = src
    return image
}

map.forEach((row, i) => {                        //i and j are the associated indices of the symbol
    row.forEach((symbol, j) => {                 //nested loop to access the symbols
        switch (symbol) {
            case '-':
                boundaries.push(new Boundary({
                    position: {                 //positon property
                        x: Boundary.width * j,
                        y: Boundary.height * i
                    },
                    image: createImage('./assets/pipeHorizontal.png')
                }))
                break
            case '|':
                boundaries.push(new Boundary({
                    position: {                 //positon property
                        x: Boundary.width * j,
                        y: Boundary.height * i
                    },
                    image: createImage('./assets/pipeVertical.png')
                }))
                break
            case '1':
                boundaries.push(new Boundary({
                    position: {                 //positon property
                        x: Boundary.width * j,
                        y: Boundary.height * i
                    },
                    image: createImage('./assets/pipeCorner1.png')
                }))
                break
            case '2':
                boundaries.push(new Boundary({
                    position: {                 //positon property
                        x: Boundary.width * j,
                        y: Boundary.height * i
                    },
                    image: createImage('./assets/pipeCorner2.png')
                }))
                break
            case '3':
                boundaries.push(new Boundary({
                    position: {                 //positon property
                        x: Boundary.width * j,
                        y: Boundary.height * i
                    },
                    image: createImage('./assets/pipeCorner3.png')
                }))
                break
            case '4':
                boundaries.push(new Boundary({
                    position: {                 //positon property
                        x: Boundary.width * j,
                        y: Boundary.height * i
                    },
                    image: createImage('./assets/pipeCorner4.png')
                }))
                break
            case 'b':
                boundaries.push(new Boundary({
                    position: {                 //positon property
                        x: Boundary.width * j,
                        y: Boundary.height * i
                    },
                    image: createImage('./assets/block.png')
                }))
                break
            case '*':
                boundaries.push(new Boundary({
                    position: {                 //positon property
                        x: Boundary.width * j,
                        y: Boundary.height * i
                    },
                    image: createImage('./assets/pipeVertical.png')
                }))
                break
            case '~':
                boundaries.push(new Boundary({
                    position: {                 //positon property
                        x: Boundary.width * j,
                        y: Boundary.height * i
                    },
                    image: createImage('./assets/pipeHorizontal.png')
                }))
                break
            case '_':
                boundaries.push(new Boundary({
                    position: {                 //positon property
                        x: Boundary.width * j,
                        y: Boundary.height * i
                    },
                    image: createImage('./assets/capBottom.png')
                }))
                break
            case '<':
                boundaries.push(new Boundary({
                    position: {                 //positon property
                        x: Boundary.width * j,
                        y: Boundary.height * i
                    },
                    image: createImage('./assets/capLeft.png')
                }))
                break
            case '^':
                boundaries.push(new Boundary({
                    position: {                 //positon property
                        x: Boundary.width * j,
                        y: Boundary.height * i
                    },
                    image: createImage('./assets/capTop.png')
                }))
                break
            case '>':
                boundaries.push(new Boundary({
                    position: {                 //positon property
                        x: Boundary.width * j,
                        y: Boundary.height * i
                    },
                    image: createImage('./assets/capRight.png')
                }))
                break
            case 'r':
                boundaries.push(new Boundary({
                    position: {                 //positon property
                        x: Boundary.width * j,
                        y: Boundary.height * i
                    },
                    image: createImage('./assets/pipeConnectorRight.png')
                }))
                break
            case '.':
                pellets.push(new Pellet({
                    position: {                 //positon property
                        x: Boundary.width * j + Boundary.width / 2,
                        y: Boundary.height * i + Boundary.height / 2
                    }
                }))
                break
        }
    })
})

function collisionDetection({ circle, rectangle }) {
    return (circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height
        && circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x
        && circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y
        && circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width)
}

function animate() {
    requestAnimationFrame(animate)
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
    for (let i = pellets.length - 1; 0 < i; i--) {
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
