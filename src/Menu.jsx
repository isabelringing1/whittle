import { useState, useEffect } from "react";

import Dialog from "./Dialog";

import {
	getDateStringFormatted,
	getStatusClassName,
	copyStats,
} from "../public/util";

import calendar from "/images/calendar.png";
import share from "/images/share.png";

function Menu(props) {
	const {
		setGameState,
		setPrevGameState,
		playerData,
		dailyPuzzleId,
		percentComplete,
		setShowTutorial,
		dailyPuzzleDict,
	} = props;

	const [status, setStatus] = useState("start"); //start, continue, finish
	const [dialogState, setDialogState] = useState("none"); // none, info

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

	const goToArchive = () => {
		setPrevGameState("menu");
		setGameState("archive");
	};

	const shouldShowShareButton = () => {
		return (
			playerData &&
			playerData.puzzleLog[dailyPuzzleId] &&
			playerData.puzzleLog[dailyPuzzleId].bestMoves
		);
	};

	const onShareButtonClicked = () => {
		var isPerfect =
			getMovesLength(playerData.puzzleLog[dailyPuzzleId].bestMoves) <=
			dailyPuzzleDict[dailyPuzzleId].startingPhrase.length;
		copyStats(
			playerData.puzzleLog[dailyPuzzleId].bestMoves,
			isPerfect,
			dailyPuzzleDict[dailyPuzzleId].number
		);
	};

	return (
		<div id="main-menu">
			{dailyPuzzleDict[dailyPuzzleId] && (
				<div id="puzzle-no">
					Whittle #{dailyPuzzleDict[dailyPuzzleId].number}
				</div>
			)}
			<div id="date">{getDateStringFormatted()}</div>

			<button
				id="start-button"
				className={
					"continue-" +
					getStatusClassName(percentComplete, status != "start")
				}
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

			<div id="menu-small-buttons-container">
				<button className="puzzle-button" onClick={goToArchive}>
					<div className="puzzle-button-img-container">
						<img src={calendar} className="calendar-button-img" />
					</div>
				</button>

				{shouldShowShareButton() && (
					<button
						className="puzzle-button"
						onClick={onShareButtonClicked}
					>
						<div className="puzzle-button-img-container">
							<img src={share} className="share-button-img" />
						</div>
					</button>
				)}
			</div>

			{dialogState != "none" && (
				<Dialog
					dialogState={dialogState}
					setDialogState={setDialogState}
					buttonActions={[
						() => {
							setDialogState("none");
						},
						() => setDialogState("none"),
					]}
				/>
			)}

			<div
				className="small-circle-button tutorial-button-menu"
				onClick={() => {
					setShowTutorial(true);
				}}
			>
				<span className="tutorial-button-text">?</span>
			</div>
			<div
				className="small-circle-button info-button-menu"
				onClick={() => {
					setDialogState("info");
				}}
			>
				<span className="tutorial-button-text">i</span>
			</div>
		</div>
	);
}

export default Menu;
