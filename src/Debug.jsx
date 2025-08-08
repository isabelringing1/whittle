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
		playerData,
		setPlayerData,
		startingPhrase,
		showDebug,
		setShowDebug,
	} = props;

	const devMode = false;

	const testPhraseRef = useRef();
	const saveDataRef = useRef();
	const fileRef = useRef();

	const [betaCheckmark, setBetaCheckmark] = useState(false);
	const [loaded, setLoaded] = useState(false);

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

	useEffect(() => {
		if (!loaded && playerData) {
			console.log(playerData.betaTester);
			setBetaCheckmark(playerData.betaTester ?? false);
			setLoaded(true);
		}
	}, [playerData]);

	const toggleShowDebug = () => {
		setShowDebug((prevShowDebug) => !prevShowDebug);
	};

	const onBetaTesterCheckboxChange = () => {
		if (playerData == null) {
			return;
		}
		setBetaCheckmark(!betaCheckmark);
		var newPlayerData = {
			...playerData,
		};
		newPlayerData.betaTester = !betaCheckmark;
		var saveString = JSON.stringify(newPlayerData);
		localStorage.setItem("whittle", window.btoa(saveString));
		console.log("beta is " + !betaCheckmark);
		console.log(newPlayerData);
		setPlayerData(newPlayerData);
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

	const generateAllInfo = (e) => {
		var reader = new FileReader();
		var file = e.target.files[0];
		console.log(file);
		reader.onload = function (progressEvent) {
			// Entire file
			const text = this.result;
			// By lines
			var lines = text.split("\n");
			var output = "";
			for (var line = 0; line < lines.length; line++) {
				var possibleWords = generatePossibleWords(
					lines[line],
					allPossibleWords,
					true
				);
				var combos = [];
				Object.keys(possibleWords).forEach((word, i) => {
					if (word[0] == "*") {
						combos.push(word.slice(1));
					}
				});
				output +=
					lines[line] +
					"/" +
					combos +
					"/" +
					Object.keys(possibleWords).length +
					"/" +
					Object.keys(possibleWords) +
					"\n";
			}
			console.log(output);
			navigator.clipboard.writeText(output);
		};
		reader.readAsText(file);
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
						type="checkbox"
						checked={betaCheckmark}
						disabled={!playerData}
						className="debug-checkbox"
						onChange={onBetaTesterCheckboxChange}
					/>{" "}
					Beta Tester
				</div>
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
							id="solve-puzzle-button"
							className="debug-button"
							onClick={() => solvePuzzle(false)}
						>
							Solve Puzzle
						</button>
						<button
							id="solve-puzzle-today-button"
							className="debug-button"
							onClick={() => solvePuzzle(true)}
						>
							Solve Puzzle Today
						</button>
					</div>
				)}
				{/* <div className="debug-section">
					CSV generator
					<br />
					<input
						type="file"
						name="file"
						id="file"
						ref={fileRef}
						onChange={generateAllInfo}
					/>
				</div> */}
			</div>
		</div>
	) : null;
}

export default Debug;
