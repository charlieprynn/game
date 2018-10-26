/* global document, window */
import Player from './objects/Player';

class Game {
  constructor() {
    const canvas = document.getElementById('canvas');

    const fps = 30;

    this.state = {
      game: {
        fps,
        lastTime: (new Date()).getTime(),
        currentTime: 0,
        delta: 0,
        interval: 1000 / fps,
      },
      canvas: {
        canvas,
        width: canvas.width,
        height: canvas.height,
        ctx: canvas.getContext('2d'),
      },
      player: new Player(10, 10, 10, 10, 10, 'green', () => {
        const { player } = this.state;
        const {
          right, left, up, down,
        } = this.state.controls;

        this.movePlayer(right.active, left.active, up.active, down.active);

        this.state.canvas.ctx.fillStyle = player.colour;

        this.state.canvas.ctx.fillRect(player.x, player.y, player.width, player.height);
      }),
      // ai: new Player(10, 10, 100, 100, 5, 'red'),
      controls: {
        left: {
          code: 37,
          active: false,
        },
        right: {
          code: 39,
          active: false,
        },
        up: {
          code: 40,
          active: false,
        },
        down: {
          code: 38,
          active: false,
        },
      },
    };

    this.events();
    this.loop();
  }

  setState(key, value) {
    const state = Object.assign({}, this.state);

    state[key] = value;

    this.state = state;

    return state;
  }

  input(event) {
    const controls = Object.assign({}, this.state.controls);

    const value = event.type === 'keydown';


    if (event.keyCode === 39) {
      controls.right.active = value;
    }

    if (event.keyCode === 37) {
      controls.left.active = value;
    }

    if (event.keyCode === 40) {
      controls.up.active = value;
    }
    if (event.keyCode === 38) {
      controls.down.active = value;
    }


    this.setState('controls', controls);
  }

  isInCanvasBounds(model) {
    const bounds = [0, 0, 0, 0];

    if (((model.x + model.speed) < (this.state.canvas.width - model.width))) {
      bounds[0] = ((this.state.canvas.width - model.width) - (model.x + model.speed));
    }

    if (((model.y + model.speed) < (this.state.canvas.height - model.height))) {
      bounds[1] = ((this.state.canvas.height - model.height) - (model.y + model.speed));
    }

    if (((model.x + model.speed) > 0)) {
      bounds[2] = (model.x - model.speed);
    }

    if (((model.y + model.speed) > 0)) {
      bounds[3] = (model.y - model.speed);
    }

    return bounds;
  }

  events() {
    document.addEventListener('keydown', this.input.bind(this), false);
    document.addEventListener('keyup', this.input.bind(this), false);
  }

  clear() {
    this.state.canvas.ctx.clearRect(0, 0, this.state.canvas.width, this.state.canvas.width);
  }

  movePlayer(right, left, up, down) {
    const player = Object.assign({}, this.state.player);
    const { speed } = player;
    const playerInBounds = this.isInCanvasBounds(player);

    // right hand wall
    if (right && playerInBounds[0] > 0) {
      player.x += speed;
    }

    // left hand wall
    if (left && playerInBounds[2] > 0) {
      player.x -= speed;
    }

    // Top wall
    if (up && playerInBounds[1] > 0) {
      player.y += speed;
    }

    // Bottom wall
    if (down && playerInBounds[3] > 0) {
      player.y -= speed;
    }

    this.setState('player', player);
  }

  moveAi() {
    const { ai } = this.state;
    const aiInBounds = this.isInCanvasBounds(ai);
    const playerInBounds = this.isInCanvasBounds(this.state.player);

    // right hand wall
    if (aiInBounds[0] > 0 && (aiInBounds[0] - playerInBounds[0]) > 0) {
      ai.x += ai.speed;
    }

    // left hand wall
    if (aiInBounds[2] && (aiInBounds[2] - playerInBounds[2]) > 0) {
      ai.x -= ai.speed;
    }

    // Top wall
    if (aiInBounds[1] && (aiInBounds[1] - playerInBounds[1]) > 0) {
      ai.y += ai.speed;
    }

    // Bottom wall
    if (aiInBounds[3] && (aiInBounds[3] - playerInBounds[3]) > 0) {
      ai.y -= ai.speed;
    }

    this.setState('ai', ai);
  }

  loop() {
    if (!this.state.game.paused) {
      const game = Object.assign({}, this.state.game);

      window.requestAnimationFrame(this.loop.bind(this));

      game.currentTime = (new Date()).getTime();
      game.delta = (game.currentTime - game.lastTime);

      if (game.delta > game.interval) {
        this.render();

        game.lastTime = game.currentTime - (game.delta % game.interval);
      }

      this.setState('game', game);
    }
  }

  static detectCollision(a, b) {
    // const aDimensions = [[a.x, a.y], [(a.x + a.width), a.y], [(a.x + a.width), (a.y + a.height)], [a.x, (a.x + a.width)]];
    // const bDimensions = [[b.x, b.y], [(b.x + b.width), b.y], [(b.x + b.width), (b.y + b.height)], [b.x, (b.x + b.width)]];

    return (a.x < b.x + b.width
      && a.x + a.width > b.x
      && a.y < b.y + b.height
      && a.height + a.y > b.y);
  }

  render() {
    this.clear();

    this.state.player.render();
    // this.state.ai.render();

    if (Game.detectCollision(this.state.player, this.state.ai)) {
      const { game } = this.state;

      game.paused = true;

      this.setState('game', game);

      console.log('PAUSED AS DEAD');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.game = new Game();
}, false);
