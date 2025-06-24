import { useState, useEffect } from "react";

function Menu(props) {
	const {
		setGameState,
		setPrevGameState,
		playerData,
		dailyPuzzleId,
		percentComplete,
		getStartButtonClassName,
		setShowTutorial,
		dailyPuzzleDict,
	} = props;

	const [status, setStatus] = useState("start"); //start, continue, finish

	useEffect(() => {
		if (playerData == null) {
			return;
		}
		var dailyData = playerData.puzzleLog[dailyPuzzleId];
		if (dailyData != null && dailyData.percentFound > 0) {
			setStatus("continue");
		}
	}, [playerData]);

	const onStartButtonClicked = () => {
		setPrevGameState("menu");
		setGameState("play");
	};

	const getDateString = () => {
		var date = new Date();
		const month = date.toLocaleString("default", { month: "long" });
		const day = date.getDate();
		const year = date.getFullYear();
		return month + " " + day + nth(day) + ", " + year;
	};

	const nth = (d) => {
		if (d > 3 && d < 21) return "th";
		switch (d % 10) {
			case 1:
				return "st";
			case 2:
				return "nd";
			case 3:
				return "rd";
			default:
				return "th";
		}
	};

	return (
		<div id="main-menu">
			{dailyPuzzleDict[dailyPuzzleId] && (
				<div id="puzzle-no">
					Whittle #{dailyPuzzleDict[dailyPuzzleId].number}
				</div>
			)}
			<div id="date">{getDateString()}</div>

			<button
				id="start-button"
				className={getStartButtonClassName()}
				onMouseUp={onStartButtonClicked}
				onTouchEnd={onStartButtonClicked}
			>
				<div className="button-container">
					{status == "start" ? "Start" : "Continue"}
				</div>
			</button>
			{status != "start" && (
				<div id="percent-complete-info">
					You've found <b>{percentComplete}%</b> of all words
				</div>
			)}

			<div
				className="tutorial-button tutorial-button-menu"
				onClick={() => {
					setShowTutorial(true);
				}}
			>
				<span className="tutorial-button-text">?</span>
			</div>
		</div>
	);
}

export default Menu;
