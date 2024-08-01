const canvas = document.querySelector("canvas");
const body = document.querySelector("body");
const c2d = canvas.getContext("2d");

canvas.style.backgroundColor = "black";
canvas.width = 800;
canvas.height = 600;

c2d.fillStyle = "yellowGreen";

body.style.margin = 0;

class Player {
  constructor({ pos, dir, scale, speed }) {
    this.pos = pos;
    this.dir = dir;
    this.scale = scale;
    this.speed = speed;
  }

  update() {
    this.draw();
    !this.detectWalls()
      ? (this.pos.y += this.dir.y * this.speed)
      : (this.dir.y = 0);
  }

  draw() {
    c2d.fillRect(this.pos.x, this.pos.y, this.scale.x, this.scale.y);
  }

  detectWalls() {
    if (this.dir.y > 0) return this.pos.y + this.scale.y >= canvas.height;
    if (this.dir.y < 0) return this.pos.y <= 0;
  }
}

class Ball {
  constructor({ pos, dir, scale, speed, playerL, playerR }) {
    this.pos = pos;
    this.dir = dir;
    this.scale = scale;
    this.speed = speed;
    this.playerL = playerL;
    this.playerR = playerR;
    this.collider = null;

    this.init();
  }

  init() {
    this.setInitialDir();
  }

  update() {
    this.draw();
    this.detectCollisions();
    this.pos.x += this.dir.x * this.speed;
    this.pos.y += this.dir.y * this.speed;
  }

  draw() {
    c2d.beginPath();
    c2d.arc(this.pos.x, this.pos.y, this.scale.x, 0, Math.PI * 2, false);
    c2d.fill();
  }

  setInitialDir() {
    const maxAngle = Math.PI / 4;
    const randomAngle = Math.random() * (maxAngle * 2) - maxAngle;
    const headingTo = Math.random() > 0.5 ? 1 : -1;

    this.dir.x = Math.cos(randomAngle) * headingTo;
    this.dir.y = Math.sin(randomAngle);
  }

  detectCollisions() {
    this.collider = {
      xR: this.pos.x + this.scale.x,
      yB: this.pos.y + this.scale.y,
      xL: this.pos.x - this.scale.x,
      yT: this.pos.y - this.scale.y,
    };

    this.detectWalls();
    this.detectPlayers();
  }

  detectPlayers() {
    const hitRPlayer =
      this.collider.xR >= this.playerR.pos.x &&
      this.collider.xR <= this.playerR.pos.x + this.playerR.scale.x &&
      this.collider.yT <= this.playerR.pos.y + this.playerR.scale.y &&
      this.collider.yB >= this.playerR.pos.y &&
      this.dir.x > 0;

    const hitLPlayer =
      this.collider.xL >= this.playerL.pos.x &&
      this.collider.xL <= this.playerL.pos.x + this.playerL.scale.x &&
      this.collider.yT <= this.playerL.pos.y + this.playerL.scale.y &&
      this.collider.yB >= this.playerL.pos.y &&
      this.dir.x < 0;

    if (hitRPlayer || hitLPlayer) this.dir.x *= -1;
  }

  detectWalls() {
    const hitRWall = this.collider.xR >= canvas.width;
    const hitLWall = this.collider.xL <= 0;
    const hitBWall = this.collider.yB >= canvas.height;
    const hitTWall = this.collider.yT <= 0;

    if (hitRWall || hitLWall) {
      this.pos.y = canvas.height - this.pos.y;
      this.dir.x *= -1;
    }
    if (hitBWall || hitTWall) this.dir.y *= -1;
  }
}

const playerL = new Player({
  pos: { x: 100, y: canvas.height / 2 - 35 },
  dir: { x: 0, y: 0 },
  scale: { x: 7, y: 70 },
  speed: 5,
});

const playerR = new Player({
  pos: { x: canvas.width - 7 - 100, y: canvas.height / 2 - 35 },
  dir: { x: 0, y: 0 },
  scale: { x: 7, y: 70 },
  speed: 5,
});

const ball = new Ball({
  pos: { x: canvas.width / 2, y: canvas.height / 2 },
  dir: { x: 0, y: 0 },
  scale: { x: 4, y: 4 },
  speed: 7,
  playerL,
  playerR,
});

function update() {
  c2d.clearRect(0, 0, canvas.width, canvas.height);
  c2d.fillRect(canvas.width / 2 - 0.5, 0, 1, canvas.height);
  playerL.update();
  playerR.update();
  ball.update();
  requestAnimationFrame(update);
}

update();

addEventListener("keydown", ({ code }) => {
  switch (code.replace("Key", "")) {
    case "W":
      playerL.dir.y = -1;
      break;
    case "S":
      playerL.dir.y = +1;
      break;
    case "I":
      playerR.dir.y = -1;
      break;
    case "K":
      playerR.dir.y = +1;
      break;
  }
});
