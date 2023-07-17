import { Component } from 'react';
import './App.css';

const API_KEY = `dDiB2TbsVlgYtU3itSJwjhR5dM6PUZXj`;

//Inheriting from the react library
class App extends Component{

  //Building our App - intial setup
  constructor(){
    super();

    //Create (initialize) the state
    this.state = {
      randomNumber: Math.floor(Math.random() * 100),
      inputGuess: "",
      feedbackMessage: "Guess a number between 1 and 100",
      imgUrl: "",
      prevGuesses: []
    }

    //Fetch abort controller
    this.controller = new AbortController();

    //Keep our methods from getting lost
    //So they'll always know what "this" refers to
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount(){
    this.getGif("Welcome to the game show");
  }

  getGif(searchTerm){
    fetch(`https://api.giphy.com/v1/gifs/translate?api_key=${API_KEY}&s=${searchTerm}&weirdness=0`, 
    {
      signal: this.controller.signal
    })
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      console.log(result);
      this.setState({
        imgUrl: result.data.images.fixed_height.url
      });
    })
    .catch((err) => {
      console.error(err);
    })
  }

  componentWillUnmount(){
    if (process.env.NODE_ENV !== "development") {
      this.controller.abort();
    }
  }

  //A method that handles the submit event on the form
  handleSubmit(ev) {
    ev.preventDefault();
    //Converts from a string to a number
    const tempGuess = parseInt(this.state.inputGuess);
    //Track the guess as a previous guess
    this.setState({
      prevGuesses: [...this.state.prevGuesses, tempGuess]
    });
    //Perform the logic to determine higher/lower
    if (this.state.randomNumber > tempGuess){
      //Make the DOM say "higher"
      this.setState({
        feedbackMessage: "Higher..."
      });
      this.getGif(`Guess a number`);
    } else if (this.state.randomNumber < tempGuess){
      //Make the DOM say "lower"
      this.setState({
        feedbackMessage: "Lower..."
      });
      this.getGif(`Guess a number`);
    } else {
      //Make the DOM say "You win!"
      this.setState({
        feedbackMessage: "You win!"
      });
      this.getGif("You won!");
    }
    //All the setState calls are updating our state to a new thing
    //so that we have a perfect knowledge of everything our app
    //needs to track
  }

  //A method that handles the change event on the input
  handleChange(ev) {
    //Update my state, because the user just typed something
    //and I want my state to know what got typed!
    this.setState({
      inputGuess: ev.target.value
    });
  }

  //Overriding the render method from the react Component class
  //It causes things to get displayed on the screen
  render() {
    //returns JSX
    return (
      <>
        <h1>Guessing Game</h1>
        <p>{this.state.feedbackMessage}</p>
        <form className="guessForm" onSubmit={this.handleSubmit}>
          <label htmlFor="inputGuess">Guess a number</label>
          {/* Needs to be a controlled input */}
          <input 
            type="text" 
            id="inputGuess" 
            value={this.state.inputGuess} 
            onChange={this.handleChange}
          />
          <button type="submit">Guess</button>
        </form>
        <img 
          src={this.state.imgUrl} 
          alt="Giphy Gif" 
        />
        <ul>
          {this.state.prevGuesses.map((guess, index) => {
            return <li key={`${guess}+${index}`}>{guess}</li>
          })}
        </ul>
      </>
    );
  }
}

export default App;