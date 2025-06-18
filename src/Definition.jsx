import { useState, useEffect } from "react";

function Definition(props) {
	const { id, def } = props;

	return (
		<div className="definition" id={id}>
			<div className="definition-header">
				<span className="definition-word">{def.word}</span>
				<span className="definition-dot">•</span>{" "}
				<span className="definition-partOfSpeech">
					{def.meanings[0].partOfSpeech}
				</span>
			</div>

			<div className="definition-body">
				{def.meanings[0].definitions[0].definition}
			</div>
		</div>
	);
}

export default Definition;
