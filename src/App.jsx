import { useState, useEffect } from 'react';
import PreviousGuess from './PreviousGuess';
import './App.css';

const API_KEY = `dDiB2TbsVlgYtU3itSJwjhR5dM6PUZXj`;

//Inheriting from the react library
function App() {
  const [feedbackMessage, setFeedbackMessage] = useState("Guess a number between 1 and 100");
  const [randomNumber, setRandomNumber] = useState(Math.floor(Math.random() * 100));
  const [prevGuesses, setPrevGuesses] = useState([]);
  const [inputGuess, setInputGuess] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  
  //Empty dependency array will make useEffect run only once
  useEffect(() => {
    const controller = new AbortController();
    getGif(feedbackMessage, controller);
    return () => {
      //Performs clean up operations
      if (process.env.NODE_ENV !== "development") {
        controller.abort();
      }
    }
  }, [feedbackMessage]);

  function getGif(searchTerm, controller){
    fetch(`https://api.giphy.com/v1/gifs/translate?api_key=${API_KEY}&s=${searchTerm}&weirdness=0`, 
    {
      signal: controller.signal
    })
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      console.log(result);
      setImgUrl(result.data.images.fixed_height.url);
    })
    .catch((err) => {
      console.error(err);
    })
  }

  //A function that handles the submit event on the form
  function handleSubmit(ev) {
    ev.preventDefault();
    //Converts from a string to a number
    const tempGuess = parseInt(inputGuess);
    //Track the guess as a previous guess
    setPrevGuesses([...prevGuesses, tempGuess]);
    //Perform the logic to determine higher/lower
    if (randomNumber > tempGuess){
      //Make the DOM say "higher"
      setFeedbackMessage("Higher...");
    } else if (randomNumber < tempGuess){
      //Make the DOM say "lower"
      setFeedbackMessage("Lower...");
    } else {
      //Make the DOM say "You win!"
      setFeedbackMessage("Winner, winner!");
    }
    //All the setState calls are updating our state to a new thing
    //so that we have a perfect knowledge of everything our app
    //needs to track
  }

  //A function that handles the change event on the input
  function handleChange(ev) {
    //Update my state, because the user just typed something
    //and I want my state to know what got typed!
    setInputGuess(ev.target.value);
  }

  //returns JSX
  return (
    <>
      <h1>Guessing Game</h1>
      <p>{feedbackMessage}</p>
      <form className="guessForm" onSubmit={handleSubmit}>
        <label htmlFor="inputGuess">Guess a number</label>
        <input 
          type="text" 
          id="inputGuess" 
          value={inputGuess} 
          onChange={handleChange}
        />
        <button type="submit">Guess</button>
      </form>
      <img 
        src={imgUrl} 
        alt="Giphy Gif" 
      />
      <PreviousGuess 
        guesses={prevGuesses} 
        favColor="green"
      />
    </>
  );
}
 
export default App;