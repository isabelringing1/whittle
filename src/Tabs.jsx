import { useState, useEffect, useRef } from "react";

import Definition from "./Definition";

function Tabs(props) {
	const {
		tryShowTabs,
		tabsShowing,
		foundWords,
		possibleWords,
		currentPhrase,
	} = props;

	const [currentTab, setCurrentTab] = useState(0);
	const [definitionsState, setDefinitionsState] = useState({});

	var definitions = useRef({});

	useEffect(() => {
		var words = currentPhrase.split(" ");
		if (words.length == 0) return;

		words.forEach((word, i) => {
			if (
				word != undefined &&
				word != "" &&
				!(word in definitions.current)
			) {
				getDefinition(word);
			}
		});
	}, [currentPhrase]);

	const onTabClicked = (tab) => {
		if (!tabsShowing) {
			tryShowTabs();
		}
		setCurrentTab(tab);
	};

	const getDefinition = (word) => {
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function () {
			if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
				definitions.current[word] = JSON.parse(xmlHttp.responseText)[0];
				setDefinitionsState(definitions.current);
			}
		};
		xmlHttp.open(
			"GET",
			"https://api.dictionaryapi.dev/api/v2/entries/en/" + word,
			true
		); // true for asynchronous
		xmlHttp.send(null);
	};

	const getFoundWordsSortedByLength = (wantBlanks = true) => {
		var wordsSortedByLength = [];
		var possibleWordsArray = Object.keys(possibleWords);
		possibleWordsArray.sort((a, b) => a.length - b.length);
		for (var i = 0; i < possibleWordsArray.length; i++) {
			var word = possibleWordsArray[i];
			while (wordsSortedByLength.length < word.length) {
				wordsSortedByLength.push([]);
			}
			if (word in foundWords) {
				wordsSortedByLength[word.length - 1].push(word);
			} else if (wantBlanks) {
				wordsSortedByLength[word.length - 1].push("BLANK");
			}
		}

		for (var i = 0; i < wordsSortedByLength.length; i++) {
			wordsSortedByLength[i].sort((a, b) => {
				if (a == "BLANK") return a;
				return a.length - b.length;
			});
		}

		return wordsSortedByLength.reverse();
	};

	return (
		<div id="tabs" className="popIn">
			<div
				className={
					"tab" + (currentTab == 0 ? " selected" : " unselected")
				}
				id="tab-1"
			>
				<div
					className={
						"top" + (currentTab == 0 ? " selected" : " unselected")
					}
					id="top-1"
					onClick={() => onTabClicked(0)}
				></div>
				<div className="definitions-container">
					{currentPhrase &&
						definitionsState &&
						currentPhrase.split(" ").map((word, i) => {
							if (
								word != undefined &&
								word != "" &&
								word in definitionsState
							) {
								var definition = definitionsState[word];
								return definition ? (
									<Definition
										key={"definition-" + i}
										id={"definition-" + i}
										def={definition}
									/>
								) : null;
							}
						})}
				</div>
			</div>
			<div
				className={
					"tab" + (currentTab == 1 ? " selected" : " unselected")
				}
				id="tab-2"
			>
				<div
					className={
						"top" + (currentTab == 1 ? " selected" : " unselected")
					}
					id="top-2"
					onClick={() => onTabClicked(1)}
				></div>

				<div className="found-words-container">
					{getFoundWordsSortedByLength().map((wordList, i) => {
						return (
							<div key={"word-list-" + i}>
								{wordList.map((word, j) => {
									return word == "BLANK" ? (
										<span
											className="blank-word"
											key={"word-" + i + "-" + j}
										>
											{" "}
										</span>
									) : (
										<span
											className="found-word"
											key={"word-" + i + "-" + j}
										>
											{word}
											{j == wordList.length - 1
												? ""
												: ", "}
										</span>
									);
								})}
								{}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export default Tabs;
