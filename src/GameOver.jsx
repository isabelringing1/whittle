import { getStatusClassName, copyStats, getMovesLength } from "../public/util";

function GameOver(props) {
	const {
		gameOverShowState,
		moves,
		bestMoves,
		continueGame,
		percent,
		goToMenu,
		isPerfect,
		isArchivePuzzle,
		goToArchive,
		isNewBestScore,
		number,
	} = props;

	var title;
	var subtitle;

	if (gameOverShowState == "win") {
		title = "Nice work!";
		subtitle = (
			<span>
				You won in <b>{getMovesLength(moves)}</b> moves.
				{isPerfect && (
					<div className="green">That's a perfect score!</div>
				)}
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
				You won in <b>{getMovesLength(moves)}</b> moves and found{" "}
				<span className="green">every single word</span> in today's
				puzzle. Great work!
				{isPerfect && (
					<div className="green">That's a perfect score!</div>
				)}
			</span>
		);
	}

	return (
		<div className="game-over-container">
			<div>{title}</div>
			<div className="game-over-subtitle">{subtitle}</div>
			{isNewBestScore && (
				<div className="game-over-subtitle green">New best score!</div>
			)}

			<button
				id="continue-button"
				className={"continue-" + getStatusClassName(percent)}
				onClick={continueGame}
			>
				<div
					className="button-container"
					id="continue-button-container"
				>
					<div id="continue-button-title">Keep Whittling</div>
					{percent < 100 && (
						<div id="continue-button-subtitle">
							({percent}% words found)
						</div>
					)}
				</div>
			</button>

			{!isArchivePuzzle && (
				<button
					id="share-button"
					onClick={() => {
						if (
							gameOverShowState == "complete" &&
							bestMoves != undefined
						) {
							copyStats(bestMoves, isPerfect, number);
						} else {
							copyStats(moves, isPerfect, number);
						}
					}}
				>
					<div
						className="button-container"
						id="share-button-container"
					>
						{isPerfect && <span className="share-star">⭐️</span>}
						Share{" "}
						{isPerfect && <span className="share-star">⭐️</span>}
					</div>
				</button>
			)}

			{!isArchivePuzzle && (
				<button id="main-menu-button" onClick={goToMenu}>
					<div className="button-container">Main Menu</div>
				</button>
			)}

			{isArchivePuzzle && (
				<button id="main-menu-button" onClick={goToArchive}>
					<div className="button-container">Back to Archive</div>
				</button>
			)}
		</div>
	);
}

export default GameOver;
