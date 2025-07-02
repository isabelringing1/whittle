import { useRef, useEffect, useState } from "react";
import { generatePossibleWords } from "../public/util.js";

function Debug(props) {
	const {
		allPossibleWords,
		setCurrentDebugPuzzlePhrase,
		setGameState,
		setPrevGameState,
	} = props;

	const devMode = false;

	const [showDebug, setShowDebug] = useState(false);
	const testPhraseRef = useRef();

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

	return devMode && showDebug ? (
		<div className="debug-menu">
			<div className="debug-column">
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
					Get Info
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
		</div>
	) : null;
}

export default Debug;
