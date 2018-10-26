class BaseObject {
  constructor() {
    this.state = {};
  }

  setState(key, value) {
    const state = Object.assign(this.state, { [key]: value });

    this.state = state;
  }

  getState(key) {
    return this.state[key];
  }
}

export default BaseObject;
