class Stuff {
  constructor(data) {
    this.src = data.src;
    this.x = data.x;
    this.y = data.y;
  }
}

let game = {
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
  Start: function() {
    game.ctx = game.canvas.getContext("2d");
    game.canvas.width = window.innerWidth;
    game.canvas.height = window.innerHeight;

    // this.player.x = this.canvas.width

    game.addEventListener();
    game.loop();
  },
  loop: function() {
    game.walk();
    game.draw();

    window.requestAnimationFrame(game.loop);
  },
  space: function() {
    var playerImg = document.getElementById(game.player.src);
    var eggImg = document.getElementById("egg");

    var x = game.player.x + (eggImg.width/2);
    var y = game.player.y + (playerImg.height - (eggImg.height/2));

    setTimeout(function() {
      game.stuffOnCanvas.push(new Stuff({
        x: x,
        y: y,
        src: "egg"
      }));
      game.points++;
    }, 200);
  },
  addEventListener: function() {
    window.addEventListener("keydown", function (e) {
      if (e.keyCode === 32) {
        game.space();
        e.preventDefault();
      }
      if ([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        game.keys[e.keyCode] = true;
        e.preventDefault();
      }
    });
    window.addEventListener("keyup", function (e) {
      delete game.keys[e.keyCode];
    });


    // Touch stuff
    canvas.addEventListener("mouseup", function (e) {
      var image = document.getElementById(game.player.src);
      
      pos = game.getMousePos(canvas, e);
      game.player.x = pos.x - (image.width/2);
      game.player.y = pos.y - (image.height/2);
      game.space();
    }, false);
    canvas.addEventListener("touchend", function (e) {
      var mouseEvent = new MouseEvent("mouseup", {});
      canvas.dispatchEvent(mouseEvent);
    }, false);
  },
  getMousePos: function(canvasDom, mouseEvent) {
    var rect = canvasDom.getBoundingClientRect();
    return {
      x: mouseEvent.clientX - rect.left,
      y: mouseEvent.clientY - rect.top
    };
  },
  walk: function() {
    if (37 in game.keys) {
      game.player.x -= game.speed;
    }
    if (39 in game.keys) {
      game.player.x += game.speed;
    }
    if (38 in game.keys) {
      game.player.y -= game.speed;
    }
    if (40 in game.keys) {
      game.player.y += game.speed;
    }
  },
  drawImage: function(img) {
    var image = document.getElementById(img.src);
    game.ctx.drawImage(image, img.x, img.y);
  },
  drawStuff: function() {
    game.stuffOnCanvas.forEach(stuff => {
      game.drawImage(stuff);
    });
  },
  drawPlayer: function() {
    game.drawImage(game.player);
  },
  draw: function() {
    game.ctx.fillStyle = "#77dcff";
    game.ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    game.updateScore();
    game.drawStuff();
    game.drawPlayer(); 
  },
  updateScore: function() {


    game.ctx.font = "30px Arial";
    game.ctx.fillStyle = "white";

    var width = game.ctx.measureText(game.getPointsFormatted()).width;
    var height = parseInt(game.ctx.font.substring(0, 2)); 

    
    game.ctx.fillText(game.getPointsFormatted(), canvas.width - width - 10, height);
  },
  getPointsFormatted: function() {
    var num = game.points;
  
    return `${"0".repeat(Math.max(0, 3-num.toString().length))}${num}`
  }
}
