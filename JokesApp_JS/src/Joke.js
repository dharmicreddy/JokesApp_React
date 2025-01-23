import React, { Component } from 'react'; // Import React and Component to create a class-based component
import './Joke.css'; // Import the CSS file for styling the Joke component
import '@fortawesome/fontawesome-free'; // Import Font Awesome for icons

// Joke component that displays an individual joke with voting functionality
export default class Joke extends Component {
	constructor(props) {
		super(props);
		// Bind the handleClick method to the component instance
		this.handleClick = this.handleClick.bind(this);
	}

	// Method to handle click events on the upvote or downvote buttons
	handleClick(evt) {
		// Pass the vote type (up-vote or down-vote) and the joke's ID to the parent component
		this.props.updateScore(evt.target.id, this.props.id);
	}

	// Method to determine the border color based on the joke's score
	getColor() {
		if (this.props.score >= 15) {
			return '#4CAF50'; // Green for very high scores
		} else if (this.props.score >= 12) {
			return '#8BC34A'; // Light green
		} else if (this.props.score >= 9) {
			return '#CDDC39'; // Yellow-green
		} else if (this.props.score >= 6) {
			return '#FFEB3B'; // Yellow
		} else if (this.props.score >= 3) {
			return '#FFC107'; // Amber
		} else if (this.props.score >= 0) {
			return '#FF9800'; // Orange
		} else {
			return '#f44336'; // Red for negative scores
		}
	}

	// Method to determine the emoji to display based on the joke's score
	getEmoji() {
		if (this.props.score >= 15) {
			return 'em em-rolling_on_the_floor_laughing'; // Rolling on the floor laughing emoji
		} else if (this.props.score >= 12) {
			return 'em em-laughing'; // Laughing emoji
		} else if (this.props.score >= 9) {
			return 'em em-smiley'; // Smiley face emoji
		} else if (this.props.score >= 6) {
			return 'em em-slightly_smiling_face'; // Slightly smiling face emoji
		} else if (this.props.score >= 3) {
			return 'em em-neutral_face'; // Neutral face emoji
		} else if (this.props.score >= 0) {
			return 'em em-confused'; // Confused face emoji
		} else {
			return 'em em-angry'; // Angry face emoji
		}
	}

	// Render method to display the joke, its score, and voting buttons
	render() {
		return (
			<div className="Joke">
				{/* Buttons for upvoting and downvoting */}
				<div className="Joke-buttons">
					<i
						className="fas fa-arrow-up"
						id="up-vote"
						onClick={this.handleClick} // Handle upvote click
					/>
					{/* Display the joke's score with a border color determined by its score */}
					<span className="Joke-votes" style={{ borderColor: this.getColor() }}>
						{this.props.score}
					</span>
					<i
						className="fas fa-arrow-down"
						id="down-vote"
						onClick={this.handleClick} // Handle downvote click
					/>
				</div>
				{/* Display the joke text */}
				<div className="Joke-text">{this.props.joke}</div>
				{/* Display the emoji representing the joke's score */}
				<div className="Joke-smiley">
					<i className={this.getEmoji()} />
				</div>
			</div>
		);
	}
}
