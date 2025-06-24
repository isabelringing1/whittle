function GameOver(props) {
	const {
		gameOverShowState,
		moves,
		getContinueClassName,
		continueGame,
		percent,
		goToMenu,
		isPerfect,
	} = props;

	var title;
	var subtitle;

	if (gameOverShowState == "win") {
		title = "Nice work!";
		subtitle = (
			<span>
				You won in <b>{moves.length}</b> moves.
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
				You won in <b>{moves.length}</b> moves and found{" "}
				<span className="green">every single word</span> in today's
				puzzle. Great work!
				{isPerfect && (
					<div className="green">That's a perfect score!</div>
				)}
			</span>
		);
	}

	const copyStats = () => {
		var moveString = moves.join("");
		if (isPerfect) {
			moveString = "⭐️" + moveString + "⭐️";
		}
		navigator.share({
			text: "Beat me at Whittle:" + moveString,
			url: window.location.href,
		});
	};

	return (
		<div className="game-over-container">
			<div>{title}</div>
			<div className="game-over-subtitle">{subtitle}</div>

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
					{percent < 100 && (
						<div id="continue-button-subtitle">
							({percent}% words found)
						</div>
					)}
				</div>
			</button>

			<button id="share-button" onClick={copyStats}>
				<div className="button-container" id="share-button-container">
					Share
				</div>
			</button>

			<button id="main-menu-button" onClick={goToMenu}>
				<div className="button-container">Main Menu</div>
			</button>
		</div>
	);
}

export default GameOver;
