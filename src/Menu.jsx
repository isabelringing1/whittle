import { useState, useEffect } from "react";

function Menu(props) {
	const {
		setGameState,
		setPrevGameState,
		playerData,
		dailyPuzzleId,
		percentComplete,
	} = props;

	const [status, setStatus] = useState("start"); //start, continue, finish

	useEffect(() => {
		if (playerData == null) {
			return;
		}
		var dailyData = playerData.puzzleLog[dailyPuzzleId];
		if (dailyData != null) {
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
			<div id="date">{getDateString()}</div>

			<button
				id="start-button"
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
		</div>
	);
}

export default Menu;
