import { useState, useEffect } from "react";

function Letter(props) {
	const { letter, id, index, onClick } = props;

	const [letterClass, setLetterClass] = useState("letter");

	useEffect(() => {
		setDefaultLetterClass();
	}, [letter]);

	const setDefaultLetterClass = () => {
		var cn = letter == " " ? "letter space" : "letter";
		setLetterClass(cn);
	};

	const onMouseDown = () => {
		setLetterClass(letterClass + " held");
	};

	const onMouseUp = () => {
		setDefaultLetterClass();
	};

	return (
		<div
			className={letterClass}
			id={id}
			onClick={(e) => onClick(index)}
			onMouseDown={onMouseDown}
			onTouchStart={onMouseDown}
			onMouseUp={onMouseUp}
			onTouchEnd={onMouseUp}
		>
			{letter}
		</div>
	);
}

export default Letter;
