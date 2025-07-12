import { useRef, useEffect, useState } from "react";
import { generatePossibleWords } from "../public/util.js";

function Debug(props) {
	const {
		allPossibleWords,
		setCurrentDebugPuzzlePhrase,
		setGameState,
		setPrevGameState,
		gameState,
		saveData,
		startingPhrase,
		showDebug,
		setShowDebug,
	} = props;

	const devMode = true;

	const testPhraseRef = useRef();
	const saveDataRef = useRef();

	useEffect(() => {
		document.addEventListener("keydown", (event) => {
			if (event.code === "Escape") {
				toggleShowDebug();
			}
		});
		return document.removeEventListener("keydown", (event) => {
			if (event.code === "Escape") {
				toggleShowDebug();
			}
		});
	}, []);

	const toggleShowDebug = () => {
		setShowDebug((prevShowDebug) => !prevShowDebug);
	};

	const printInfo = (phrases) => {
		var phraseArray = phrases.split(", ");
		phraseArray.forEach((phrase, i) => {
			var possibleWords = generatePossibleWords(
				phrase,
				allPossibleWords,
				true
			);
			console.log(
				phrase,
				": ",
				Object.keys(possibleWords).length,
				Object.keys(possibleWords)
			);
			var combos = [];
			Object.keys(possibleWords).forEach((word, i) => {
				if (word[0] == "*") {
					combos.push(word.slice(1));
				}
			});
			console.log("combos: ", combos);
		});
	};

	const testPhrase = (phrase) => {
		setCurrentDebugPuzzlePhrase(phrase);
		setGameState("play");
		setPrevGameState("menu");
	};

	const solvePuzzle = (today = true) => {
		var possibleWords = generatePossibleWords(
			startingPhrase,
			allPossibleWords
		);

		var newData = {
			percentFound: 100,
			solved: true,
			completedToday: today,
			bestMoves: [],
			foundWords: possibleWords,
		};
		saveData(newData);
		window.location.reload();
	};

	return devMode && showDebug ? (
		<div className="debug-menu">
			<div className="debug-column">
				<div className="debug-section">
					<input
						type="string"
						ref={testPhraseRef}
						className="debug-input"
					/>
					<button
						id="test-phrase-button"
						className="debug-button"
						onClick={() => {
							printInfo(testPhraseRef.current.value);
						}}
					>
						Info
					</button>
					<button
						id="test-phrase-button"
						className="debug-button"
						onClick={() => {
							testPhrase(testPhraseRef.current.value);
						}}
					>
						Test
					</button>
				</div>
				<div className="debug-section">
					<button
						id="copy-save-button"
						className="debug-button"
						onClick={() => {
							navigator.clipboard.writeText(
								localStorage.getItem("whittle")
							);
						}}
					>
						Copy Save
					</button>
					<input
						type="string"
						ref={saveDataRef}
						className="debug-input"
					/>

					<button
						id="test-phrase-button"
						className="debug-button"
						onClick={() => {
							if (
								!saveDataRef.current.value ||
								saveDataRef.current.value == ""
							) {
								return;
							}
							localStorage.setItem(
								"whittle",
								saveDataRef.current.value
							);
							window.location.reload();
						}}
					>
						Load Save
					</button>
				</div>
				{gameState == "play" && (
					<div className="debug-section">
						<button
							id="test-phrase-button"
							className="debug-button"
							onClick={() => solvePuzzle(false)}
						>
							Solve Puzzle
						</button>
						<button
							id="test-phrase-button"
							className="debug-button"
							onClick={() => solvePuzzle(true)}
						>
							Solve Puzzle Today
						</button>
					</div>
				)}
			</div>
		</div>
	) : null;
}

export default Debug;
