import { useState, useEffect } from "react";

function GameOver(props) {
	const {
		gameOverShowState,
		moves,
		getContinueClassName,
		continueGame,
		percent,
		goToMenu,
		solved,
	} = props;

	var title;
	var subtitle;

	if (gameOverShowState == "win") {
		title = "Nice work!";
		subtitle = (
			<span>
				You won in <b>{moves}</b> moves.
			</span>
		);
	} else if (gameOverShowState == "complete") {
		title = "Overachiever!";
		var subtitle = (
			<span>
				You found <span className="green">every single word</span> in
				today's puzzle.
			</span>
		);
	} else if (gameOverShowState == "win_and_complete") {
		title = "Amazing!";
		subtitle = (
			<span>
				You won in <b>{moves}</b> moves and found{" "}
				<span className="green">every single word</span> in today's
				puzzle. Great work!
			</span>
		);
	}

	return (
		<div className="game-over-container">
			<div>{title}</div>
			<div className="game-over-subtitle">{subtitle}</div>
			{percent < 100 && (
				<button
					id="continue-button"
					className={getContinueClassName()}
					onClick={continueGame}
				>
					<div
						className="button-container"
						id="continue-button-container"
					>
						<div id="continue-button-title">Keep Whittling</div>

						<div id="continue-button-subtitle">
							({percent}% words found)
						</div>
					</div>
				</button>
			)}

			<button id="main-menu-button" onClick={goToMenu}>
				<div className="button-container">Main Menu</div>
			</button>
		</div>
	);
}

export default GameOver;
