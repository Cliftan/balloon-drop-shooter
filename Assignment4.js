var wheelAngle = 0;   
var turretAngle = 0;  
var left = 0;         
var cannonballLeft; 
var cannonballTop;  
var shootingAngle;  
var inShooting = 0; 
var MySpeed;        
var score = 0;
var lives = 5;
var balloonLeft, balloonTop;
var balloonDropping = false;
var scoreDisplay = document.getElementById("score");
var livesDisplay = document.getElementById("lives");

var balloonSpeed = 2;  // Balloon drops at 2 pixels per 10 ms

function init() {   
    var h = window.innerHeight - 150;
    MySpeed = document.getElementById("speed").valueAsNumber;
    MyCannon.style.top = h + "px";          
    if (left > (window.innerWidth - 270)) { 
        left = window.innerWidth - 270;     
        MyCannon.style.left = left + "px";
    }
    cannonballTop = 9 + Math.sign(turretAngle) * Math.sin(Math.abs(turretAngle) * Math.PI / 180) * (152 - 32);
    cannonballLeft = 220 - (152 - Math.cos(Math.abs(turretAngle) * Math.PI / 180) * 152);
}

function rotateWheel(direction) {       
    wheelAngle += 4 * MySpeed * direction;    
    document.getElementById("wheel").style.rotate = wheelAngle + "deg";
}

function rotateTurret(direction) {  
    turretAngle += 3 * direction;       
    MyTurret.style.rotate = turretAngle + "deg";
    if (!inShooting) {              
        cannonballTop = 9 + Math.sign(turretAngle) * Math.sin(Math.abs(turretAngle) * Math.PI / 180) * (152 - 32);
        cannonballLeft = 220 - (152 - Math.cos(Math.abs(turretAngle) * Math.PI / 180) * 152);
        MyCannonball.style.top = cannonballTop + "px";
        MyCannonball.style.left = cannonballLeft + "px";
    }
}

function shoot() {
    if (cannonballTop <= 150 && cannonballTop >= 150 - window.innerHeight && cannonballLeft <= window.innerWidth - left) {
        if (!inShooting) shotAudio.play();
        inShooting = 1;
        cannonballTop -= 10 * Math.sin(shootingAngle * Math.PI / 180);
        cannonballLeft += 10 * Math.cos(shootingAngle * Math.PI / 180);
        MyCannonball.style.top = cannonballTop + "px";
        MyCannonball.style.left = cannonballLeft + "px";
        setTimeout(shoot, 10);
    } else {
        inShooting = 0;
        MyCannonball.style.visibility = "hidden";
        cannonballTop = 9 + Math.sign(turretAngle) * Math.sin(Math.abs(turretAngle) * Math.PI / 180) * (152 - 32);
        cannonballLeft = 220 - (152 - Math.cos(Math.abs(turretAngle) * Math.PI / 180) * 152);
        shotAudio.pause();
        shotAudio.currentTime = 0;
    }
}

function processKey(event) {
    switch (event.code) {
        case "ArrowLeft":
            if (left >= 4 * MySpeed) {
                left -= 4 * MySpeed;
                MyCannon.style.left = left + "px";
                rotateWheel(-1);
            }
            break;
        case "ArrowRight":
            if (left <= (window.innerWidth - 270)) {
                left += 4 * MySpeed;
                MyCannon.style.left = left + "px";
                rotateWheel(1);
            }
            break;
        case "ArrowUp":
            if (turretAngle >= -35) rotateTurret(-1);
            break;
        case "ArrowDown":
            if (turretAngle <= 20) rotateTurret(1);
            break;
        case "Space":
            if (!inShooting) { 
                MyCannonball.style.visibility = "visible";
                shootingAngle = -turretAngle;
                shoot();
            }    
            break;
    }
}

function startBalloonDrop() {
    if (!balloonDropping) {
        balloonLeft = Math.random() * (window.innerWidth - 100); 
        balloonLeft = Math.max(balloonLeft, 270);  // Make sure the balloon is not too close to the left side
        balloonTop = 0;  
        MyBalloon.style.left = balloonLeft + "px";
        MyBalloon.style.top = balloonTop + "px";
        MyBalloon.style.display = "block";
        balloonDropping = true;
        dropBalloon();
    }
}

function dropBalloon() {
    if (balloonDropping) {
        balloonTop += balloonSpeed;
        MyBalloon.style.top = balloonTop + "px";
        
        // Check for collision with cannonball
        if (checkCollision(balloonLeft, balloonTop)) {
            hitBalloon();
        }

        // If balloon hits the bottom of the screen
        if (balloonTop >= window.innerHeight - 150) {
            balloonDrops();
        } else {
            setTimeout(dropBalloon, 10);  // Continue dropping the balloon
        }
    }
}

function checkCollision(balloonLeft, balloonTop) {
    var balloonRect = MyBalloon.getBoundingClientRect();
    var cannonballRect = MyCannonball.getBoundingClientRect();

    return !(balloonRect.right < cannonballRect.left ||
        balloonRect.left > cannonballRect.right ||
        balloonRect.bottom < cannonballRect.top ||
        balloonRect.top > cannonballRect.bottom);
}

function hitBalloon() {
    explosion.style.left = balloonLeft - 10 + "px";
    explosion.style.top = balloonTop - 10 + "px";
    explosion.style.display = "block";
    explosionaudio.play();
    MyBalloon.style.display = "none";
    balloonDropping = false;
    MyBalloon.style.display = "none";

    score++;
    document.getElementById("score").textContent = score;

    // Stop the cannonball immediately by resetting its position
    inShooting = 0;
    MyCannonball.style.visibility = "hidden";
    cannonballTop = 9 + Math.sign(turretAngle) * Math.sin(Math.abs(turretAngle) * Math.PI / 180) * (152 - 32);
    cannonballLeft = 220 - (152 - Math.cos(Math.abs(turretAngle) * Math.PI / 180) * 152);
    MyCannonball.style.top = cannonballTop + "px";
    MyCannonball.style.left = cannonballLeft + "px";

    setTimeout(() => {
        explosion.style.display = "none";
        startBalloonDrop();  // Start a new balloon drop after the explosion
    }, 500);
}

function balloonDrops() {
    MyBalloon.style.display = "none";
    balloonDropping = false;
    lives = lives - 1;
    document.getElementById("lives").textContent = lives;

    if (lives <= 0) {
        document.getElementById("lives").textContent = "Game Over";
    } else {
        setTimeout(startBalloonDrop, 1000);  // Start a new balloon drop after explosion
    }
}

init();
startBalloonDrop();
