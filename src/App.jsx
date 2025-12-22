import { useState, useEffect, useRef } from "react";
import puzzles from "/data/puzzles.txt";
import wordData from "/data/wl.txt";
import backArrow from "/images/back_arrow.png";
import flower from "/images/flower.png";

import "./App.css";
import Letter from "./Letter";
import LetterPuzzle from "./LetterPuzzle";
import Menu from "./Menu";
import Tutorial from "./Tutorial";
import Archive from "./Archive";
import Debug from "./Debug";

import { getDateString, getStatusClassName } from "../public/util";

function App() {
	const [allPossibleWords, setAllPossibleWords] = useState({});

	const [dailyPuzzleDict, setDailyPuzzleDict] = useState({});

	const [gameState, setGameState] = useState("menu"); // menu, archive, play, win
	const [prevGameState, setPrevGameState] = useState("none"); // none, menu, archive, play, win
	const [currentPuzzleId, setCurrentPuzzleId] = useState("");
	const [isArchivePuzzle, setIsArchivePuzzle] = useState(false);
	const [isTomorrowsPuzzle, setIsTomorrowsPuzzle] = useState(false);

	const [playerData, setPlayerData] = useState(null);
	const [showTutorial, setShowTutorial] = useState(false);
	const [lastSelectedArchiveDate, setLastSelectedArchiveDate] =
		useState(null);
	const [currentDebugPuzzlePhrase, setCurrentDebugPuzzlePhrase] =
		useState(null);
	const [showDebug, setShowDebug] = useState(false);

	const isNewPuzzleRef = useRef(null);

	useEffect(() => {
		readDataAsync();
		var playerData = loadData();
		if (playerData != null && playerData.puzzleLog != null) {
			var id = getDailyPuzzleId();
			if (!(id in playerData.puzzleLog)) {
				playerData.puzzleLog[id] = {};
			}
			setPlayerData(playerData);
		}
	}, []);

	useEffect(() => {
		if (currentPuzzleId != null) {
			setNewPuzzleRef();
		}
	}, [currentPuzzleId]);

	useEffect(() => {
		var title = document.getElementById("title");
		var backButton = document.getElementById("top-bar-container");
		if (
			(gameState == "play" || gameState == "archive") &&
			(prevGameState == "menu" || prevGameState == "archive")
		) {
			title.classList = "title-bounce-out";
			backButton.classList = "back-button-bounce-in";
		} else if (gameState == "menu" && prevGameState != "none") {
			title.classList = "title-bounce-in";
			backButton.classList = "back-button-bounce-out";
		} else if (gameState == "win" && prevGameState == "play") {
			backButton.classList = "back-button-bounce-out";
		} else if (gameState == "play" && prevGameState == "win") {
			backButton.classList = "back-button-bounce-in";
		} else if (gameState == "archive" && prevGameState == "win") {
			backButton.classList = "back-button-bounce-in";
			setNewPuzzleRef();
		} else if (gameState == "archive") {
			setNewPuzzleRef();
		}

		if (gameState == "menu") {
			setCurrentPuzzleId(getDailyPuzzleId());
			setIsArchivePuzzle(false);
			setIsTomorrowsPuzzle(false);
			setCurrentDebugPuzzlePhrase(null);
		}
	}, [gameState]);

	function setNewPuzzleRef() {
		isNewPuzzleRef.current = getCurrentPuzzlePercentFound() <= 0;
	}

	function saveData(puzzleData) {
		var newPlayerData = {
			puzzleLog: {},
		};
		if (playerData != null) {
			newPlayerData = {
				...playerData,
			};
			if (playerData.puzzleLog == null) {
				newPlayerData.puzzleLog = {};
			}
		}

		newPlayerData.puzzleLog[currentPuzzleId] = puzzleData;
		var saveString = JSON.stringify(newPlayerData);
		localStorage.setItem("whittle", window.btoa(saveString));
		setPlayerData(newPlayerData);
	}

	function loadData() {
		var saveData = localStorage.getItem("whittle");
		if (saveData != null) {
			try {
				saveData = JSON.parse(window.atob(saveData));
			} catch (e) {
				console.log("Could not parse save data: ", e);
				return null;
			}
			return saveData;
		}
		return null;
	}

	const readDataAsync = async () => {
		try {
			const wordsResponse = await fetch(wordData);
			const wordsText = await wordsResponse.text();
			var words = wordsText.split("\n");
			var newAllPossibleWords = {};
			words.forEach((word) => {
				newAllPossibleWords[word] = true;
			});
			setAllPossibleWords(newAllPossibleWords);

			const response = await fetch(puzzles);
			const text = await response.text();
			var dailyPuzzles = text.split("\n");
			var newDailyPuzzleDict = {};
			for (var i = 0; i < dailyPuzzles.length; i++) {
				var tokens = dailyPuzzles[i].split(",");
				newDailyPuzzleDict[tokens[0]] = {
					startingPhrase: tokens[1],
					number: i + 1,
				};
			}
			setDailyPuzzleDict(newDailyPuzzleDict);
		} catch (error) {
			console.error("Error loading data:", error);
		}
	};

	const getDailyPuzzleId = () => {
		return getDateString();
	};

	const getCurrentPuzzleStartingPhrase = () => {
		if (currentDebugPuzzlePhrase != null) {
			return currentDebugPuzzlePhrase;
		}
		if (!dailyPuzzleDict || !dailyPuzzleDict[currentPuzzleId]) {
			return "";
		}
		return dailyPuzzleDict[currentPuzzleId].startingPhrase;
	};

	const getCurrentPuzzlePercentFound = () => {
		return playerData &&
			playerData.puzzleLog &&
			playerData.puzzleLog[currentPuzzleId] &&
			playerData.puzzleLog[currentPuzzleId].percentFound != undefined
			? playerData.puzzleLog[currentPuzzleId].percentFound
			: 0;
	};

	const onBackButtonClicked = () => {
		if (gameState == "archive") {
			setPrevGameState("archive");
			setGameState("menu");
			return;
		}
		setPrevGameState(gameState);
		setGameState(isArchivePuzzle ? "archive" : "menu");
	};

	const onLetterClick = (index) => {
		var letter = document.getElementById("title-letter-" + index);
		var title = document.getElementById("title");
		if (
			letter.classList.contains("disappear") ||
			title.classList.contains("title-bounce-out")
		) {
			return;
		}
		letter.classList.add("disappear");
		setTimeout(() => {
			var lettersContainer = document.getElementById("title");
			lettersContainer.classList.add("red");
			lettersContainer.classList.remove("error-shake");
			lettersContainer.offsetHeight;
			lettersContainer.classList.add("error-shake");
			setTimeout(() => {
				letter.classList.remove("disappear");
				setTimeout(() => {
					lettersContainer.classList.remove("red");
				}, 100);
			}, 300);
		}, 100);
	};

	const getCurrentPuzzleStatusClassName = () => {
		var percentComplete = getCurrentPuzzlePercentFound();
		return "continue-" + getStatusClassName(percentComplete);
	};

	const getCurrentPuzzleData = () => {
		if (puzzleSwitchDetected()) {
			return null;
		}
		return playerData &&
			playerData.puzzleLog &&
			currentDebugPuzzlePhrase == null
			? playerData.puzzleLog[currentPuzzleId]
			: null;
	};

	const puzzleSwitchDetected = () => {
		if (!playerData || !dailyPuzzleDict || !puzzleData) {
			return false;
		}
		var words = dailyPuzzleDict[currentPuzzleId].startingPhrase.split(" ");

		var puzzleData = playerData.puzzleLog[currentPuzzleId];
		if (!puzzleData || Object.keys(puzzleData.foundWords).length === 0) {
			return false; // hasn't started
		}
		for (var i = 0; i < words.length; i++) {
			if (!playerData.puzzleLog[currentPuzzleId].foundWords[words[i]]) {
				console.log("Puzzle switch detected");
				return true;
			}
		}

		return false;
	};

	return (
		<div id="content">
			<div
				className="isabisabel"
				onClick={() => {
					window.open("https://isabisabel.com", "_blank").focus();
				}}
			>
				<span className="isabisabel-text">isabisabel</span>

				<img className="flower" src={flower} />
			</div>

			<div id="title" className="container">
				{"WHITTLE".split("").map((letter, i) => {
					var id = "title-letter-" + i;
					return (
						<Letter
							key={id}
							id={id}
							index={i}
							letter={letter}
							onClick={onLetterClick}
						/>
					);
				})}
			</div>
			<div id="top-bar-container">
				<img
					id="back-button"
					src={backArrow}
					onClick={onBackButtonClicked}
				/>
				<div
					className="small-circle-button tutorial-button-top-bar"
					onClick={() => {
						setShowTutorial(true);
					}}
				>
					<span className="tutorial-button-text">?</span>
				</div>
			</div>
			<div id="body" className="container">
				<Debug
					allPossibleWords={allPossibleWords}
					setCurrentDebugPuzzlePhrase={setCurrentDebugPuzzlePhrase}
					setGameState={setGameState}
					setPrevGameState={setPrevGameState}
					gameState={gameState}
					saveData={saveData}
					playerData={playerData}
					setPlayerData={setPlayerData}
					startingPhrase={getCurrentPuzzleStartingPhrase()}
					setShowDebug={setShowDebug}
					showDebug={showDebug}
				/>

				{showTutorial && <Tutorial setShowTutorial={setShowTutorial} />}
				{gameState == "menu" && (
					<Menu
						setGameState={setGameState}
						setPrevGameState={setPrevGameState}
						playerData={playerData}
						dailyPuzzleId={getDailyPuzzleId()}
						percentComplete={getCurrentPuzzlePercentFound()}
						setShowTutorial={setShowTutorial}
						dailyPuzzleDict={dailyPuzzleDict}
						setPlayerData={setPlayerData}
					/>
				)}
				{gameState == "archive" && (
					<Archive
						dailyPuzzleDict={dailyPuzzleDict}
						puzzleLog={
							playerData != null ? playerData.puzzleLog : {}
						}
						playerData={playerData}
						setPrevGameState={setPrevGameState}
						setGameState={setGameState}
						setCurrentPuzzleId={setCurrentPuzzleId}
						setIsArchivePuzzle={setIsArchivePuzzle}
						setIsTomorrowsPuzzle={setIsTomorrowsPuzzle}
						dailyPuzzleId={getDailyPuzzleId()}
						setCurrentDebugPuzzlePhrase={
							setCurrentDebugPuzzlePhrase
						}
						lastSelectedArchiveDate={lastSelectedArchiveDate}
						setLastSelectedArchiveDate={setLastSelectedArchiveDate}
					/>
				)}
				{(gameState == "play" || gameState == "win") && (
					<LetterPuzzle
						gameState={gameState}
						prevGameState={prevGameState}
						allPossibleWords={allPossibleWords}
						setGameState={setGameState}
						setPrevGameState={setPrevGameState}
						saveData={saveData}
						playerData={playerData}
						data={getCurrentPuzzleData()}
						id={currentPuzzleId}
						startingPhrase={getCurrentPuzzleStartingPhrase()}
						getCurrentPuzzleStatusClassName={
							getCurrentPuzzleStatusClassName
						}
						isArchivePuzzle={isArchivePuzzle}
						isTomorrowsPuzzle={isTomorrowsPuzzle}
						isDebug={currentDebugPuzzlePhrase != null}
						number={dailyPuzzleDict[currentPuzzleId].number}
						isNewPuzzleRef={isNewPuzzleRef}
						showDebug={showDebug}
					/>
				)}
			</div>
		</div>
	);
}

export default App;
