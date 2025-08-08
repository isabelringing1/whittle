import { useState, useEffect, useRef } from "react";

import Letter from "./Letter";
import Tabs from "./Tabs";
import GameOver from "./GameOver";
import Dialog from "./Dialog";

import backArrow2 from "/images/back_arrow_2.png";
import restartImg from "/images/restart.png";
import lightbulb from "/images/lightbulb.png";

import {
	reportFoundEveryWord,
	reportWonTodaysPuzzle,
} from "../public/analytics";

import { generatePossibleWords, areValidWords } from "../public/util.js";

function LetterPuzzle(props) {
	const {
		gameState,
		prevGameState,
		setGameState,
		setPrevGameState,
		allPossibleWords,
		saveData,
		data,
		id,
		startingPhrase,
		isArchivePuzzle,
		isDebug,
		number,
		isNewPuzzleRef,
	} = props;

	const [letters, setLetters] = useState([]);
	const [letterStates, setLetterStates] = useState([]);
	const [letterRemovalOrder, setLetterRemovalOrder] = useState([]);
	const [moves, setMoves] = useState([]);
	const [possibleWords, setPossibleWords] = useState({});
	const [foundWords, setFoundWords] = useState({});
	const [solved, setSolved] = useState(false);
	const [gameOverShowState, setGameOverShowState] = useState("hide"); // hide, win, complete, win_and_complete
	const [highlightedIndex, setHighlightedIndex] = useState(-1);
	const [showHintsButton, setShowHintsButton] = useState(false);
	const [hints, setHints] = useState(false);
	const [hintAnimInterval, setHintAnimInterval] = useState(true);

	const [tabsAnimating, setTabsAnimating] = useState(false);
	const [isAnimating, setIsAnimating] = useState(false);
	const [isNewBestScore, setIsNewBestScore] = useState(false);

	const [currentPhrase, setCurrentPhrase] = useState("");
	const [dialogState, setDialogState] = useState("none"); // none, hint

	const tabsShowing = useRef(false);
	const touchStart = useRef(null);
	const touchEnd = useRef(null);

	const minSwipeDistance = 50;

	useEffect(() => {
		if (Object.keys(allPossibleWords).length == 0) {
			return;
		}
		startGameFromPhrase(startingPhrase);
		var content = document.getElementById("content");
		content.addEventListener("click", (e) => {
			if (
				e.target.classList.contains("container") &&
				!e.target.classList.contains("letters-container")
			) {
				tryHideTabs();
			}
		});
	}, [allPossibleWords]);

	useEffect(() => {
		if (isDebug) {
			return;
		}
		var percent = getPercentWordsFound();
		var completedToday =
			(data && data.completedToday) ||
			(!isArchivePuzzle && percent >= 100);

		var newData = {
			foundWords: foundWords,
			percentFound: percent,
			solved: solved,
			completedToday: completedToday,
			bestMoves: data ? data.bestMoves : undefined,
			hints: hints,
		};
		if (!isArchivePuzzle && gameState != "play") {
			if (
				(!data.bestMoves || data.bestMoves.length > moves.length) &&
				gameOverShowState != "complete"
			) {
				newData.bestMoves = moves;
				if (data.bestMoves != undefined) {
					setIsNewBestScore(true);
				}
			}
		}
		saveData(newData);
	}, [foundWords, solved, gameState, hints]);

	useEffect(() => {
		var limit = startingPhrase.length * 3;
		if (moves.length > limit && !showHintsButton && !hints && !solved) {
			setShowHintsButton(true);
		}
	}, [moves]);

	useEffect(() => {
		if (data && data.foundWords) {
			setFoundWords(data.foundWords);
			setSolved(data.solved);
			setHints(data.hints);
		}
	}, []);

	const restart = () => {
		setPrevGameState(gameState);
		setLetterRemovalOrder([]);
		setGameState("play");

		setIsNewBestScore(false);
		var newLetterStates = [];
		for (var i = 0; i < currentPhrase.length; i++) {
			newLetterStates.push(true);
		}
		setLetterStates(newLetterStates);

		Array.from(document.getElementsByClassName("letter")).forEach(
			(letter) => {
				letter.classList.remove("disappear");
			}
		);
		var lettersContainer = document.getElementById(
			"letters-container-" + id
		);

		lettersContainer?.classList.remove("green");
	};

	const canRestart = () => {
		return letterRemovalOrder.length > 0;
	};

	const startGameFromPhrase = (phrase) => {
		setCurrentPhrase(phrase);
		var newLetters = [];
		var newLetterStates = [];
		for (var i = 0; i < phrase.length; i++) {
			newLetters.push(phrase[i]);
			newLetterStates.push(true);
		}
		setLetters(newLetters);
		setLetterStates(newLetterStates);
		setIsNewBestScore(false);
		var newPossibleWords = generatePossibleWords(phrase, allPossibleWords);
		setPossibleWords(newPossibleWords);
		var words = phrase.split(" ");
		var newFoundWords = {};
		for (var i = 0; i < words.length; i++) {
			newFoundWords[words[i]] = true;
		}
		setFoundWords(newFoundWords);
	};

	const onLetterClick = (index) => {
		if (isAnimating || gameState != "play") {
			return;
		}

		var potentiaPhrase = getPhrase(index);
		var words = potentiaPhrase.split(" ");
		var isCombo = letters[index] == " " && isInMiddleOfVisibleWord(index);
		var foundNewWord = false;
		if (areValidWords(words, allPossibleWords)) {
			var newFoundWords = { ...foundWords };
			for (var i = 0; i < words.length; i++) {
				if (!(words[i] in foundWords) && words[i].length > 0) {
					if (isCombo) {
						showNewComboWord(words[i], i);
					} else {
						showNewWord(words[i], i);
					}
					if (!(words[i] in newFoundWords)) {
						newFoundWords[words[i]] = true;
						foundNewWord = true;
					}
				}
			}
			setFoundWords(newFoundWords);
			var completion = false;
			if (foundNewWord || !solved) {
				var newPercent = Math.floor(
					(100 * Object.keys(newFoundWords).length) /
						Object.entries(possibleWords).length
				);
				if (newPercent >= 100) {
					completion = true;
				}
			}
			removeLetterAtIndex(index, isCombo, completion);
			addToMoves(isCombo ? "combo" : "success");
		} else {
			failRemoveLetterAtIndex(index);
			addToMoves("fail");
		}
	};

	const addToMoves = (moveType) => {
		var newMoves = [...moves];
		newMoves.push(moveType);
		setMoves(newMoves);
	};

	const isInMiddleOfVisibleWord = (index) => {
		var letterShowingBefore = false;
		for (var i = index - 1; i >= 0; i--) {
			// check that at least one letter before is showing
			if (letterStates[i] && letters[i] != " ") {
				letterShowingBefore = true;
			}
		}
		var letterShowingAfter = false;
		for (var i = index + 1; i < letterStates.length; i++) {
			// check that at least one letter after is showing
			if (letterStates[i] && letters[i] != " ") {
				letterShowingAfter = true;
			}
		}
		return letterShowingBefore && letterShowingAfter;
	};

	const getPhrase = (potential_removal_index = -1) => {
		var phrase = "";
		for (var i = 0; i < letterStates.length; i++) {
			if (letterStates[i] && i != potential_removal_index) {
				phrase += letters[i];
			}
		}
		return phrase;
	};

	const removeLetterAtIndex = (index, isCombo, completion) => {
		var letter = document.getElementById("letter-" + index);
		if (letter.classList.contains("disappear")) {
			return;
		}

		var newLetterStates = [...letterStates];
		newLetterStates[index] = false;
		setLetterStates(newLetterStates);
		var lettersLeft = newLetterStates.filter((e) => e).length;

		var newLetterRemovalOrder = [...letterRemovalOrder];
		newLetterRemovalOrder.push(index);
		setLetterRemovalOrder(newLetterRemovalOrder);

		letter.classList.add("disappear");
		setIsAnimating(true);
		setTimeout(() => {
			var lettersContainer = document.getElementById(
				"letters-container-" + id
			);
			lettersContainer.classList.add(isCombo ? "purple" : "green");
			if (lettersLeft > 0) {
				setTimeout(() => {
					lettersContainer.classList.remove(
						isCombo ? "purple" : "green"
					);
					setIsAnimating(false);
				}, 300);
			}

			var onlySpaces = checkForOnlySpaces(newLetterStates);
			if (lettersLeft == 0 || onlySpaces) {
				if (completion && !solved) {
					showGameOverScreen("win_and_complete");
				} else {
					showGameOverScreen("win");
				}
				setSolved(true);
			}
			if (solved && completion) {
				// won previously
				showGameOverScreen("complete");
			}
		}, 100);
	};

	const checkForOnlySpaces = (letterStates) => {
		var onlyVisibleSpaces = letterStates.filter((e) => e).length > 0;
		for (var i = 0; i < letterStates.length; i++) {
			if (letterStates[i] == true && letters[i] != " ") {
				onlyVisibleSpaces = false;
			}
		}
		return onlyVisibleSpaces;
	};

	const failRemoveLetterAtIndex = (index) => {
		var letter = document.getElementById("letter-" + index);
		if (letter.classList.contains("disappear")) {
			return;
		}
		letter.classList.add("disappear");
		setIsAnimating(true);
		setTimeout(() => {
			var lettersContainer = document.getElementById(
				"letters-container-" + id
			);
			lettersContainer.classList.add("red");
			lettersContainer.classList.add("error-shake");
			setTimeout(() => {
				letter.classList.remove("disappear");
				setTimeout(() => {
					lettersContainer.classList.remove("red");
					lettersContainer.classList.remove("error-shake");
					setIsAnimating(false);
				}, 100);
			}, 400);
		}, 100);
	};

	const undo = () => {
		if (letterRemovalOrder.length == 0) {
			return;
		}
		var newLetterRemovalOrder = [...letterRemovalOrder];
		var undoIndex = newLetterRemovalOrder.pop();
		var letter = document.getElementById("letter-" + undoIndex);
		letter.classList.remove("disappear");
		var newLetterStates = [...letterStates];
		newLetterStates[undoIndex] = true;
		setLetterStates(newLetterStates);

		setLetterRemovalOrder(newLetterRemovalOrder);
	};

	const canUndo = () => {
		return letterRemovalOrder.length > 0;
	};

	const showNewComboWord = (word, wordIndex) => {
		var newWordContainer = document.getElementById(
			"new-combo-word-container-" + id
		);
		if (newWordContainer.classList.contains("new-combo-word-anim")) {
			newWordContainer.classList.remove("new-combo-word-anim");
			newWordContainer.offsetHeight; /* trigger reflow */
		}
		newWordContainer.classList.add("new-combo-word-anim");

		if (!tabsShowing.current) {
			var tab2 = document.getElementById("tab-2");
			if (tab2.classList.contains("hop")) {
				tab2.classList.remove("hop");
				tab2.offsetHeight; /* trigger reflow */
			}
			tab2.classList.add("hop");
		}
		showFireworks(true);
	};

	const showNewWord = (word, wordIndex) => {
		var newWordContainer = document.getElementById(
			"new-word-container-" + id
		);

		if (newWordContainer.classList.contains("new-word-anim")) {
			newWordContainer.classList.remove("new-word-anim");
			newWordContainer.offsetHeight; /* trigger reflow */
		}
		newWordContainer.classList.add("new-word-anim");

		if (!tabsShowing.current) {
			hopWordlistTab();
		}
	};

	const getPercentWordsFound = () => {
		return Math.floor(
			(100 * Object.keys(foundWords).length) /
				Object.entries(possibleWords).length
		);
	};

	const tryShowTabs = () => {
		var tabs = document.getElementById("tabs");
		if (!tabsShowing.current && !tabsAnimating) {
			setTabsAnimating(true);
			tabs.classList = "up";
			tabsShowing.current = true;
			setTimeout(() => {
				setTabsAnimating(false);
			}, 800);
		}
	};

	const tryHideTabs = () => {
		var tabs = document.getElementById("tabs");
		if (tabs != null && tabsShowing.current && !tabsAnimating) {
			setTabsAnimating(true);
			tabsShowing.current = false;
			tabs.classList = "down";
			setTimeout(() => {
				setTabsAnimating(false);
			}, 800);
		}
	};

	const tryHideTabsCompletely = () => {
		var tabs = document.getElementById("tabs");
		if (tabsShowing.current) {
			tabs.classList = "popDownFromUp";
		} else {
			tabs.classList = "popDownFromDown";
		}
		tabsShowing.current = false;
	};

	const tryPopInTabs = () => {
		var tabs = document.getElementById("tabs");
		tabs.classList = "popIn";
		tabsShowing.current = false;
	};

	const continueGame = () => {
		setPrevGameState(gameState);
		restart();
		setMoves([]);
		tryPopInTabs();
		setGameOverShowState("hide");
	};

	const goToMenu = () => {
		setPrevGameState(gameState);
		setGameState("menu");
		setGameOverShowState("hide");
	};

	const goToArchive = () => {
		setPrevGameState(gameState);
		setGameState("archive");
		setGameOverShowState("hide");
	};

	const showFireworks = (show_purple) => {
		var args = {};
		if (show_purple) {
			args.colors = ["#c23fff6c"];
		}
		setTimeout(() => {
			confetti({
				...args,
				startVelocity: 15,
				spread: 230,
				ticks: 60,
				zIndex: 0,
				gravity: 0.5,
				particleCount: 40,
				origin: {
					x: 0.5,
					y: 0.35,
				},
				scalar: 0.5,
			});
		}, 450);
	};

	const showGameOverScreen = (state) => {
		if (!solved) {
			reportWonTodaysPuzzle(id, !isArchivePuzzle);
		}
		if (state != "win" && !isArchivePuzzle) {
			reportFoundEveryWord(id);
		}

		var delay = 0;
		if (state == "complete" || state == "win_and_complete") {
			showFireworks();
			delay = 1000;
		}

		setTimeout(() => {
			setPrevGameState("play");
			setGameState("win");
			setIsAnimating(false);
			tryHideTabsCompletely();
			setGameOverShowState(state);
		}, delay);
	};

	const onTouchStart = (e) => {
		if (!e.target.classList.contains("letter")) {
			return;
		}
		var idArray = e.target.id.split("-");
		var index = parseInt(idArray[idArray.length - 1]);
		if (index != highlightedIndex) {
			if (highlightedIndex != -1) {
				document
					.getElementById("letter-" + highlightedIndex)
					.classList.remove("held");
			}

			document.getElementById("letter-" + index).classList.add("held");
			setHighlightedIndex(index);
		}
	};

	const onTouchMove = (e) => {
		var highlightedLetter = document.elementFromPoint(
			e.touches[0].clientX,
			e.touches[0].clientY
		);
		if (!highlightedLetter.classList.contains("letter")) {
			if (highlightedIndex != -1) {
				document
					.getElementById("letter-" + highlightedIndex)
					.classList.remove("held");
				setHighlightedIndex(-1);
			}
			return;
		}
		var idArray = highlightedLetter.id.split("-");
		var index = parseInt(idArray[idArray.length - 1]);

		if (index != highlightedIndex) {
			if (highlightedIndex != -1) {
				document
					.getElementById("letter-" + highlightedIndex)
					.classList.remove("held");
			}
			document.getElementById("letter-" + index).classList.add("held");
			setHighlightedIndex(index);
		}
	};

	const onMouseMove = (e) => {
		if (highlightedIndex == -1 || !e.target.classList.contains("letter")) {
			if (highlightedIndex != -1) {
				document
					.getElementById("letter-" + highlightedIndex)
					.classList.remove("held");
			}
			setHighlightedIndex(-1);
			return;
		}
		var idArray = e.target.id.split("-");
		var index = parseInt(idArray[idArray.length - 1]);

		if (index != highlightedIndex) {
			if (highlightedIndex != -1) {
				document
					.getElementById("letter-" + highlightedIndex)
					.classList.remove("held");
			}
			document.getElementById("letter-" + index).classList.add("held");
			setHighlightedIndex(index);
		}
	};

	const onTouchEnd = (e) => {
		var highlightedLetter = document.getElementById(
			"letter-" + highlightedIndex
		);
		if (
			!highlightedLetter ||
			!highlightedLetter.classList.contains("letter")
		) {
			return;
		}

		highlightedLetter.classList.remove("held");
		setHighlightedIndex(-1);
		onLetterClick(highlightedIndex);
	};

	const onContainerTouchStart = (e) => {
		touchEnd.current = null;
		if (
			e.targetTouches != null &&
			!e.target.classList.contains("letter") &&
			e.target.closest(".puzzle-button") == null &&
			e.target.closest(".scrollable") == null
		) {
			touchStart.current = e.targetTouches[0].clientY;
		}
		if (
			e.target.classList.contains("letter") ||
			e.target.closest(".puzzle-button") != null ||
			e.target.closest("#tabs") != null
		) {
			return;
		}
		for (var i = 0; i < letters.length; i++) {
			if (letters[i] == " ") {
				var letter = document.getElementById("letter-" + i);
				if (letter) {
					letter.classList.add("preview");
				}
			}
		}
	};

	const onContainerTouchEnd = (e) => {
		for (var i = 0; i < letters.length; i++) {
			if (letters[i] == " ") {
				var letter = document.getElementById("letter-" + i);
				if (letter) {
					letter.classList.remove("preview");
				}
			}
		}

		if (!touchStart.current || !touchEnd.current) return;
		const distance = touchStart.current - touchEnd.current;
		const isUpSwipe = distance > minSwipeDistance;
		const isDownSwipe = distance < -minSwipeDistance;
		if (isUpSwipe) {
			tryShowTabs();
		} else if (isDownSwipe) {
			tryHideTabs();
		}
	};

	const onContainerTouchMove = (e) => {
		if (
			e.targetTouches != null &&
			e.target.closest(".scrollable") == null
		) {
			touchEnd.current = e.targetTouches[0].clientY;
		}
	};

	const hopWordlistTab = () => {
		var tab2 = document.getElementById("tab-2");
		if (tab2.classList.contains("hop")) {
			tab2.classList.remove("hop");
			tab2.offsetHeight; /* trigger reflow */
		}
		tab2.classList.add("hop");
	};

	return (
		<div
			className="letter-puzzle-container container"
			onMouseDown={onContainerTouchStart}
			onTouchStart={onContainerTouchStart}
			onMouseUp={onContainerTouchEnd}
			onTouchEnd={onContainerTouchEnd}
			onTouchMove={onContainerTouchMove}
		>
			{gameOverShowState != "hide" && (
				<GameOver
					gameOverShowState={gameOverShowState}
					moves={moves}
					bestMoves={data ? data.bestMoves : undefined}
					continueGame={continueGame}
					percent={getPercentWordsFound()}
					goToMenu={goToMenu}
					isPerfect={
						(gameOverShowState != "complete" &&
							startingPhrase.length >= moves.length) ||
						(gameOverShowState == "complete" &&
							data &&
							data.bestMoves &&
							startingPhrase.length >= data.bestMoves.length)
					}
					isArchivePuzzle={isArchivePuzzle}
					goToArchive={goToArchive}
					isNewBestScore={isNewBestScore}
					number={number}
				/>
			)}

			{gameState == "play" && (
				<div
					id={"letters-container-" + id}
					className="letters-container container"
					onTouchStart={onTouchStart}
					onTouchMove={onTouchMove}
					onTouchEnd={onTouchEnd}
					onMouseDown={onTouchStart}
					onMouseMove={onMouseMove}
					onMouseUp={onTouchEnd}
				>
					<div
						className="new-word-container"
						id={"new-word-container-" + id}
					>
						New Word!
					</div>
					<div
						className="new-combo-word-container"
						id={"new-combo-word-container-" + id}
					>
						New Combo Word!
					</div>
					{letters.map((letter, i) => {
						var id = "letter-" + i;
						return (
							<Letter
								key={id}
								id={id}
								letter={letter}
								index={i}
								totalLetters={letters.length}
								isNewPuzzle={isNewPuzzleRef.current}
							/>
						);
					})}
				</div>
			)}
			{gameState == "play" && (
				<div id="button-container" className="container">
					<button
						className="restart puzzle-button"
						onClick={restart}
						disabled={!canRestart()}
					>
						<div className="puzzle-button-img-container">
							<img
								src={restartImg}
								className="restart-button-img"
							/>
						</div>
					</button>
					<button
						className="undo puzzle-button"
						onClick={undo}
						disabled={!canUndo()}
					>
						<div className="puzzle-button-img-container">
							<img src={backArrow2} className="undo-button-img" />
						</div>
					</button>
				</div>
			)}

			{gameState == "play" && (showHintsButton || hints) && !solved && (
				<div
					className={
						"small-circle-button hint-button-top-bar" +
						(hints ? " hints-button-pressed" : "")
					}
					onClick={() => {
						if (!hints) {
							setDialogState("hint");
						}
					}}
				>
					<img src={lightbulb} className="hint-button-icon" />
				</div>
			)}
			{dialogState != "none" && (
				<Dialog
					dialogState={dialogState}
					setDialogState={setDialogState}
					buttonActions={[
						() => {
							setHints(true);
							setDialogState("none");
							hopWordlistTab();
							var interval = setInterval(hopWordlistTab, 2000);
							setHintAnimInterval(interval);
						},
						() => setDialogState("none"),
					]}
				/>
			)}
			<div id="footer">
				<Tabs
					tryShowTabs={tryShowTabs}
					tryHideTabs={tryHideTabs}
					tabsShowing={tabsShowing.current}
					foundWords={foundWords}
					possibleWords={possibleWords}
					currentPhrase={getPhrase(-1)}
					solved={solved}
					hints={hints}
					hintAnimInterval={hintAnimInterval}
					setHintAnimInterval={setHintAnimInterval}
				/>
			</div>
		</div>
	);
}

export default LetterPuzzle;
