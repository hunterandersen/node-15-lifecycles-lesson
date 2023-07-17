import React, { Component } from 'react'

export default class PreviousGuess extends Component {

    constructor(props){
        super(props);
        console.log(props);
    }

  render() {
    return (
        <ul>
            {this.props.guesses.map((guess, index) => {
            return <li key={`${guess}+${index}`}>{guess}</li>
            })}
        </ul>
    )
  }
}
