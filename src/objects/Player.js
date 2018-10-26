import BaseObject from './BaseObject';

class Player extends BaseObject {
  constructor(x, y, width, height, speed, colour, render) {
    super();

    console.log(render, 'init');

    this.setState({
      position: {
        x,
        y,
      },
      dimensions: {
        width,
        height,
      },
      speed,
      colour,
      render,
    });
  }

  render() {
    const render = this.getState('render');

    console.log(render);

    // render();
  }
}

export default Player;
