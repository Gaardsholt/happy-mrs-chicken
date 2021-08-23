class Stuff {
  constructor(data) {
    this.src = data.src;
    this.x = data.x;
    this.y = data.y;
  }
}

var game = {
  canvas: document.getElementById("canvas"),
  ctx: {},
  speed: 5,
  stuffOnCanvas: [],
  keys: {},
  player: new Stuff({
    x: 10,
    y: 10,
    src: "kylling_1"
  }),
  points: 0,
  Start: function () {
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    var playerImg = document.getElementById(this.player.src);
    this.player.x = Math.max(0, Math.floor(Math.random() * (this.canvas.width - playerImg.width)) - playerImg.width);
    this.player.y = Math.max(0, Math.floor(Math.random() * (this.canvas.height - playerImg.height)) - playerImg.height);


    this.addEventListener();
    this.loop();
  },
  loop: function () {
    game.walk();
    game.draw();

    window.requestAnimationFrame(game.loop);
  },
  space: function () {
    let playerImg = document.getElementById(this.player.src);
    let eggImg = document.getElementById("egg");

    let x = this.player.x + (eggImg.width / 2);
    let y = this.player.y + (playerImg.height - (eggImg.height / 2));

    setTimeout(function () {
      game.stuffOnCanvas.push(new Stuff({
        x: x,
        y: y,
        src: "egg"
      }));
      game.points++;
    }, 200);
  },
  addEventListener: function () {
    window.addEventListener("keydown", function (e) {
      if (e.code === "Space") {
        game.space();
        e.preventDefault();
      }
      if (["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
        game.keys[e.code] = true;
        e.preventDefault();
      }
    });
    window.addEventListener("keyup", function (e) {
      delete game.keys[e.code];
    });


    // Touch stuff
    this.canvas.addEventListener("mouseup", function (e) {
      let image = document.getElementById(game.player.src);

      pos = game.getMousePos(game.canvas, e);
      game.player.x = pos.x - (image.width / 2);
      game.player.y = pos.y - (image.height / 2);
      game.space();
    }, false);
    this.canvas.addEventListener("touchend", function (e) {
      let mouseEvent = new MouseEvent("mouseup", {});
      game.canvas.dispatchEvent(mouseEvent);
    }, false);
  },
  getMousePos: function (canvasDom, mouseEvent) {
    let rect = canvasDom.getBoundingClientRect();
    return {
      x: mouseEvent.clientX - rect.left,
      y: mouseEvent.clientY - rect.top
    };
  },
  walk: function () {
    if ("ArrowLeft" in this.keys) {
      this.player.x -= this.speed;
    }
    if ("ArrowRight" in this.keys) {
      this.player.x += this.speed;
    }
    if ("ArrowUp" in this.keys) {
      this.player.y -= this.speed;
    }
    if ("ArrowDown" in this.keys) {
      this.player.y += this.speed;
    }
  },
  drawImage: function (img) {
    let image = document.getElementById(img.src);
    this.ctx.drawImage(image, img.x, img.y);
  },
  drawStuff: function () {
    this.stuffOnCanvas.forEach(stuff => {
      this.drawImage(stuff);
    });
  },
  drawPlayer: function () {
    this.drawImage(this.player);
  },
  draw: function () {
    this.ctx.fillStyle = "#77dcff";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.updateScore();
    this.drawStuff();
    this.drawPlayer();
  },
  updateScore: function () {
    this.ctx.font = "60px Arial";
    this.ctx.fillStyle = "white";

    let width = this.ctx.measureText(this.getPointsFormatted()).width;
    let height = parseInt(this.ctx.font.substring(0, 2));


    this.ctx.fillText(this.getPointsFormatted(), this.canvas.width - width - 10, height);
  },
  getPointsFormatted: function () {
    let num = this.points;

    return `${"0".repeat(Math.max(0, 3 - num.toString().length))}${num}`
  }
}
