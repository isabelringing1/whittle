import { useState, useEffect } from "react";

function Letter(props) {
	const {
		letter,
		id,
		index,
		onClick,
		totalLetters,
		isNewPuzzle,
		isTutorialLetter,
	} = props;

	const [letterClass, setLetterClass] = useState("letter");

	useEffect(() => {
		setDefaultLetterClass();
	}, [letter]);

	const setDefaultLetterClass = () => {
		var cn = letter == " " ? "letter space" : "letter";
		if (isNewPuzzle) {
			if (index <= totalLetters / 2) {
				cn += " new-shake-2";
			} else {
				cn += " new-shake";
			}
		}
		if (isTutorialLetter) {
			cn += " tutorial-letter";
		}

		setLetterClass(cn);
	};

	return (
		<div
			className={letterClass}
			id={id}
			onClick={(e) => {
				if (onClick != null) {
					onClick(index);
				}
			}}
		>
			{letter}
		</div>
	);
}

export default Letter;
