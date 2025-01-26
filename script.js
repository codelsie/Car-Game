const score = document.querySelector(".score");
const startScreen = document.querySelector(".startScreen");
const gameArea = document.querySelector(".gameArea");

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

let player = {
    speed: 5,
};

startScreen.addEventListener("click", startGame);

let keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
};

// Variables for touch/swipe controls
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

gameArea.addEventListener("touchstart", handleTouchStart);
gameArea.addEventListener("touchmove", handleTouchMove);
gameArea.addEventListener("touchend", handleTouchEnd);

function keyDown(e) {
    e.preventDefault();
    keys[e.key] = true;
}
function keyUp(e) {
    e.preventDefault();
    keys[e.key] = false;
}

// Handle touch start
function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}

// Handle touch move
function handleTouchMove(e) {
    e.preventDefault(); // Prevent default touch behavior

    touchEndX = e.touches[0].clientX;
    touchEndY = e.touches[0].clientY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    // Update the car's position based on the swipe
    player.x += deltaX * 0.1; // Adjust multiplier for sensitivity
    player.y += deltaY * 0.1;

    // Constrain car within the game area
    let road = gameArea.getBoundingClientRect();
    player.x = Math.max(0, Math.min(player.x, road.width - 70)); // Prevent going outside left/right
    player.y = Math.max(road.top + 150, Math.min(player.y, road.bottom - 80)); // Prevent going outside top/bottom

    // Update touch start positions for smooth continuous movement
    touchStartX = touchEndX;
    touchStartY = touchEndY;

    // Update car position instantly
    let car = document.querySelector(".car");
    car.style.left = `${player.x}px`;
    car.style.top = `${player.y}px`;
}

// Handle touch end (reset swipe controls)
function handleTouchEnd() {
    // Reset keys after touch ends
    keys.ArrowUp = false;
    keys.ArrowDown = false;
    keys.ArrowLeft = false;
    keys.ArrowRight = false;
}

function gamePlay() {
    let car = document.querySelector(".car");
    let road = gameArea.getBoundingClientRect();

    if (player.start) {
        moveLines();
        moveEnemyCar(car);

        if (keys.ArrowUp && player.y > road.top + 150) {
            player.y -= player.speed;
        }
        if (keys.ArrowDown && player.y < road.bottom - 80) {
            player.y += player.speed;
        }
        if (keys.ArrowLeft && player.x > 0) {
            player.x -= player.speed;
        }
        if (keys.ArrowRight && player.x < road.width - 70) {
            player.x += player.speed;
        }

        car.style.top = `${player.y}px`;
        car.style.left = `${player.x}px`;

        window.requestAnimationFrame(gamePlay);

        player.score++;

        score.innerHTML = "Score: " + player.score;
    }
}

function moveLines() {
    let lines = document.querySelectorAll(".line");
    lines.forEach((line, index) => {
        if (line.y >= 700) {
            line.y -= 750;
        }
        line.y += player.speed;
        line.style.top = line.y + "px";
    });
}

function isCollide(car, enemyCar) {
    carRect = car.getBoundingClientRect();
    enemyCarRect = enemyCar.getBoundingClientRect();

    return !(
        carRect.top > enemyCarRect.bottom ||
        carRect.left > enemyCarRect.right ||
        carRect.right < enemyCarRect.left ||
        carRect.bottom < enemyCarRect.top
    );
}

function moveEnemyCar(car) {
    let enemyCars = document.querySelectorAll(".enemyCar");
    enemyCars.forEach((enemyCar, index) => {
        if (isCollide(car, enemyCar)) {
            endGame();
        }

        if (enemyCar.y >= 750) {
            enemyCar.y = -300;
            enemyCar.style.left = Math.floor(Math.random() * 350) + "px";
        }
        enemyCar.y += player.speed;
        enemyCar.style.top = enemyCar.y + "px";
    });
}

function startGame() {
    score.classList.remove("hide");
    startScreen.classList.add("hide");
    gameArea.innerHTML = "";

    player.start = true;
    player.score = 0;
    window.requestAnimationFrame(gamePlay);

    for (let i = 0; i < 5; i++) {
        let roadLine = document.createElement("div");
        roadLine.setAttribute("class", "line");
        roadLine.y = i * 150;
        roadLine.style.top = roadLine.y + "px";
        gameArea.appendChild(roadLine);
    }

    let car = document.createElement("div");
    car.setAttribute("class", "car");

    gameArea.appendChild(car);

    player.x = car.offsetLeft;
    player.y = car.offsetTop;

    for (let i = 0; i < 3; i++) {
        let enemyCar = document.createElement("div");
        enemyCar.setAttribute("class", "enemyCar");
        enemyCar.y = (i + 1) * 350 * -1;
        enemyCar.style.top = enemyCar.y + "px";
        enemyCar.style.backgroundImage = `url("./images/car${i + 1}.png")`;
        enemyCar.style.left = Math.floor(Math.random() * 350) + "px";
        gameArea.appendChild(enemyCar);
    }
}

function endGame() {
    player.start = false;
    startScreen.classList.remove("hide");
}
