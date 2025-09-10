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
			setLoaded(true);
		}
	}, [playerData]);

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
			var csvContent = "data:text/csv;charset=utf-8,";
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

				csvContent +=
					lines[line] +
					"," +
					turnIntoListString(combos) +
					"," +
					Object.keys(possibleWords).length +
					"," +
					turnIntoListString(Object.keys(possibleWords)) +
					"\r\n";
			}
			var a = document.createElement("a");
			document.body.appendChild(a);
			a.style = "display: none";

			var blob = new Blob([csvContent], {
				type: "text/csv;charset=utf-8",
			});
			a.href = window.URL.createObjectURL(blob);
			a.download = file.name.split(".")[0] + ".csv";
			a.click();
			window.URL.revokeObjectURL(a.href);
		};
		reader.readAsText(file);
	};

	const turnIntoListString = (list) => {
		var listString = "";
		for (var i = 0; i < list.length; i++) {
			listString += list[i];
			if (i < list.length - 1) {
				listString += "/";
			}
		}
		return listString;
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
				{
					<div className="debug-section">
						CSV generator
						<br />
						<input
							type="file"
							name="file"
							id="file"
							ref={fileRef}
							onChange={generateAllInfo}
						/>
					</div>
				}
			</div>
		</div>
	) : null;
}

export default Debug;
