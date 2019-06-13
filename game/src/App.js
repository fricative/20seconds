import React, { Component } from 'react';
import Window from './Window';

const ScreenSize = 500;
const ScreenStart = [0, 0];
const bornPositionX = ScreenSize / 2;  // x axis location where plane is spawned
const bornPositionY = ScreenSize;
const stoneSpeed = 1; // how fast stone moves vertically
const stoneBornProbability = .7;  // probability of there having a new stone generated during a tick
const tickSpeed = 30;  // how frequently screen refreshes in milliseconds
const keyStrokeMove = 1; // unit of coordinate shift for one keystroke

// generate the x axis coordinate for a new stone
const GenerateStoneCoordinate = () => Math.floor(Math.random() * ScreenSize / keyStrokeMove) * keyStrokeMove + ScreenStart[0];
// check whether stone and plane collide by calculating the euclidean distance
const Collide = (stone, plane) => [1, Math.sqrt(2)].includes(Math.sqrt((stone.x - plane[0]) ** 2 + (stone.y - plane[1]) ** 2));
// check whether the coordinate is within the reachable area
const ValidCoordinate = (x, y) => x > ScreenStart[0] && x < ScreenStart[0] + ScreenSize && y > ScreenStart[1] && y < ScreenStart[1] + ScreenSize;
// initial game state
const InititalState = {
  stones: [],
  coordinate: [bornPositionX, bornPositionY],
  alive: true,
  startTime: null,
  duration: null
}
// keep track of the current arrow key state
const KeyboardState = {
  up: 0,
  down: 0,
  left: 0,
  right: 0
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = InititalState;
    this.keyboardState = KeyboardState;
    this.gameInterval = null;
    this.tick = this.tick.bind(this);
    this.keyUp = this.keyUp.bind(this);
    this.keyDown = this.keyDown.bind(this);
    this.gameStart = this.gameStart.bind(this);
  }

  componentDidMount() {
    this.gameStart();
  }

  componentWillUnmount() {
    this.gameOver();
  }

  gameStart() {
    this.keyboardState = KeyboardState;
    document.addEventListener('keydown', this.keyDown);
    document.addEventListener('keyup', this.keyUp);
    this.setState({
      ...InititalState,
      startTime: new Date(),
      duration: null
    });
    this.gameInterval = setInterval(this.tick, tickSpeed);
  }

  gameOver() {
    this.setState({
      ...this.state,
      duration: (new Date() - this.state.startTime) / 1000,
      alive: false
    })
    document.removeEventListener('keydown', this.keyDown);
    document.removeEventListener('keyup', this.keyUp);
    clearInterval(this.gameInterval);
    this.gameInterval = null;
  }

  tick() {
    // calculate all stones' new positions
    let newStones = [];
    if (Math.random() < stoneBornProbability)
      newStones.push({ x: GenerateStoneCoordinate(), y: 0 });
    if (this.state.stones.length) {
      let leftoverStones = this.state.stones.filter(
        stone => stone.y <= ScreenSize).map(
          stone => {
            return {
              x: stone.x,
              y: stone.y + stoneSpeed
            }
          });
      newStones = newStones.concat(leftoverStones);
    }
    // calculate plane's new position based on keyboard state
    let xAxisShift = (this.keyboardState.left + this.keyboardState.right) * keyStrokeMove;
    let yAxisShift = (this.keyboardState.up + this.keyboardState.down) * keyStrokeMove;
    const newCoordinate = ValidCoordinate(this.state.coordinate[0] + xAxisShift, this.state.coordinate[1] + yAxisShift) ?
      [this.state.coordinate[0] + xAxisShift, this.state.coordinate[1] + yAxisShift] : this.state.coordinate;
    //  if collision happened  
    if (newStones.some(stone => Collide(stone, newCoordinate))) {
      this.gameOver();
      return;
    }
    // survived through this tick
    this.setState({
      ...this.state,
      coordinate: newCoordinate,
      stones: newStones,
    });
  }

  keyDown(e) {
    switch (e.keyCode) {
      case 37:
        this.keyboardState.left = -1;
        break;
      case 38:
        this.keyboardState.up = -1;
        break;
      case 39:
        this.keyboardState.right = 1;
        break;
      case 40:
        this.keyboardState.down = 1;
        break;
      default:
        break;
    }
  }

  keyUp(e) {
    switch (e.keyCode) {
      case 37:
        this.keyboardState.left = 0;
        break;
      case 38:
        this.keyboardState.up = 0;
        break;
      case 39:
        this.keyboardState.right = 0;
        break;
      case 40:
        this.keyboardState.down = 0;
        break;
      default:
        break;
    }
  }

  render() {
    if (this.state.stones.length === 0)
      return <div>loading ... </div>;
    else if (!this.state.alive)
      return (
        <div>
          <p>{"duration: " + this.state.duration + ' s'}</p>
          <button onClick={this.gameStart}>restart</button>
        </div>
      );
    else
      return (
        <div style={{
          width: ScreenSize + 10 + 'px',
          height: ScreenSize + 15 + 'px',
          top: '0px',
          left: '0px',
          border: '1px solid #000',
          padding: "1px",
          margin: '1px',
          background: 'black'
        }}>
          <Window coordinate={this.state.coordinate}
            stones={this.state.stones} alive={this.state.alive} />
        </div>
      );
  }
}

export default App;