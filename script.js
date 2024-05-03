const canvas = document.querySelector(".myCanvas");
const width = canvas.width = Math.min(2 * window.innerWidth/3, 800);
const height = canvas.height = window.innerHeight/2;
const ctx = canvas.getContext("2d");

const gravity = 1;
var score = 0;
var highscore = 0;
var gameOver = false;
var startGame = true;

window.setInterval(increaseScore, 500);

function increaseScore() {
    
    if (!gameOver && !startGame) {
        score += 1;
    }
}

class Player {
    constructor(x, y, color, width, height) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.color = color;
        this.height = height;
        this.width = width;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    
}

class Obstacle {
    constructor(id, x, y, color, width, height) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.color = color;
        this.height = height;
        this.width = width;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

}

document.addEventListener("keydown", (event) => {
    if(event.key == " ") {
        if (startGame) {
            startGame = false;
            player.vy = -14;
        } else if (gameOver) {
            gameOver = false;
            startGame = true;
            score = 0;
            for (let obstacle of obstacles) {
                obstacle.x = width + Math.random() * 400;
            }
            for (let obstacle of obstacles) {
                spaceObstacles(obstacle, obstacles);
            }
        } else if (player.vy == 0 && player.y == height - 50) {
            player.vy = -14;
        }
    }
});

function spaceObstacles(obstacle, obstacles) {
    while ((obstacles[0].id != obstacle.id && Math.abs(obstacles[0].x - obstacle.x) < 175) || 
            (obstacles[1].id != obstacle.id && Math.abs(obstacles[1].x - obstacle.x) < 175) || 
            (obstacles[2].id != obstacle.id && Math.abs(obstacles[2].x - obstacle.x) < 175)) {
        obstacle.x += 100;
    }
}

function collision(player, obstacle) {
    if (((player.x + player.width > obstacle.x && player.x < obstacle.x) || (obstacle.x + obstacle.width > player.x && obstacle.x < player.x)) && player.y  + player.height > obstacle.y) {
        return true;
    }
    return false;
}

function run() {
    ctx.fillStyle = "rgb(0 0 0)";
    ctx.fillRect(0, 0, width, height);

    player.vy += gravity;
    player.y += player.vy;

    if (player.y > height - 50) {
        player.vy = 0;
        player.y = height - 50;
    }

    if (!gameOver && !startGame) {
        for (let obstacle of obstacles) {
            obstacle.x -= 7 + score/60;
            if (obstacle.x < -10) {
                obstacle.x = width + Math.random() * 400;
                spaceObstacles(obstacle, obstacles);
            }

            if (collision(player, obstacle)) {
                gameOver = true;
            }

        }

        highscore = Math.max(highscore, score);
    }
    if (gameOver) {
        ctx.fillStyle = "white";
        ctx.font = "50px arial";ctx.fillText("Game Over", width/2 - 150, height/2);
    }
    
    player.draw();
    for (let obstacle of obstacles) {
        obstacle.draw();
    }

    ctx.fillStyle = "white";
    ctx.font = "20px arial";
    ctx.fillText("Score: " + score + " Highscore: " + highscore, 20, 40);

    requestAnimationFrame(run);
}

const player = new Player(20, height - 50, "white", 20, 50);

var obstacle1 = new Obstacle(1, width + Math.random() * 400, height - 40, "green", 20, 40);
var obstacle2 = new Obstacle(2, width + Math.random() * 800, height - 20, "green", 40, 20);
var obstacle3 = new Obstacle(3, width + Math.random() * 1200, height - 20, "green", 20, 20);
const obstacles = [obstacle1, obstacle2, obstacle3];
for (let obstacle of obstacles) {
    spaceObstacles(obstacle, obstacles);
}

run();