import React from 'react';

const MAX = 1;
const COLORS = ['blue', 'red', 'green', 'yellow'];

const getRandomId = () => COLORS[Math.floor(Math.random() * COLORS.length)];

const SimonSquare = (props) => {
  const { player, id, simon, onColorClicked,finished } = props;
  if (player) {
    return (
      <div className={"simon-square background-" + id}>
        <div className="row">
          <ColorButton color={'red'} onClick={() => onColorClicked('red')} disabled={simon || finished }/>
          <ColorButton color={'blue'} onClick={() => onColorClicked('blue')} disabled={simon || finished}/>
        </div>
        <div className="row">
          <ColorButton color={'green'} onClick={() => onColorClicked('green')} disabled={simon || finished}/>
          <ColorButton color={'yellow'} onClick={() => onColorClicked('yellow')} disabled={simon || finished}/>
        </div>
      </div>
    );
  } else {
    return <div className={"simon-square simon background-" + id}></div>;
  }
};

const ColorButton = (props) => {
  return <button className={"color-button background-"+props.color} onClick={props.onClick} disabled={props.disabled}></button>;
}

const StartButton = (props) => {
  return <button className="start-button" onClick={props.onClick} disabled={props.disabled}>Play Simon Says </button>;
};

const Greeting = (props) => {
  const label = props.simon;
  if (label) {
    return <SimonSays />;
  }
  return <PlayersTurn />;
};

const Result = (props) => {
  const {win, simon, finished} = props;
  if (finished && !simon) {
    if(win) {
      return <div>Congrats, you won!</div>
    } else  {
      return <div>Sorry, try again!</div>
    }
  }
  return null;

}

const SimonSays = (props) => {
  return <div>Simon Says: </div>;
};

const PlayersTurn = (props) => {
  return <div>Players Turn: </div>;
};

const Board = (props) => {
  const { colorFill, onColorClicked, simon, finished} = props;
  return (
    <div className="board">
      <SimonSquare id={colorFill} player={false}/>
      <SimonSquare id={'white'} player={true} onColorClicked={onColorClicked} simon={simon} finished={finished}></SimonSquare>
    </div>
  );
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.restart = this.restart.bind(this);
    this.incrementCount = this.incrementCount.bind(this);
    this.onButtonClicked = this.onButtonClicked.bind(this);
    this.simonSequence = this.simonSequence.bind(this);
    this.state = {
      maxCount: MAX,
      colors: COLORS,
      count: 0,
      sequence: [],
      colorFill: "",
      simon: true,
      win: false,
      finished: true,
    }
  }

  incrementCount() {
    this.setState(prevState => {
      return {count: prevState.count + 1}
    });
  }

  restart() {
    this.setState({
      count: 0,
      sequence: [],
    });

    console.log(this.state.win)
  }

  simonSequence() {
    this.setState({
      simon: true,
      win: false,
      finished: false,
      maxCount: this.state.win ? this.state.maxCount +1 : 1,
    });
    this.timer = setInterval(
      () => this.handleChangeColor(),
      1000*1 // in milliseconds, 3s for fast show
    );
  }

  componentDidUpdate() {
    if((this.state.count === this.state.maxCount) ) {
      console.log('updating')
      this.setState({
        count: 0,
        finished: true,
        win: this.state.win ? true : false,
      });
      const finishedGame = setTimeout( () => {
        this.restart();
        if (this.state.win) this.simonSequence()
      }, 1000);
      clearTimeout(finishedGame);
    }
  }

  handleChangeColor() {
    if(this.state.sequence.length === this.state.maxCount) {
        this.setState({
          colorFill: 'white',
          simon: false,
        });
      clearInterval(this.timer);
    } else {
      const newColor = getRandomId()
      const joined = this.state.sequence.concat(newColor);
      this.setState({ sequence: joined })
      this.setState({
        colorFill: newColor,
        finished: false,
      });
    }
  }

  onButtonClicked(color) {
    this.incrementCount();

    if (color !== this.state.sequence[this.state.count]) {
      this.setState({
        win: false,
        finished: true,
      });
      this.restart()
    } else {
      this.setState({win: true});
    }

  }

  render() {
    return (
      <div className="screen">
        <StartButton onClick={this.simonSequence} disabled={!this.state.finished}></StartButton>
        <Greeting simon={this.state.simon} />
        <div className="level">Level: {this.state.maxCount}</div>
        <Board colorFill={this.state.colorFill} onColorClicked={this.onButtonClicked} finished={this.state.finished} simon={this.state.simon}/>
        <Result finished={this.state.finished} win={this.state.win} simon={this.state.simon}/>
      </div>
    )
  }
}

export default Game;
