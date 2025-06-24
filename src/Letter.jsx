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
