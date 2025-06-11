import { useState, useEffect } from "react";
import puzzles from "/data/puzzles.txt";
import wordData from "/data/wl.txt";
import restartImg from "/images/restart.png";

import "./App.css";
import Letter from "./Letter";

function App() {
	const [wordDict, setWordDict] = useState({});
	const [letters, setLetters] = useState([]);
	const [letterStates, setLetterStates] = useState([]);
	const [solutionDict, setSolutionDict] = useState({});
	const [isAnimating, setIsAnimating] = useState(false);
	const [gameState, setGameState] = useState(0); // 0 = in play, 1 = win, 2 = loss

	useEffect(() => {
		readDataAsync();
		restart();
	}, []);

	const restart = (e) => {
		setLettersFromString("splatter");
		setGameState(0);
		setIsAnimating(false);
		console.log("restarting");
		Array.from(document.getElementsByClassName("letter")).forEach(
			(letter) => {
				letter.classList.remove("disappear");
			}
		);
		var lettersContainer = document.getElementById("letters-container");
		lettersContainer.classList.remove("green");
	};

	const readDataAsync = async () => {
		try {
			const wordsResponse = await fetch(wordData);
			const wordsText = await wordsResponse.text();
			var words = wordsText.split("\n");
			var newWordDict = {};
			words.forEach((word) => {
				newWordDict[word] = true;
			});
			setWordDict(newWordDict);

			// need to consider possible words that AREN'T valid solutions, btw
			const response = await fetch(puzzles);
			const text = await response.text();
			var solutions = text.split("\n");
			createSolutionDictForWord(solutions);
		} catch (error) {
			console.error("Error loading data:", error);
		}
	};

	const createSolutionDictForWord = (solutions) => {
		var newSolutionDict = {};
		solutions.forEach((solution, i) => {
			var words = solution.split(",");
			for (var i = 0; i < words.length; i++) {
				var word = words[i];
				var nextWord = words[i + 1];
				if (i == words.length - 1) {
					//single letter
					newSolutionDict[word] = true;
				} else {
					if (word in newSolutionDict) {
						if (!newSolutionDict[word].includes(nextWord)) {
							newSolutionDict[word].push(nextWord);
						}
					} else {
						newSolutionDict[word] = [nextWord];
					}
				}
			}
		});

		setSolutionDict(newSolutionDict);
	};

	const setLettersFromString = (str) => {
		var newLetters = [];
		var newLetterStates = [];
		for (var i = 0; i < str.length; i++) {
			newLetters.push(str[i]);
			newLetterStates.push(true);
		}
		setLetters(newLetters);
		setLetterStates(newLetterStates);
	};

	const onClick = (index) => {
		if (isAnimating || gameState != 0) {
			return;
		}
		if (isValidRemoval(index)) {
			removeLetterAtIndex(index);
		} else {
			failRemoveLetterAtIndex(index);
		}
	};

	const isValidRemoval = (index) => {
		var potentialWord = getWord(index);
		return potentialWord in wordDict;
	};

	const getWord = (potential_removal_index = -1) => {
		var word = "";
		for (var i = 0; i < letterStates.length; i++) {
			if (letterStates[i] && i != potential_removal_index) {
				word += letters[i];
			}
		}
		return word;
	};

	const removeLetterAtIndex = (index) => {
		var letter = document.getElementById("letter-" + index);
		if (letter.classList.contains("disappear")) {
			return;
		}

		var newLetterStates = [...letterStates];
		newLetterStates[index] = false;
		setLetterStates(newLetterStates);
		var lettersLeft = newLetterStates.filter((e) => e).length;

		letter.classList.add("disappear");
		setIsAnimating(true);
		setTimeout(() => {
			var lettersContainer = document.getElementById("letters-container");
			lettersContainer.classList.add("green");
			if (lettersLeft > 1) {
				setTimeout(() => {
					lettersContainer.classList.remove("green");
					setIsAnimating(false);
				}, 300);
			} else {
				setGameState(1);
				setIsAnimating(false);
			}
		}, 100);
	};

	const failRemoveLetterAtIndex = (index) => {
		var letter = document.getElementById("letter-" + index);
		if (letter.classList.contains("disappear")) {
			return;
		}
		letter.classList.add("disappear");
		setIsAnimating(true);
		setTimeout(() => {
			var lettersContainer = document.getElementById("letters-container");
			lettersContainer.classList.add("red");
			setTimeout(() => {
				letter.classList.remove("disappear");
				setTimeout(() => {
					lettersContainer.classList.remove("red");
					setIsAnimating(false);
				}, 100);
			}, 300);
		}, 100);
	};

	return (
		<div className="content">
			<div id="title">WHITTLE</div>
			<div id="body">
				<div id="letters-container">
					{letters.map((letter, i) => {
						var id = "letter-" + i;
						return (
							<Letter
								key={id}
								id={id}
								index={i}
								letter={letter}
								onClick={onClick}
							/>
						);
					})}
				</div>
			</div>
			<div id="footer">
				<div id="game-over-text">{gameState == 1 && "Nice work!"}</div>
				<div id="restart-button">
					{gameState != 0 && (
						<img
							className="restart"
							src={restartImg}
							onClick={restart}
						/>
					)}
				</div>
			</div>
		</div>
	);
}

export default App;
