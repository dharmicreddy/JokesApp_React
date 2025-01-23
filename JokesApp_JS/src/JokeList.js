import React, { Component } from "react"; // Import React and Component to create a class-based component
import Joke from "./Joke"; // Import the Joke component to display individual jokes
import axios from "axios"; // Import axios for making API requests
import uuid from "uuid/v4"; // Import uuid for generating unique IDs for jokes
import "./JokeList.css"; // Import CSS for styling the component

export default class JokeBoard extends Component {
  constructor(props) {
    super(props); // Call the parent constructor
    this.state = {
      loading: false, // Boolean to track if jokes are being fetched
      jokes: JSON.parse(window.localStorage.getItem("jokes")) || [], // Initialize jokes from localStorage or an empty array
    };
    this.updateScore = this.updateScore.bind(this); // Bind the `updateScore` method to the class instance
    this.handleClick = this.handleClick.bind(this); // Bind the `handleClick` method to the class instance
    this.seenJokes = new Set(this.state.jokes.map((j) => j.text)); // Create a Set of already seen jokes to avoid duplicates
  }

  // Lifecycle method to fetch jokes when the component is mounted
  componentDidMount() {
    if (this.state.jokes.length === 0) this.getJokes(); // Fetch jokes only if none are stored
  }

  // Method triggered by the "Fetch Jokes" button click
  handleClick() {
    this.setState({ loading: true }, this.getJokes); // Set loading to true and call `getJokes`
  }

  // Method to fetch jokes from the API
  async getJokes() {
    try {
      let newJokes = []; // Temporary array to hold new jokes
      for (let index = 0; index < 10; index++) {
        const response = await axios.get("https://icanhazdadjoke.com/slack"); // Fetch a joke from the API
        let newJoke = response.data.attachments[0].text; // Extract the joke text from the API response
        if (!this.seenJokes.has(newJoke)) { // Check if the joke is already seen
          newJokes = [...newJokes, { id: uuid(), text: newJoke, score: 0 }]; // Add the joke to the array with a unique ID and initial score
        } else {
          console.log("Duplicate Issues: Joke already seen!"); // Log a message for duplicate jokes
        }
      }
      // Update the state with the new jokes and save them to localStorage
      this.setState(
        (st) => ({
          loading: false, // Stop loading
          jokes: [...st.jokes, ...newJokes], // Append new jokes to the existing ones
        }),
        () =>
          window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes)) // Save the updated jokes to localStorage
      );
    } catch (error) {
      console.log("An Error Occured"); // Log an error message if fetching fails
    }
  }

  // Method to update the score of a joke based on user voting
  updateScore(vote, id) {
    this.setState(
      (st) => ({
        jokes: st.jokes.map((joke) => {
          if (joke.id === id) { // Find the joke by ID
            if (vote === "up-vote") { // If it's an up-vote, increase the score
              joke.score += 1;
            } else { // Otherwise, decrease the score
              joke.score -= 1;
            }
          }
          return joke; // Return the updated joke
        }),
      }),
      () =>
        window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes)) // Save the updated jokes to localStorage
    );
  }

  // Render method to display the UI
  render() {
    if (this.state.loading) {
      // Show a loading spinner if jokes are being fetched
      return (
        <div className="JokeList-spinner">
          <i className="far fa-8x fa-laugh fa-spin" /> {/* Spinning laugh icon */}
          <h1 className="JokeList-title">Loading...</h1> {/* Loading text */}
        </div>
      );
    }

    // Sort jokes by score in descending order
    let jokes = this.state.jokes.sort((a, b) => b.score - a.score);
    return (
      <div className="JokeList">
        {/* Sidebar with title, image, and fetch button */}
        <div className="JokeList-sidebar">
          <h1 className="JokeList-title">
            <span>Bad</span> Jokes {/* Title with styled span */}
          </h1>
          <img
            alt="fetch-button"
            src="https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg"
          />
          <button className="JokeList-getmore" onClick={this.handleClick}>
            Fetch Jokes {/* Button to fetch new jokes */}
          </button>
        </div>
        {/* Display the jokes */}
        <div className="JokeList-jokes">
          {jokes.map((joke) => (
            <Joke
              key={joke.id} // Unique key for each joke
              id={joke.id} // Pass joke ID as a prop
              joke={joke.text} // Pass joke text as a prop
              score={joke.score} // Pass joke score as a prop
              updateScore={this.updateScore} // Pass the score update method as a prop
            />
          ))}
        </div>
      </div>
    );
  }
}
