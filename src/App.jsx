import { useState, useEffect } from "react";
import puzzles from "/data/puzzles.txt";
import wordData from "/data/wl.txt";
import backArrow from "/images/back_arrow.png";

import "./App.css";
import Letter from "./Letter";
import LetterPuzzle from "./LetterPuzzle";
import Menu from "./Menu";
import Tutorial from "./Tutorial";

function App() {
	const [allPossibleWords, setAllPossibleWords] = useState({});

	const [dailyPuzzleDict, setDailyPuzzleDict] = useState({});

	const [gameState, setGameState] = useState("menu"); // menu, play, win
	const [prevGameState, setPrevGameState] = useState("none"); // none, menu, play, win

	const [playerData, setPlayerData] = useState(null);
	const [showTutorial, setShowTutorial] = useState(false);

	useEffect(() => {
		readDataAsync();
		var playerData = loadData();
		if (playerData != null) {
			var id = getDailyPuzzleId();
			if (!(id in playerData.puzzleLog)) {
				playerData.puzzleLog[id] = {};
			}
			setPlayerData(playerData);
		}
	}, []);

	useEffect(() => {
		var title = document.getElementById("title");
		var backButton = document.getElementById("top-bar-container");
		if (gameState == "play" && prevGameState == "menu") {
			title.classList = "title-bounce-out";
			backButton.classList = "back-button-bounce-in";
		} else if (gameState == "menu" && prevGameState != "none") {
			title.classList = "title-bounce-in";
			backButton.classList = "back-button-bounce-out";
		} else if (gameState == "win" && prevGameState == "play") {
			backButton.classList = "back-button-bounce-out";
		} else if (gameState == "play" && prevGameState == "win") {
			backButton.classList = "back-button-bounce-in";
		}
	}, [gameState]);

	useEffect;

	function saveData(dailyData) {
		var newPlayerData = {
			puzzleLog: {},
		};
		if (playerData != null) {
			newPlayerData = {
				...playerData,
			};
		}

		newPlayerData.puzzleLog[getDailyPuzzleId()] = dailyData;
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
			console.log(newDailyPuzzleDict);
		} catch (error) {
			console.error("Error loading data:", error);
		}
	};

	const getDailyPuzzleId = () => {
		var date = new Date();
		const month = date.getMonth();
		const day = date.getDate();
		const year = date.getFullYear();
		var id = month + "/" + day + "/" + year;
		return id;
	};

	const getDailyPuzzleStartingPhrase = () => {
		var id = getDailyPuzzleId();
		return dailyPuzzleDict[id].startingPhrase;
	};

	const getDailyPuzzlePercentFound = () => {
		return playerData
			? playerData.puzzleLog[getDailyPuzzleId()].percentFound
			: 0;
	};

	const onBackButtonClicked = () => {
		setPrevGameState(gameState);
		setGameState("menu");
	};

	const onLetterClick = (index) => {
		var letter = document.getElementById("title-letter-" + index);
		if (letter.classList.contains("disappear")) {
			return;
		}
		letter.classList.add("disappear");
		setTimeout(() => {
			var lettersContainer = document.getElementById("title");
			lettersContainer.classList.add("red");
			setTimeout(() => {
				letter.classList.remove("disappear");
				setTimeout(() => {
					lettersContainer.classList.remove("red");
				}, 100);
			}, 300);
		}, 100);
	};

	const getContinueClassName = () => {
		var percentComplete = getDailyPuzzlePercentFound();
		if (percentComplete == 0) {
			return "not-started";
		} else if (percentComplete > 0 && percentComplete < 50) {
			return "continue-low";
		} else if (percentComplete >= 50 && percentComplete < 80) {
			return "continue-medium";
		} else if (percentComplete >= 80 && percentComplete < 100) {
			return "continue-high";
		} else if (percentComplete >= 100) {
			return "continue-complete";
		}
	};

	return (
		<div id="content">
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
					className="tutorial-button tutorial-button-top-bar"
					onClick={() => {
						setShowTutorial(true);
					}}
				>
					<span className="tutorial-button-text">?</span>
				</div>
			</div>
			<div id="body" className="container">
				{showTutorial && <Tutorial setShowTutorial={setShowTutorial} />}

				{gameState == "menu" ? (
					<Menu
						setGameState={setGameState}
						setPrevGameState={setPrevGameState}
						playerData={playerData}
						dailyPuzzleId={getDailyPuzzleId()}
						percentComplete={getDailyPuzzlePercentFound()}
						getStartButtonClassName={getContinueClassName}
						setShowTutorial={setShowTutorial}
						dailyPuzzleDict={dailyPuzzleDict}
					/>
				) : (
					<LetterPuzzle
						gameState={gameState}
						allPossibleWords={allPossibleWords}
						setGameState={setGameState}
						setPrevGameState={setPrevGameState}
						saveData={saveData}
						data={
							playerData
								? playerData.puzzleLog[getDailyPuzzleId()]
								: null
						}
						id={getDailyPuzzleId()}
						startingPhrase={getDailyPuzzleStartingPhrase()}
						getContinueClassName={getContinueClassName}
					/>
				)}
			</div>
		</div>
	);
}

export default App;
